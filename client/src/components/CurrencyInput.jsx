import React, { useState } from "react";

const currencyLocales = {
  USD: { locale: "en-US", currency: "USD" },
  EUR: { locale: "de-DE", currency: "EUR" },
  GBP: { locale: "en-GB", currency: "GBP" },
  JPY: { locale: "ja-JP", currency: "JPY" },
  INR: { locale: "en-IN", currency: "INR" },
};

export default function MaskedCurrencyInput({ currency = "USD", onChange }) {
  const [rawValue, setRawValue] = useState("");

  const formatCurrency = (val) => {
    const { locale, currency: currCode } =
      currencyLocales[currency] || currencyLocales["USD"];
    const number = parseFloat(val);
    const safeNumber = isNaN(number) ? 0 : number / 100;

    return safeNumber.toLocaleString(locale, {
      minimumFractionDigits: currCode === "JPY" ? 0 : 2,
      maximumFractionDigits: currCode === "JPY" ? 0 : 2,
    });
  };

  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setRawValue(digitsOnly);
    onChange(formatCurrency(digitsOnly));
  };

  return (
    <input
      type="text"
      value={formatCurrency(rawValue)}
      onChange={handleChange}
      placeholder={formatCurrency("")}
      className="w-full p-2 rounded border text-right"
    />
  );
}
