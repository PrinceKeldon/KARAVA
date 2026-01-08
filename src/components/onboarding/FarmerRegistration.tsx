import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, MessageSquare, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FarmerRegistration({ onClose }: { onClose: () => void }) {
  const [method, setMethod] = useState<"sms" | "app" | null>(null);
  const [phone, setPhone] = useState("");

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-4xl">👨‍🌾</span>
        <h2 className="font-display text-2xl font-bold text-foreground mt-2">Farmer Registration</h2>
        <p className="text-sm text-muted-foreground">Join your processor's network and get better prices</p>
      </div>

      {/* Method Selection */}
      {!method ? (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground mb-4">How would you like to register?</p>
          
          <button
            onClick={() => setMethod("sms")}
            className="w-full p-4 rounded-xl border border-border hover:border-secondary hover:bg-secondary/5 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Via SMS</p>
              <p className="text-sm text-muted-foreground">No smartphone needed - register via text message</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setMethod("app")}
            className="w-full p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 text-left"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Via App</p>
              <p className="text-sm text-muted-foreground">Full features with our mobile-friendly web app</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="bg-muted/50 rounded-lg p-4 border border-border/50 mt-6">
            <p className="text-sm text-muted-foreground">
              🤝 <strong className="text-foreground">Already connected to a processor?</strong> They may have sent you an SMS invite. Check your messages!
            </p>
          </div>
        </div>
      ) : method === "sms" ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" />
              SMS Registration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Phone Number</label>
                <Input 
                  placeholder="+254 7XX XXX XXX" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">You'll receive an SMS asking for:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Your name
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Farm location (village/area)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Approximate trees/acres
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border font-mono text-sm">
                <p className="text-muted-foreground">Example reply:</p>
                <p className="text-foreground">"John Mwangi, Thika East, 120 trees"</p>
              </div>
            </div>
          </div>

          <Button variant="hero" className="w-full">
            Send Me SMS Instructions <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <button
            onClick={() => setMethod(null)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Choose different method
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-card rounded-xl p-5 border border-border shadow-soft">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              App Registration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
                <Input placeholder="e.g., John Mwangi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <Input placeholder="+254 7XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Farm Location</label>
                <Input placeholder="Village, County" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Trees/Acres</label>
                  <Input placeholder="e.g., 120" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Crop Type</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    <option>Macadamia</option>
                    <option>Sesame</option>
                    <option>Both</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              📍 <strong className="text-foreground">GPS Mapping:</strong> After registration, you can add your farm's GPS coordinates to become EUDR compliant and access premium buyers.
            </p>
          </div>

          <Button variant="hero" className="w-full">
            Register My Farm <Check className="w-4 h-4 ml-2" />
          </Button>
          
          <button
            onClick={() => setMethod(null)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Choose different method
          </button>
        </motion.div>
      )}

      {/* Cancel link */}
      <button
        onClick={onClose}
        className="w-full mt-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel and go back
      </button>
    </div>
  );
}
