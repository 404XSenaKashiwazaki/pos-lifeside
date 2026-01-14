export const formatNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object" && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  const n = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};
