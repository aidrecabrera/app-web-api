import {ObjectId} from 'mongodb'

export type calculationType = 'percentage' | 'fixed'

export interface OverheadExpense {
  costPerUnit: number
  expenseCategory: string
}

export interface ProductionForecast {
  maximumUnitsProducible: number
  productionConstraint: string
}

export interface ProfitMarginSettings {
  calculationType: string
  percentageValue: number
}

export interface RawMaterial {
  costPerUnit: number
  ingredientName: string
  quantityNeededPerUnit: number
  stockOnHand: number
}

export interface IProduct extends Document {
  _owner_id: ObjectId
  // input
  productName: string
  profitMarginSettings?: ProfitMarginSettings
  // ingredients
  rawMaterials?: RawMaterial[]
  overheadExpenses?: OverheadExpense[]
  manufacturingCostPerUnit?: number
  // output
  productionForecast?: ProductionForecast
  recommendedRetailPrice?: number
}
