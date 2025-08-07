import React from "react";
import CurrencyInput from "react-currency-input-field";

const currencyLocales = {
  USD: { locale: "en-US", currency: "USD" },
  EUR: { locale: "de-DE", currency: "EUR" },
  GBP: { locale: "en-GB", currency: "GBP" },
  JPY: { locale: "ja-JP", currency: "JPY" },
  INR: { locale: "en-IN", currency: "INR" },
};

export default function MaskedCurrencyInput({
  currency = "USD",
  onChange,
  defaultValue = "",
}) {
  const { locale, currency: currCode } =
    currencyLocales[currency] || currencyLocales["USD"];
  const decimals = currCode === "JPY" ? 0 : 2;

  return (
    <CurrencyInput
      intlConfig={{ locale, currency: currCode }}
      decimalsLimit={decimals}
      defaultValue={defaultValue ? parseFloat(defaultValue) : undefined}
      onValueChange={(value) => onChange(value || "")} // Pass empty string for undefined
      placeholder={new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currCode,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(0)}
      className="w-full p-2 rounded border text-right"
    />
  );
}
