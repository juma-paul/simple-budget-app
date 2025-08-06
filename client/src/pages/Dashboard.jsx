import React, { useState } from "react";
import BudgetEntryForm from "../components/BudgetEntryForm.jsx";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("default");

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 p-6 space-y-4">

        <button
          onClick={() => setActiveView("default")}
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeView === "default"
              ? "bg-orange-500 text-white"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveView("budget")}
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeView === "budget"
              ? "bg-orange-500 text-white"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          Set Budget
        </button>

        {/* Add more buttons here as needed */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeView === "default" && (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-400">
              Select an option from the sidebar to get started.
            </p>
          </div>
        )}

        {activeView === "budget" && (
          <BudgetEntryForm onComplete={() => setActiveView("default")} />
        )}
      </div>
    </div>
  );
}
