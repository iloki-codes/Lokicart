import {FaPlus} from 'react-icons/fa';

type ProductProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
    handler: () => void;
};

// const server = "lorem3";

const Product = ({productId, price, name, photo, handler}: ProductProps) => {
  return (
    
    <div className="product">

        <img src={photo} alt={name} />    
        <p>{name}</p>
        <span>₹ {price}</span>

        <div>
            <button onClick={() => handler()}><FaPlus /></button>
        </div>
    </div>
  )
}

export default Product;