import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert trade compliance and sourcing advisor specializing in EU (Germany) imports from East Africa.

Your role is to explain supplier readiness scores clearly, conservatively, and factually.

You must:
- Explain what the score means in practical trade terms
- Reference German and EU buyer expectations where relevant
- Use calm, professional, non-judgmental language
- Focus on current, evidenced state only

You must NOT:
- Change or reinterpret the score
- Suggest that a supplier is "almost ready" if hard requirements are missing
- Predict commercial success or deal likelihood
- Use motivational or sales language
- Mention AI, models, or scoring formulas
- Use emojis or urgency language`;

function buildUserPrompt(payload: {
  status: string;
  totalScore: number;
  readinessScore: number;
  passedHardGates: boolean;
  hardGateFailures: { id: string; label: string; reason?: string }[];
  readinessBreakdown: { category: string; earnedPoints: number; maxPoints: number }[];
  riskPenalties: { id: string; label: string; penalty: number; reason: string }[];
  gaps: string[];
  supplierName: string;
  buyerName: string;
  corridor: string;
}): string {
  const gateFailuresText = payload.hardGateFailures.length > 0
    ? payload.hardGateFailures.map(g => `- ${g.label}: ${g.reason || 'Not met'}`).join('\n')
    : 'None - all hard gates passed';

  const breakdownText = payload.readinessBreakdown
    .map(c => `- ${c.category}: ${c.earnedPoints}/${c.maxPoints}`)
    .join('\n');

  const riskText = payload.riskPenalties.length > 0
    ? payload.riskPenalties.map(p => `- ${p.label}: -${p.penalty} points (${p.reason})`).join('\n')
    : 'None applied';

  const gapsText = payload.gaps.length > 0
    ? payload.gaps.map(g => `- ${g}`).join('\n')
    : 'No significant gaps identified';

  return `You are given the following supplier readiness assessment for the ${payload.corridor} trade corridor.

SUPPLIER: ${payload.supplierName}
BUYER: ${payload.buyerName}

SUPPLIER READINESS RESULT:
- Status: ${payload.status}
- Total Score: ${payload.totalScore} / 100
- Readiness Score (before penalties): ${payload.readinessScore}
- Passed Hard Gates: ${payload.passedHardGates ? 'Yes' : 'No'}

HARD GATE FAILURES (if any):
${gateFailuresText}

READINESS BREAKDOWN:
${breakdownText}

RISK PENALTIES:
${riskText}

IDENTIFIED GAPS:
${gapsText}

Provide:
1. Practical meaning of this score for EU trade
2. Key constraints (if blocked or not ready)
3. German buyer perspective on this supplier
4. Concrete next steps (if any)

Keep response under 150 words. Be direct and factual.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Quick return if no meaningful data
    if (!payload.gaps?.length && payload.passedHardGates !== false) {
      return new Response(
        JSON.stringify({ 
          explanation: "This supplier aligns well with current EU trade requirements for the Kenya-Germany corridor." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = buildUserPrompt({
      status: payload.status || 'NOT_READY',
      totalScore: payload.totalScore ?? 0,
      readinessScore: payload.readinessScore ?? 0,
      passedHardGates: payload.passedHardGates ?? true,
      hardGateFailures: payload.hardGateFailures || [],
      readinessBreakdown: payload.readinessBreakdown || [],
      riskPenalties: payload.riskPenalties || [],
      gaps: payload.gaps || [],
      supplierName: payload.supplierName || 'Unknown Supplier',
      buyerName: payload.buyerName || 'Unknown Buyer',
      corridor: payload.corridor || 'Kenya → Germany',
    });

    console.log("Calling Lovable AI Gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded", explanation: null }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required", explanation: null }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content ?? null;

    console.log("AI explanation generated successfully");

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("explain-fit error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage, explanation: null }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
