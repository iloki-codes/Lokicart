import {FaPlus} from 'react-icons/fa';
import { server } from '../redux/store';
import { ProductProps } from '../types/types';

const Product = ({productId, price, name, photo, stock, handler}: ProductProps) => {
  return (
    
    <div className="product">

        <img src={`${server}/${photo}`} alt={name} />    
        <p>{name}</p>
        <span>₹ {price}</span>
        
        <div>
            <button onClick={() => handler({
              productId,
              photo,
              name,
              price,
              stock,
              quantity: 1
            })}>
              <FaPlus />
            </button>
        </div>
    
    </div>
  )
};

export default Product;