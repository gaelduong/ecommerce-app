import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as API from 'api/mockAPIs'

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (
    { searchKeyword, sortValue, categoryFilterList, priceRange },
    thunkAPI
  ) => {
    try {
      const data = await API.fetchProducts({
        searchKeyword,
        sortValue,
        categoryFilterList,
        priceRange
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState: { loading: false, error: {}, products: null },
  reducers: {},
  extraReducers: {
    [getProducts.pending]: (state, action) => {
      state.loading = true
    },
    [getProducts.rejected]: (state, action) => {
      state.products = []
      state.loading = false
      state.error.details = action.payload.errors
    },
    [getProducts.fulfilled]: (state, action) => {
      state.products = action.payload
      state.loading = false
      state.error = {}
    }
  }
})

export const { setProducts } = productSlice.actions

export default productSlice.reducer
