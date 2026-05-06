import React, { useState } from 'react'
import ListingMenu from '../category/ListingMenu'
import AllDishes from '../category/AllDishes'

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <div className="max-w-7xl mx-auto">
      <ListingMenu active={activeCategory} setActive={setActiveCategory} />
      <AllDishes activeCategory={activeCategory} />
    </div>
  )
}

export default MenuPage