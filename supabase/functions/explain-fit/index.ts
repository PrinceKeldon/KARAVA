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

// Valid status values for supplier readiness
const VALID_STATUSES = ['BLOCKED', 'NOT_READY', 'CONDITIONALLY_READY', 'HIGH_READINESS'];

// Sanitize string to prevent prompt injection
function sanitizeString(str: unknown, maxLength = 100): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[{}[\]<>]/g, '') // Remove potential injection characters
    .replace(/\n{2,}/g, '\n') // Limit consecutive newlines
    .substring(0, maxLength)
    .trim();
}

// Validate and sanitize payload to prevent prompt injection
function validateAndSanitizePayload(data: unknown): {
  supplierName: string;
  buyerName: string;
  status: string;
  totalScore: number;
  readinessScore: number;
  passedHardGates: boolean;
  hardGateFailures: { id: string; label: string; reason?: string }[];
  readinessBreakdown: { category: string; earnedPoints: number; maxPoints: number }[];
  riskPenalties: { id: string; label: string; penalty: number; reason: string }[];
  gaps: string[];
  corridor: string;
} {
  const payload = data as Record<string, unknown>;
  
  // Validate status
  const status = VALID_STATUSES.includes(payload.status as string) 
    ? (payload.status as string) 
    : 'NOT_READY';

  // Sanitize and limit arrays
  const sanitizedGaps = Array.isArray(payload.gaps) 
    ? payload.gaps.slice(0, 20).map((g) => sanitizeString(g, 200)).filter(Boolean)
    : [];

  const sanitizedHardGateFailures = Array.isArray(payload.hardGateFailures)
    ? payload.hardGateFailures.slice(0, 10).map((g: unknown) => {
        const gate = g as Record<string, unknown>;
        return {
          id: sanitizeString(gate.id, 50),
          label: sanitizeString(gate.label, 100),
          reason: gate.reason ? sanitizeString(gate.reason, 200) : undefined,
        };
      })
    : [];

  const sanitizedBreakdown = Array.isArray(payload.readinessBreakdown)
    ? payload.readinessBreakdown.slice(0, 10).map((c: unknown) => {
        const cat = c as Record<string, unknown>;
        return {
          category: sanitizeString(cat.category, 50),
          earnedPoints: Math.max(0, Math.min(100, Number(cat.earnedPoints) || 0)),
          maxPoints: Math.max(0, Math.min(100, Number(cat.maxPoints) || 0)),
        };
      })
    : [];

  const sanitizedPenalties = Array.isArray(payload.riskPenalties)
    ? payload.riskPenalties.slice(0, 10).map((p: unknown) => {
        const pen = p as Record<string, unknown>;
        return {
          id: sanitizeString(pen.id, 50),
          label: sanitizeString(pen.label, 100),
          penalty: Math.max(0, Math.min(50, Number(pen.penalty) || 0)),
          reason: sanitizeString(pen.reason, 200),
        };
      })
    : [];

  return {
    supplierName: sanitizeString(payload.supplierName, 100) || 'Unknown Supplier',
    buyerName: sanitizeString(payload.buyerName, 100) || 'Unknown Buyer',
    status,
    totalScore: Math.max(0, Math.min(100, Number(payload.totalScore) || 0)),
    readinessScore: Math.max(0, Math.min(100, Number(payload.readinessScore) || 0)),
    passedHardGates: Boolean(payload.passedHardGates),
    hardGateFailures: sanitizedHardGateFailures,
    readinessBreakdown: sanitizedBreakdown,
    riskPenalties: sanitizedPenalties,
    gaps: sanitizedGaps,
    corridor: sanitizeString(payload.corridor, 50) || 'Kenya → Germany',
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawPayload = await req.json();
    
    // Validate and sanitize all input to prevent prompt injection
    const payload = validateAndSanitizePayload(rawPayload);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable", explanation: null }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Quick return if no meaningful data
    if (!payload.gaps.length && payload.passedHardGates !== false) {
      return new Response(
        JSON.stringify({ 
          explanation: "This supplier aligns well with current EU trade requirements for the Kenya-Germany corridor." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userPrompt = buildUserPrompt(payload);

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
    // Log full error details server-side for debugging
    console.error("explain-fit error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    // Return generic error message to client to prevent information leakage
    return new Response(
      JSON.stringify({ 
        error: "Unable to generate explanation. Please try again.", 
        explanation: null 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
