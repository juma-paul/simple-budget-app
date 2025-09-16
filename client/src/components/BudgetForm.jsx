import { useBudgetStore } from "../store/budgetStore.js";
import Step1 from "./budget/Step1.jsx";
import Step2 from "./budget/Step2.jsx";
import Step3 from "./budget/Step3.jsx";

export default function BudgetForm() {
  const step = useBudgetStore((state) => state.step);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-900 rounded-xl text-white shadow-lg">
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
    </div>
  );
}
