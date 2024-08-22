import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '@/controllers/product/product'
import { validateRequest } from '@/middleware/zod-validator'
import { ProductZodSchema } from '@/types/product.zod'
import { Router } from 'express'

const productRoutes = Router()

productRoutes.post('/', validateRequest(ProductZodSchema), createProduct)
productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProductById)
productRoutes.put('/:id', updateProduct)
productRoutes.delete('/:id', deleteProduct)

export default productRoutes
