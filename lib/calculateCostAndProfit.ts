interface CalculateCostAndProfit {
   purchaseCost: number
  sabBase: number
  sabPricePerColor: number
  colorCount: number
  printArea: number
  quantity: number
  unitPrice: number
  totalAmount: number
}
export function calculateCostAndProfit({
  purchaseCost,
  sabBase,
  sabPricePerColor,
  colorCount,
  printArea,
  quantity,
  unitPrice,
  totalAmount,
}: CalculateCostAndProfit) {
  // 1. biaya sablon
  const sablonCost = sabBase + sabPricePerColor * colorCount * printArea;

  // 2. modal per pcs
  const costPrice = purchaseCost + sablonCost;

  // 3. modal total
  const costTotal = costPrice * quantity;

  // 4. profit per pcs
  const profitPerPcs = unitPrice - costPrice;

  // 5. total profit
  const totalProfit = totalAmount - costTotal;

  return {
    sablonCost,
    costPrice,
    costTotal,
    profitPerPcs,
    totalProfit,
  };
}
