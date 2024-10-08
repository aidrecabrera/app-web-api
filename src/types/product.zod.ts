import * as z from 'zod'

export const OverheadExpenseSchema = z.object({
  expenseCategory: z.string(),
  costPerUnit: z.number(),
})
export type OverheadExpense = z.infer<typeof OverheadExpenseSchema>

export const ProductionForecastSchema = z.object({
  maximumUnitsProducible: z.number(),
  productionConstraint: z.string().optional(),
})
export type ProductionForecast = z.infer<typeof ProductionForecastSchema>

export const ProfitMarginSettingsSchema = z.object({
  calculationType: z.enum(['percentage', 'fixed']),
  percentageValue: z.number(),
})
export type ProfitMarginSettings = z.infer<typeof ProfitMarginSettingsSchema>

export const RawMaterialSchema = z.object({
  ingredientName: z.string(),
  stockOnHand: z.number(),
  quantityNeededPerUnit: z.number(),
  costPerUnit: z.number(),
})
export type RawMaterial = z.infer<typeof RawMaterialSchema>

export const ProductZodSchema = z.object({
  // input
  productName: z.string(),
  profitMarginSettings: ProfitMarginSettingsSchema,
  // ingredients
  rawMaterials: z.array(RawMaterialSchema),
  overheadExpenses: z.array(OverheadExpenseSchema),
  manufacturingCostPerUnit: z.number().optional(),
  // output
  productionForecast: ProductionForecastSchema.optional(),
  recommendedRetailPrice: z.number().optional(),
})
export type ProductSchema = z.infer<typeof ProductZodSchema>
