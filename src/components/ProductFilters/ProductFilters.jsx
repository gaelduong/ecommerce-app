import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts } from 'redux/slices/productSlice'
import {
  filtersInitialState,
  setCategoryFilterList,
  clearFilters,
  setPriceRange
} from 'redux/slices/searchSortFilterSlice'

const ProductFilters = () => {
  const { searchKeyword, sortValue, categoryFilterList, priceRange } =
    useSelector(state => state.searchSortFilterSlice)

  const [priceRangeInput, setPriceRangeInput] = useState(priceRange)

  const dispatch = useDispatch()

  const getUpdatedCategoryFilterList = (categoryId, categoryValue) => {
    // JSON.stringify and JSON.parse to Deep Copy
    // Shallow Copy [...categoryFilterList] would not work since the array is nested/multi-dimensional
    const clonedCategoryFilterList = JSON.parse(
      JSON.stringify(categoryFilterList)
    )
    const categoryFilter = clonedCategoryFilterList.find(
      category => category.id === categoryId
    )
    if (categoryFilter.selectedValues.includes(categoryValue)) {
      categoryFilter.selectedValues = categoryFilter.selectedValues.filter(
        v => v !== categoryValue
      )
    } else categoryFilter.selectedValues.push(categoryValue)
    return clonedCategoryFilterList
  }

  const handleCategoriesOnChange = async (categoryId, categoryValue) => {
    const updatedCategoryFilterList = getUpdatedCategoryFilterList(
      categoryId,
      categoryValue
    )

    dispatch(setCategoryFilterList(updatedCategoryFilterList))

    dispatch(
      getProducts({
        searchKeyword,
        sortValue,
        categoryFilterList: updatedCategoryFilterList,
        priceRange
      })
    )
  }

  const handleApplyPriceRange = async () => {
    dispatch(setPriceRange(priceRangeInput))
    dispatch(
      getProducts({
        searchKeyword,
        sortValue,
        categoryFilterList,
        priceRange: priceRangeInput
      })
    )
  }

  const handleClearFilter = async () => {
    setPriceRangeInput({ min: '', max: +Infinity })

    dispatch(
      getProducts({
        searchKeyword,
        sortValue,
        categoryFilterList: filtersInitialState.categoryFilterList,
        priceRange: filtersInitialState.priceRange
      })
    )
    dispatch(clearFilters())
  }

  const currentCategoryFilterList = categoryFilterList.map(categoryValues => {
    return (
      <div key={categoryValues.id}>
        <h3>{categoryValues.name}</h3>
        {categoryValues.values.map(value => {
          return (
            <label key={value}>
              <input
                type="checkbox"
                name={value}
                value={value}
                checked={categoryValues.selectedValues.includes(value)}
                onChange={() =>
                  handleCategoriesOnChange(categoryValues.id, value)
                }
              />
              {value}
            </label>
          )
        })}
      </div>
    )
  })

  return (
    <fieldset>
      <button onClick={handleClearFilter}>Clear all</button>
      {currentCategoryFilterList}
      <h3>Price Range</h3>
      <label>
        Min: $
        <input
          type="number"
          name="minPrice"
          min="0"
          style={{ width: 80 }}
          value={priceRangeInput.min.toString()}
          onChange={e =>
            setPriceRangeInput({ ...priceRangeInput, min: +e.target.value })
          }
        />
      </label>{' '}
      <label>
        Max: $
        <input
          type="number"
          name="maxPrice"
          min="0"
          style={{ width: 80 }}
          value={
            priceRangeInput.max === +Infinity
              ? ''
              : priceRangeInput.max.toString()
          }
          onChange={e =>
            setPriceRangeInput({ ...priceRangeInput, max: +e.target.value })
          }
        />
      </label>{' '}
      <button onClick={handleApplyPriceRange}>Apply</button>
    </fieldset>
  )
}

export default ProductFilters
