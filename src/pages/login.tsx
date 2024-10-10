import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {

    const [userName, setUserName] = useState("");
    const [dob, setDob] = useState("");
     
    return (
    
    <div className="login">
    
      <main>

        <h1 className="heading">Login</h1>

        <div>

          <label>Username</label>
          <input
            type="text"
            value={userName}
            placeholder="Enter your username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div>

          <label>Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div>
          <p>Already a user ?</p>
          <button>
            <FcGoogle /> 
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    
    </div>
  
    );
};

export default Login;