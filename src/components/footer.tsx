import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/images/loki.png";


const Footer = () => {

  return (

    <div className="footer">

        <Link to={"/"}><img className="logo" src={logo} alt="logo" /><span className="logotext">lokicart</span></Link>

        <div className="footer-links">
            <ul className="footerulone">
                <span style={{color: "$color2"}}>HelpCentre</span>
                <li><a href="">Your Account</a></li>
                <li><a href="">Customer Care</a></li>
                <li><a href="">Returns Centre</a></li>
                <li><a href="">Other Issues</a></li>
            </ul>

            <ul className="footerulone">
                <span>Connect With Us</span>
                <li><a href="">LinkedIn</a></li>
                <li><a href="">Github</a></li>
                <li><a href="">Medium</a></li>
            </ul>

            <ul className="footerulone">
                <span>About Us</span>
                <li><a href="">Know Us</a></li>
                <li><a href="">Careers</a></li>
                <li><a href="">Rate Us</a></li>
            </ul>
        </div>

        <div className="newsletter">
            <input type="text" placeholder="Enter your email here..."></input>
            <button style={{}}>Subscribe to get future discounts</button>
            <ul className="social">
                <li><FaInstagram /></li>
                <li><FaFacebook /></li>
                <li><FaTwitter /></li>
            </ul>
        </div>

    </div>

    )

}

export default Footer;