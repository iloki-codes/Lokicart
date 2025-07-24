import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import cartGif from "../assets/images/cartgif.mp4";
import loki from "../assets/images/loki.png";
import CartItemCard from "../components/cart-item";
import { addToCart, amountSection, applyDiscount, removeFromCart } from "../redux/reducer/cartReducer";
import { server } from "../redux/serverConfig";
import { CartReducerInitialState } from "../types/reducer.types";
import { CartItem } from "../types/types";

const Cart = () => {

  const {
    cartItems,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total,
  } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const dispatch = useDispatch();

  const incrementHandler = ( cartItem: CartItem ) => {

    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({
      ...cartItem, quantity: cartItem.quantity + 1
    }));

  };

  const decrementHandler = ( cartItem: CartItem ) => {

    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({
      ...cartItem, quantity: cartItem.quantity - 1
    }));

  };

  const removeHandler = ( productId: string ) => {
    dispatch(removeFromCart(productId));
  }

  useEffect(() => {

    const fetchDiscount = () => {

      if (!couponCode) {
      dispatch(applyDiscount(0));
      setIsValid(false);
      dispatch(amountSection());
      return;
    }

    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeoutId = setTimeout(() => {
      axios.get(`${server}/api/v1/payment/discount?couponCode=${couponCode}`, {
        withCredentials: true,
        cancelToken
      })
        .then((res) => {
          console.log(res.data);
          dispatch(applyDiscount(res.data.discount));
          setIsValid(true);
          dispatch(amountSection());
        })
        .catch(() => {
          dispatch(applyDiscount(0));
          setIsValid(false);
          dispatch(amountSection());
      })
      if(Math.random() > 0.5) setIsValid(true);
      else setIsValid(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      cancel();
      setIsValid(false);
    }
  };

  fetchDiscount();
  }, [couponCode]);

  useEffect(() => {
    dispatch(amountSection());
  } , [cartItems]);

  return (

    <div className="cart">

      <main>

        {
          cartItems.length > 0 ?
                                (
                                  cartItems.map((i, idx) => (
                                    <CartItemCard
                                      incrementHandler={incrementHandler}
                                      decrementHandler={decrementHandler}
                                      removeHandler={removeHandler}
                                      key={idx} cartItem={i} />
                                  ))
                                ) : (
                                  <h1>No Items Added</h1>
                                )
        }

      </main>

        {
          cartItems.length > 0 ? (

            <aside>

              <p>Subtotal: ₹{subtotal}</p>
              <p>Shipping Charges: ₹{shippingCharges}</p>
              <p>Tax: ₹{tax}</p>
              {
                isValid ? (
                            <p>Discount: <em className="green">- ₹{discount}</em></p>
                          ) : (
                            <p className="red">Discount: ₹{discount}</p>
                          )
              }
              <hr />
              <p className="total">Total: ₹{total}</p>

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

          ) : (
                <div className="emptyCart">
                  <video autoPlay loop muted>
                    <source src={cartGif} type="video/mp4" />
                  </video>

                  <div className="gif" title="Ooops! Hurry add products in the cart and avail discounts.">
                    <img src={loki} alt={loki} />
                    <span>
                    </span>
                  </div>
                </div>
            )
        }

    </div>

  );

};

export default Cart;