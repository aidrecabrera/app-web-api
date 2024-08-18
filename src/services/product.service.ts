import {Product} from '@/models/products'
import {IProduct} from '@/types/product.types'

export const createProduct = async (
  productData: IProduct
): Promise<IProduct> => {
  const newProduct = new Product(productData)
  return await newProduct.save()
}

export const getAllProducts = async (userId: string): Promise<IProduct[]> => {
  return await Product.find({_owner_id: userId})
}

export const getProductById = async (
  userId: string,
  productId: string
): Promise<IProduct | null> => {
  return await Product.findOne({_id: productId, _owner_id: userId})
}

export const updateProduct = async (
  userId: string,
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  return await Product.findOneAndUpdate(
    {_id: productId, _owner_id: userId},
    updateData,
    {new: true, runValidators: true}
  )
}

export const deleteProduct = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const result = await Product.findOneAndDelete({
    _id: productId,
    _owner_id: userId,
  })
  return result !== null
}
