import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import { useDispatch } from "react-redux";
import { userExist, userExistNot } from "../redux/reducer/userReducer";

const Login = () => {

    const dispatch = useDispatch();
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState<Date | undefined>();

    const [login] = useLoginMutation();


    //const formHandler = async () => {

      // const { user } = await signInWithEmailAndPassword(auth, userName, dob)
      // .then((userCredential) => {
      //   userCredential.user;
      // })
      // const res = await login({
      //   userName!,
      //   dob,
      // });
      // .catch((error) => {
      //   toast.error("Sign in Failed !");
      //   console.log(error);
      // });

    // };

    const loginHandler = async () => {

      try {

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });

        const { user } = await signInWithPopup(auth , provider);

        const res = await login({
          name: user.displayName!,
          email: user.email!,
          photo: user.photoURL!,
          role: "user",
          gender,
          dob,
          _id: user.uid
        });

        if(res.data && "data" in res) {
          toast.success(res.data.message);
          const data = await getUser(user.uid);
          dispatch(userExist(data?.user!));
        } else {
          const error = res.error as FetchBaseQueryError;
          const msg = error.data as MessageResponse;
          toast.error(msg.message);
          dispatch(userExistNot());
        }
        console.log(user);
      } catch (error) {
        toast.error("Sign in Failed !");
        console.log(error);
      }
    };

    return (

    <div className="login">

      <main>

        <h1 className="heading">Signup</h1>

        <div>

          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value=""disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="lgbtq+">LGBTQ+</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>

          <label>Date of birth</label>
          <input
            type="date"
            value={dob ? dob.toISOString().split('T')[0] : ""}  // splits iso string at T time
            onChange={(e) => setDob(new Date(e.target.value))}
          />
        </div>

        {/* <div>
          <button className="submit" type="submit" value="submit" onClick={formHandler}>Submit</button>
        </div> */}

        <div>
          <p className="or">OR</p>
          <p className="user">Already a user ?</p>
          <button className="google" onClick={loginHandler}>
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>
        </div>
      </main>

    </div>

    );
};

export default Login;