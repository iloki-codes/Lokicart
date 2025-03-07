import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import logo from "../assets/images/loki.png";
import { PropsType } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";


// const user = { _id: "", role: "" };

const Header = ({ user }: PropsType) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Logged Out Successfully !")
            setIsOpen(false);
        } catch (error) {
            toast.error("Sign Out Failed !")
        }
    };


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
                        
                        <button onClick={(logoutHandler)}>
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