import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

const user = { _id: "lorem", role: "admin" };

const Header = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);


  return (
    // <div>header</div>

    <nav className="header">

        <Link to={"/"}>Home</Link>
        <Link to={"/search"}><FaSearch /></Link>
        <Link to={"/cart"}><FaShoppingBag /></Link>

        {
            user?._id ? (
                <>
                <button onClick={() => setIsOpen((prev) => !prev)}>
                    <FaUser />
                </button>
                <dialog open={isOpen}>                                    
                    <div>
                        {
                        user.role === "admin" && (
                        <Link to="/admin/dashboard">Admin</Link>
                        ) }
                        
                        <Link to="/orders">Orders</Link>
                        <button>
                            <FaSignOutAlt />
                        </button>
                    </div>
                </dialog>
                </>
             ) : (
                <Link to={"/login"}>
                    <button><FaSignInAlt /></button>
                </Link> 
            )
        }
    
    </nav>
  
    )

}

export default Header;