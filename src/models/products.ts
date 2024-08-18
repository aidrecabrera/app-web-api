import {Schema, model} from 'mongoose'
import {IProduct} from '@/types/product.types'

const ProductSchema = new Schema<IProduct>({
  _owner_id: {type: Schema.Types.ObjectId, required: true},
  manufacturingCostPerUnit: {type: Number},
  overheadExpenses: [
    {
      costPerUnit: {type: Number},
      expenseCategory: {type: String},
    },
  ],
  productName: {type: String, required: true},
  productionForecast: {
    maximumUnitsProducible: {type: Number},
    productionConstraint: {type: String},
  },
  profitMarginSettings: {
    calculationType: {type: String},
    percentageValue: {type: Number},
  },
  rawMaterials: [
    {
      costPerUnit: {type: Number},
      ingredientName: {type: String},
      quantityNeededPerUnit: {type: Number},
      stockOnHand: {type: Number},
    },
  ],
  recommendedRetailPrice: {type: Number},
})

export const Product = model<IProduct>('Product', ProductSchema)
