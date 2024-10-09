import { Link } from "react-router-dom";
import Product from "../components/product";

const Home = () => {

  const addToCartHandler = () => {

  }

  return (
    <div className="home">

      <section>

      </section>

      <h1>
        Trending Products<br/>
        <Link to="/search" className="findmore">More</Link>
      </h1>

      <main>
        <Product 
          productId="fdwdwd"
          name="Coffee"
          price={299}
          stock={100}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/51V2cb0XNjL._SX522_.jpg"
        />
      </main>
    </div>
  )
}

export default Home;