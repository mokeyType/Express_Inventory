import api from './api'

const getAllSales = async (params = {}) => {
  try {
    const response = await api.get('/sales/paginated', { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sales', {
      cause: error,
    })
  }
}

const getSaleById = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sale', {
      cause: error,
    })
  }
}

const createSale = async (saleData) => {
  try {
    const response = await api.post('/sales/create', saleData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create sale', {
      cause: error,
    })
  }
}

const getSalesByDate = async (date, params = {}) => {
  try {
    const response = await api.get('/sales/date', {
      params: { date, ...params },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search sales', {
      cause: error,
    })
  }
}

const getSalesByProduct = async (productId) => {
  try {
    const response = await api.get(`/sales/product/${productId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search sales by product', {
      cause: error,
    })
  }
}

const getSalesByDateRange = async (params = {}) => {
  try {
    const response = await api.get('/sales/between', {
      params: { ...params },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search sales by date range', {
      cause: error,
    })
  }
}

export const salesService = {
  getAllSales,
  getSaleById,
  createSale,
  getSalesByDate,
  getSalesByProduct,
  getSalesByDateRange,
}


