import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

import { hydrateFeaturesFromDB } from "@/lib/features";
import { getFeatureFlags } from "@/lib/featureFlags";

getFeatureFlags().then(hydrateFeaturesFromDB);
