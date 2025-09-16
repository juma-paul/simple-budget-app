import { useState, useEffect } from "react";

const CURRENCY_CONFIG = {
  USD: { locale: "en-US", code: "USD", decimals: 2 },
  EUR: { locale: "de-DE", code: "EUR", decimals: 2 },
  GBP: { locale: "en-GB", code: "GBP", decimals: 2 },
  JPY: { locale: "ja-JP", code: "JPY", decimals: 0 },
  INR: { locale: "en-IN", code: "INR", decimals: 2 },
};

export default function CurrencyInputField({
  currency = "USD",
  value = 0,
  onChange,
  className = "",
  disabled = false,
  readOnly = false,
}) {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const [rawValue, setRawValue] = useState(
    String(config.decimals > 0 ? Math.round(value * 100) : Math.round(value))
  );

  useEffect(() => {
    setRawValue(
      String(config.decimals > 0 ? Math.round(value * 100) : Math.round(value))
    );
  }, [value, config.decimals]);

  const formatValue = (numString) => {
    let num = parseInt(numString || "0", 10);
    if (isNaN(num)) num = 0;

    const divisor = config.decimals > 0 ? Math.pow(10, config.decimals) : 1;
    const amount = num / divisor;

    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);
  };

  const handleChange = (e) => {
    if (readOnly) return;

    const input = e.target.value.replace(/\D/g, "");
    setRawValue(input);

    const divisor = Math.pow(10, config.decimals);
    const num = parseInt(input || "0", 10) / divisor;

    onChange?.(num);
  };

  return (
    <input
      type="text"
      value={formatValue(rawValue)}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      className={`
        w-full p-3 rounded-lg border text-right text-white bg-gray-800
        border-gray-600 focus:border-blue-500 focus:outline-none
        ${disabled || readOnly ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    />
  );
}
