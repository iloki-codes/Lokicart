import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import logo from "../assets/images/loki.png";


const user = { _id: "", role: "" };

const Header = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = () => {
        setIsOpen(false);
    }


  return (
    // <div>header</div>

    <nav className="header">

        <Link to={"/"}><img className="logo" src={logo} alt="logo" /><span className="logotext">lokicart</span></Link>

        <Link onClick={() => setIsOpen(false)} to={"/"}><FaHome /></Link>
        <Link onClick={() => setIsOpen(false)} to={"/search"}><FaSearch /></Link>
        <Link onClick={() => setIsOpen(false)} to={"/cart"}><FaShoppingBag /></Link>

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
                        <Link  onClick={() => setIsOpen(false)} to="/admin/dashboard">Admin</Link>
                        ) }
                        
                        <Link  onClick={() => setIsOpen(false)} to="/orders">Orders</Link>
                        <button>
                            <FaSignOutAlt />
                        </button>
                    </div>
                </dialog>
                </>
             ) : (
                <Link  onClick={() => setIsOpen(false)} to={"/login"}>
                    <button><FaSignInAlt /></button>
                </Link> 
            )
        }
    
    </nav>
  
    )

}

export default Header;