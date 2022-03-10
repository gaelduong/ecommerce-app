const getFilteredProducts = (productList, categorySelectedList) => {
  return [...productList].filter(product => {
    return categorySelectedList.every(selectedCategory => {
      if (selectedCategory.selectedValues.length === 0) return true
      const productCategory = product.categories.find(
        category => category.category_id === selectedCategory.id
      )
      if (!productCategory) return false
      const sharedValues = selectedCategory.selectedValues.filter(value =>
        productCategory.values.includes(value)
      )
      return sharedValues.length > 0
    })
  })
}

export { getFilteredProducts }
