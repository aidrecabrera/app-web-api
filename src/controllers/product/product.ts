import {Response} from 'express'
import {AuthenticatedRequest} from '@/types/auth.types'
import {
  createProduct as createProductService,
  getAllProducts as getAllProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from '@/services/product.service'
import {IProduct} from '@/types/product.types'

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }

    const userId = req.user._id
    const productData: IProduct = {
      ...req.body,
      _owner_id: userId,
    }

    if (!productData.productName) {
      res.status(400).json({message: 'Missing required fields'})
      return
    }

    const newProduct = await createProductService(productData)
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      message: 'Error creating product',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }

    const userId = req.user._id
    const products = await getAllProductsService(userId)
    res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }

    const userId = req.user._id
    const productId = req.params.id

    if (!productId) {
      res.status(400).json({message: 'Product ID is required'})
      return
    }

    const product = await getProductByIdService(userId, productId)

    if (!product) {
      res.status(404).json({message: 'Product not found or not owned by user'})
      return
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }

    const userId = req.user._id
    const productId = req.params.id
    const updateData = req.body

    if (!productId) {
      res.status(400).json({message: 'Product ID is required'})
      return
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({message: 'No update data provided'})
      return
    }

    const updatedProduct = await updateProductService(
      userId,
      productId,
      updateData
    )

    if (!updatedProduct) {
      res.status(404).json({message: 'Product not found or not owned by user'})
      return
    }

    res.status(200).json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({
      message: 'Error updating product',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({message: 'Unauthorized'})
      return
    }

    const userId = req.user._id
    const productId = req.params.id

    if (!productId) {
      res.status(400).json({message: 'Product ID is required'})
      return
    }

    const result = await deleteProductService(userId, productId)

    if (!result) {
      res.status(404).json({message: 'Product not found or not owned by user'})
      return
    }

    res.status(200).json({message: 'Product deleted successfully'})
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      message: 'Error deleting product',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
