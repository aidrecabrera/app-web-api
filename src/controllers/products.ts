import {Response} from 'express'
import {Product} from '@/models/products'
import {IProduct} from '@/types/products'
import {AuthenticatedRequest} from '@/types/auth-request'

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: 'Unauthorized'})
    }

    const userId = req.user._id
    const productData: IProduct = {
      ...req.body,
      _owner_id: userId,
    }

    if (!productData.productName) {
      return res.status(400).json({message: 'Missing required fields'})
    }

    const newProduct = new Product(productData)
    await newProduct.save()

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
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: 'Unauthorized'})
    }

    const userId = req.user._id
    const products = await Product.find({_owner_id: userId})

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
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: 'Unauthorized'})
    }

    const userId = req.user._id
    const productId = req.params.id

    if (!productId) {
      return res.status(400).json({message: 'Product ID is required'})
    }

    const product = await Product.findOne({_id: productId, _owner_id: userId})

    if (!product) {
      return res
        .status(404)
        .json({message: 'Product not found or not owned by user'})
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
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: 'Unauthorized'})
    }

    const userId = req.user._id
    const productId = req.params.id
    const updateData = req.body

    if (!productId) {
      return res.status(400).json({message: 'Product ID is required'})
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({message: 'No update data provided'})
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {_id: productId, _owner_id: userId},
      updateData,
      {new: true, runValidators: true}
    )

    if (!updatedProduct) {
      return res
        .status(404)
        .json({message: 'Product not found or not owned by user'})
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
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({message: 'Unauthorized'})
    }

    const userId = req.user._id
    const productId = req.params.id

    if (!productId) {
      return res.status(400).json({message: 'Product ID is required'})
    }

    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      _owner_id: userId,
    })

    if (!deletedProduct) {
      return res
        .status(404)
        .json({message: 'Product not found or not owned by user'})
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
