import React from "react";
import { useSelector, useDispatch } from "react-redux";
import BudgetStep1 from "./BudgetStep1.jsx";
import {
  resetBudgetState,
  setSubmitError,
  setSubmitSuccess,
} from "../redux/features/budget/budgetSlice.js";

export default function BudgetEntryForm() {
  const dispatch = useDispatch();
  const { step, setStep, tempData, validation, submitSuccess, submitError } =
    useSelector((state) => state.budget);

  const handleReset = () => {
    dispatch(resetBudgetState());
  };

  //   Dummy submit function used in step 3
  const handleSubmit = () => {
    if (!validation.isValid) return;

    try {
      console.log("Submitting data:", tempData);
      dispatch(setSubmitSuccess(true));
      dispatch(setSubmitError(null));
      dispatch(setStep(3));
    } catch (error) {
      dispatch(setSubmitSuccess(false));
      dispatch(setSubmitError("Submission failed"));
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4 bg-slate-900 rounded-xl shadow-lg text-white">
      {step === 1 && <BudgetStep1 />}
    </div>
  );
}
