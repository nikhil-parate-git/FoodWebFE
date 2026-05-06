import React, { useState } from 'react'
import Banner from '../../pages/home/Banner'
import ListingMenu from '../../pages/category/ListingMenu'
import AllDishes from '../../pages/category/AllDishes'

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner */}
      <div className="px-6 py-8">
        <Banner />
      </div>

      {/* Category Menu */}
      <ListingMenu active={activeCategory} setActive={setActiveCategory} />

      {/* Dishes filtered by category */}
      <AllDishes activeCategory={activeCategory} />
    </div>
  )
}

export default Home