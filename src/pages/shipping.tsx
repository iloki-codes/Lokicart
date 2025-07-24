import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { server } from "../redux/serverConfig";
import { CartReducerInitialState } from "../types/reducer.types";

const Shipping = () => {

  const {
    cartItems,
    // subtotal,
    // tax,
    // shippingCharges,
    // discount,
    total
  } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: ""
  });

  const changeHandler =
    ( e: ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
     e.preventDefault();

     dispatch(saveShippingInfo(shipping));

     try {
      const {data} = await axios.post(`${server}/api/v1/payment/pay`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      if(data?.clientSecret) {
      navigate("/pay", {
        state: data.clientSecret,
      });
    } else {
        toast.error("Invalid payment response");
    }

     } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
     }
  }

  useEffect(() => {
    if (cartItems.length <= 0)
      return navigate("/cart");
  }, [cartItems]);

  return (

    <div className="shipping">

      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>

        <h1>Shipping Address</h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shipping.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shipping.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shipping.state}
          onChange={changeHandler}
        />
        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shipping.pinCode}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shipping.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="pakistan">Pakistan</option>
          <option value="nepal">Nepal</option>
          <option value="sriLanka">Sri Lanka</option>
          <option value="bhutan">Bhutan</option>
          <option value="myanmar">Myanmar</option>
          <option value="afghanistan">Afghanistan</option>
          <option value="maldives">Maldives</option>
          <option value="bangladesh">Bangladesh</option>
        </select>

        <button type="submit">Pay Now</button>

      </form>

    </div>

    );
};

export default Shipping;