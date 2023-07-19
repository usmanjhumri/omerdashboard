import React, { Fragment, useState } from "react";
import "./login.css";
import { authLogin } from "../../api/endpoints/auth"
import Loader from "../layout/Loader/Loader.jsx";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { BiLockOpenAlt } from 'react-icons/bi'
import { CiMail } from 'react-icons/ci'
import { loginAction } from '../../store/actions/auth.action'
import {  useNavigate } from "react-router-dom"


// import { useAlert } from "react-alert";

const Login = ({ history, location }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)


  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)

      const response = await authLogin({
        email: loginEmail,
        password: loginPassword
      })
      console.log(response)

      if (response?.success) {
        dispatch(loginAction({ access_token: response.token, user: response.user }))
        navigate('/meter')
      }
      setLoading(false)
    }
    catch (err) {
      console.log(err, 'err')

    }

  };


  //   const redirect = location.search ? location.search.split("=")[1] : "/account";



  return (
    <Fragment>
    <div className="LoginSignUpContainer">

      <div className="LoginSignUpBox">
        <div className="bg-blue-500 flex justify-center items-center">
          <h4 className=" text-white tableHeading p-1">
            LOGIN
          </h4>
        </div>
        <form className="loginForm" onSubmit={loginSubmit}>
          <div className="loginEmail">
            <CiMail />
            <input
              type="email"
              placeholder="Email"
              required
              value={loginEmail}
              className="bg-black text-white "
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="loginPassword">
            <BiLockOpenAlt />
            <input
              type="password"
              className="bg-black text-white"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <Link to="/password/forgot">Forget Password ?</Link>
          <button type="submit" className="loginBtn" >
            {
              loading
                ?
                <Loader />
                :
                'Login'
            }

          </button>
        </form>
      </div>
    </div>
  </Fragment>
  );
};

export default Login;