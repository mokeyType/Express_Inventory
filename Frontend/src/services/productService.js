import api from './api'

const extractResponseData = (response) => response.data?.content ?? response.data

// Get all products with pagination
export const productService = {
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/product/all/paginated', { params })
      return extractResponseData(response)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products', {
        cause: error,
      })
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/product/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product', {
        cause: error,
      })
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/product/add', productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product', {
        cause: error,
      })
    }
  },

  // Update an existing product (upsert)
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/product/upsert/${productId}`, productData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product', {
        cause: error,
      })
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/product/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product', {
        cause: error,
      })
    }
  },

  // Search products by name
  searchProducts: async (name, params = {}) => {
    try {
      const response = await api.get('/product/search', {
        params: { name, ...params },
      })
      return extractResponseData(response)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search products', {
        cause: error,
      })
    }
  },

  // Get products with low stock (less than threshold)
  getLowStockProducts: async (threshold = 5, params = {}) => {
    try {
      const response = await api.get('/product/all/minstock', {
        params: { min: threshold, ...params },
      })
      return extractResponseData(response)
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch low stock products',
        { cause: error },
      )
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get('/product/category', {
        params: { category, ...params },
      })
      return extractResponseData(response)
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch products by category',
        { cause: error },
      )
    }
  },
}
