import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {

  const navigate = useNavigate();

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

  return (

    <div className="shipping">

      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form>

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