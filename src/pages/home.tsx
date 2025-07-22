import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeadLoader } from "../components/Loader";
import Product from "../components/product";
import { useTrendingProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
// import bgc from "../assets/images/cover.jpg";

const Home = () => {

  const { data, isLoading, isError } = useTrendingProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {

    if (cartItem.quantity === 0) return toast.error("Out of stock");

    dispatch(addToCart(cartItem));

    toast.success("Added to cart");

  }

  if(isError) return toast.error("Unable to load the product.");

  return (

    <div className="home">

      <section>
      </section>

      <h1>
        Trending Products<br/>
        <Link to="/search" className="findmore">More</Link>
      </h1>

      <main>

        { isLoading ? (
            <DeadLoader length={12} />
          ) : (
            data?.products.map((i) => (

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
          )
        }

      </main>

    </div>
  )
}

export default Home;