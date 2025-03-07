import { useState } from "react";
import Product from "../components/product";
import { FaSearch } from "react-icons/fa";
import { useGetCategoriesQuery, useSearchProductQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { DeadLoader } from "../components/Loader";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {

  const { 
    data:getCategoriesResponse, 
    isLoading: loadingCategories, 
    isError, 
    error } = useGetCategoriesQuery("");
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [price, setPrice] = useState<number>(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState<number>(1);

  const { 
    data:searchedData, 
    isLoading: productLoading, 
    isError: productIsError, 
    error: productError 
  } = useSearchProductQuery({
    search,
    sort,
    category,
    page,
    price
  });

  console.log(searchedData);

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {

    if (cartItem.quantity === 0) return toast.error("Out of stock");

    dispatch(addToCart(cartItem));

    toast.success("Added to cart");

  };

  const isPrevPage = page > 1;
  const isNextPage = page < 10;

  if (isError) toast.error((error as CustomError).data.message);

  if (productIsError) toast.error((productError as CustomError).data.message);

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
          <h4>Max Price: {price || ""}</h4>
          <input
            type="range"
            min={10}
            max={100000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      
        <div>
          
          <h4>Category</h4>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            
            {
              !loadingCategories &&
                getCategoriesResponse?.categories.map( (i) => (
                  <option key={i} value={i}>
                    {i.toUpperCase()}
                  </option>
                ))
            }

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

        {
          productLoading ? ( <DeadLoader /> ) : (

            <div className="search-list">
         
              {
                searchedData?.products.map( (i) => (
                  <Product
                    key={i._id}
                    productId={i._id}
                    name={i.name}
                    price={i.price}
                    stock={i.stock}
                    photo={i.photo}
                    handler={addToCartHandler}
                  />
                ))
              }
        
            </div>
          )
        }

        {
          searchedData && searchedData.totalPage > 1 && (
            <article>    
              <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
              <span>
                {page} of {searchedData.totalPage}
              </span>
              <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </article>
          )
        }
      
      </main>

    </div>

  )

}

export default Search;


//             <option value="dairy">Dairy</option>
//             <option value="spices">Spices</option>
//             <option value="fruits">Fruits & Vegetables</option>
//             <option value="ration">Ration Items</option>
//             <option value="meat">Eggs, meat & fish</option>
//             <option value="drinks">Drinks/Juices</option>
//             <option value="sweets">Sweets</option>
//             <option value="snacks">Snacks</option>
//             <option value="health">Health & Nutrition</option>