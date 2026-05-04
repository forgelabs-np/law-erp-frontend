export const priceWithComma = (amount: number | string) => {
  if (amount === null || amount === undefined || amount === "") return "";

  const normalizedAmount =
    typeof amount === "string" ? Number(amount.replace(/,/g, "")) : amount;

  if (Number.isNaN(normalizedAmount)) {
    return `${amount}`;
  }

  const commaAmt = normalizedAmount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  return commaAmt;
};
