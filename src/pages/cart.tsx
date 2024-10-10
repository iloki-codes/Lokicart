import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItem from "../components/cart-item";

const cartItems = [

  {
      productId: "sgfsefszf",
      photo: "https://m.media-amazon.com/images/I/51V2cb0XNjL._SX522_.jpg",
      name: "Coffee",
      price: 299,
      quantity: 4,
      stock: 10
  }

];

const subtotal = 299;
const tax = Math.round(subtotal*0.18);
const shippingCharges = 99;
const discount = 59;
const total = (subtotal + tax + shippingCharges) ;

const Cart = () => {
  
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(Math.random() > 0.5) setIsValid(true);
      else setIsValid(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      setIsValid(false);
    }
  }, [couponCode])

  return (

    <div className="cart">
    
      <main>

        {
          cartItems.length > 0 ?
                                ( 
                                  cartItems.map((i, idx) => (
                                    <CartItem key={idx} cartItem={i} />
                                  ))
                                ) : (
                                  <h1>No Items Added</h1>
                                )
        }

      </main>

      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        {
          isValid ? (
                      <p>Discount: <em className="green">- ₹{discount}</em></p>
                    ) : (
                      <p className="red">Discount: ₹{0}</p>
                    )
        }
        {
          isValid ? (
                      <p>Total: ₹{total-discount}</p>
                    ) : (
                      <p>Total: ₹{total}</p>
                    )
        }
      
        <input
          type="text"
          value={couponCode}
          placeholder="Coupon Code"
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {
          couponCode &&
            ( isValid ? ( 
            <span className="green">
              ₹{discount} off using
              <code> {couponCode}</code>
            </span>
            ) : (
            <span className="red">Invalid Coupon <VscError /></span>
          ) ) 
        }
      
      {
        cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
      }

      </aside>


    </div>
  
  )

}

export default Cart;