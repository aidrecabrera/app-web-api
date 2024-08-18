import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/controllers/product.controller'
import {authenticateUser} from '@/middleware/authenticated-user'
import {validateRequest} from '@/middleware/zod-validator'
import {ProductZodSchema} from '@/types/product.zod'
import {Router} from 'express'

const productRoutes = Router()

productRoutes.use(authenticateUser)
productRoutes.post('/', validateRequest(ProductZodSchema), createProduct)
productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProductById)
productRoutes.put('/:id', updateProduct)
productRoutes.delete('/:id', deleteProduct)

export default productRoutes
