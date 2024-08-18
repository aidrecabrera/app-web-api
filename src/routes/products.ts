import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/controllers/products'
import {authenticateUser} from '@/middleware/authenticated-user'
import {Router} from 'express'

const productRoutes = Router()

productRoutes.use(authenticateUser)
productRoutes.post('/', createProduct)
productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProductById)
productRoutes.put('/:id', updateProduct)
productRoutes.delete('/:id', deleteProduct)

export default productRoutes
