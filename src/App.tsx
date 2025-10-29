import React from "react";
import IncidentDashboard from "./pages/IncidentDashboard.tsx";
import "./tailwind.css";
import "./App.css";

const App: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <main>
      <IncidentDashboard />
    </main>
  </div>
);
export default App;
