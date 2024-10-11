import { useState } from "react";
import Product from "../components/product";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState<number>(1);

  const addToCartHandler = () => {

  }

  const isPrevPage = page > 1;
  const isNextPage = page < 10;

  return (
    
    <div className="search">

      <aside>

        <h2>Filters</h2>

        <div>
          
          <h4>Sort</h4>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="desc">Price (High to Low)</option>
          </select>
        
        </div>  

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      
        <div>
          
          <h4>Category</h4>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="dairy">Dairy</option>
            <option value="spices">Spices</option>
            <option value="fruits">Fruits & Vegetables</option>
            <option value="ration">Ration Items</option>
            <option value="meat">Eggs, meat & fish</option>
            <option value="drinks">Drinks/Juices</option>
            <option value="sweets">Sweets</option>
            <option value="snacks">Snacks</option>
            <option value="health">Health & Nutrition</option>
          </select>
        
        </div> 
      
      </aside>    
      
      <main>

        <h1>Products</h1>

        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /><FaSearch />
        </div>

        <div className="search-list">
          <Product
            productId="fdwdwd"
            name="Coffee"
            price={299}
            stock={100}
            handler={addToCartHandler}
            photo="https://m.media-amazon.com/images/I/51V2cb0XNjL._SX522_.jpg"
          />
        </div>

        <article>
          <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
          <span>
            {page} of {4}
          </span>
          <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
        </article>
      </main>

    </div>

  )

}

export default Search;
