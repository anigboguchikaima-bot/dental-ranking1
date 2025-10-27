// --- minimal App.jsx smoke test ---
import React from "react";

export default function DentalRankingApp() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(1200px 600px at 0% 0%, #fff0, rgba(255,0,122,0.12)), radial-gradient(900px 600px at 100% 100%, #fff0, rgba(0,255,150,0.12))",
        color: "#fff",
        fontSize: 28,
      }}
    >
      CHECKPOINT SMOKE
    </div>
  );
}
