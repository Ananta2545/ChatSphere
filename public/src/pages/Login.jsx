import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';// styling area so that we can style any components in js
import { Link, useNavigate } from 'react-router-dom';// used to navigate between different routes
import Logo from '../assets/logo1.gif';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';// used to display notifications 
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'// to fetch api or from backend connection
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';// for toggle visibility of the password
import { loginRoute } from '../utils/APIRoutes';

function Login() {
  // useState to store the values
  const navigate = useNavigate()// initializing navigate for programatically navigate to different routes
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    username: '',
    password: '',
  });


  const togglePasswordVisibility = ()=>{
    setShowPassword(!showPassword);
  }
  const [passwordStrength, setPasswordStrength] = useState('');

  const accessPasswordStrength = (password)=>{
    let strength = '';
    if(password.length > 12 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)){
      strength = 'Strong';
    }
    else if(password.length > 8 && /[A-Z]/.test(password)){
      strength = 'Medium';
    }
    else if(password.length > 5){
      strength = 'Weak';
    }
    else{
      strength = "Very weak";
    }
    return strength;
  }

  const handlePasswordChange = (event)=>{
    const password = event.target.value;
    setValues({ ...values, password});
    const strength = accessPasswordStrength(password);
    setPasswordStrength(strength);
  }
  const toastOptions = {// Defining toast options for how much time and where the notifications will appear
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
  // if user is logged in then redirect to the home page
  useEffect(()=>{
    const user1 = localStorage.getItem("chat-app-user");
    if(user1 && user1 !== "undefined"){
      navigate("/");
    }
  },[]);

  

  // function to handle when user submit
  const handleSubmit = async (event) => {
    event.preventDefault();// it will not reload when the user presses the create User button
    if (handleValidation()) {
        console.log("Invalidation", loginRoute);
        const { password, username } = values;// destructuring the values from the state variable
        try {
            const { data } = await axios.post(loginRoute, {// making a post request to the registrationRoute with the data from the registration
                username,
                password,
            });
            console.log("Response from backend : ", data);
            
            // Handle the response based on its content
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user1));
                console.log(data.user1)
                navigate("/"); // Use navigate to redirect
            }
        } catch (err) {
            console.log("Error submitting form");
            toast.error('An error occurred while submitting the form', toastOptions);
        }
    }
};


  // function the handle the change
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };



  // function for validation
  const handleValidation = () => {
    const { password, username } = values;
    if (password === "") {
      toast.error("Email and password is required", toastOptions);
      return false;
    }
    else if(username.length === ""){
        toast.error("Username and password is required", toastOptions)
        return false;
    } 
    return true;
  };

  return (
    <>
      {/* <FormContainer> */}
        <ToastContainer />
        <div className="form">
          <form className='form-under' onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
              <img src={Logo} alt="Logo" />
              <h1>ChatSphere</h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <div className="password-container1">
              <input
                type={showPassword? "text": "password"}
                placeholder="Password"
                name="password"
                onChange={(e) => handlePasswordChange(e)}
                value={values.password}
                onFocus={()=> setPasswordStrength(true)}
                onBlur={()=> setPasswordStrength(true)}
              />
              <span onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {passwordStrength && values.password && (
                <div className={`password-strength1 ${passwordStrength}`}>
                  Password Strength: {passwordStrength}
                </div>
              )}
            </div>
            <button type="submit">Login</button>
            <span>
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </form>
        </div>
      {/* </FormContainer> */}
    </>
  );
}

export default Login;
