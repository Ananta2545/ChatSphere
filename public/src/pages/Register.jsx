import React, { useState, useEffect } from 'react';// useState for various states and useEffect for localStorage management
import { Link, useNavigate } from 'react-router-dom';// used to programmatically navigating between routes
import Logo from '../assets/logo1.gif';
import './Register.css';
import { ToastContainer, toast } from 'react-toastify';//  a library to display notifications
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';// used for sending form data to the backend
import { registerRoute } from '../utils/APIRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';// for toggle visibility of the password

function Register() {
  const navigate = useNavigate();// navigate function that allows user to redirect to any routes etc 
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {// function to show the password or hide the password
    setShowPassword(!showPassword);
  };

  const [passwordStrength, setPasswordStrength] = useState('');
  const [confirmPasswordStrength, setConfirmPasswordStrength] = useState('');

  const toastOptions = {// designing the toast error in the bottom right of the screen
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  const toggleConfirmPasswordVisibility = ()=>{
    setShowConfirmPassword(!showConfirmPassword);
  }

  useEffect(() => {// this executed after the component renders
    const user = localStorage.getItem("chat-app-user");// it checks whether the user is already logged in in the system
    console.log("User from localStorage:", user);
    if (user && user !== "undefined") {// if user is present then redirect to the homepage
      navigate('/');
    }
  }, []);
  // function to access the password strength
  const accessPasswordStrength = (password) => {
    let strength = '';
    if (password.length > 12 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength = 'Strong';
    } else if (password.length > 8 && /[A-Z]/.test(password)) {
      strength = 'Medium';
    } else if (password.length > 5) {
      strength = 'Weak';
    } else {
      strength = 'Very Weak';
    }
    return strength;
  };

  const handlePasswordChange = (event)=>{
    const password = event.target.value;
    setValues({ ...values, password});
    const strength = accessPasswordStrength(password);
    setPasswordStrength(strength);
  }

  const handleConfirmPasswordChange = (event)=>{
    const confirmPassword = event.target.value;
    setValues({...values, confirmPassword});
    const strength = accessPasswordStrength(confirmPassword);
    setConfirmPasswordStrength(strength);
  }
  // function to handle the submit
  const handleSubmit = async (event) => {
    event.preventDefault();// prevent the default form submission behaviour
    if (handleValidation()) {// if the handle validation is true 
      console.log("Invalidation", registerRoute);
      const { password, username, email } = values;
        try {
        const { data } = await axios.post(registerRoute, {// sends a post request to backend defined in the register route with the form data
          username,
          email,
          password,
        });
        console.log("Response from backend : ", data);

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {// if the data is true
          console.log("User data from server:", data.user);
          localStorage.setItem('chat-app-user', JSON.stringify(data.user));// setting the user in the localStorage
          navigate("/");
        }
      } catch (err) {// handling the error
        console.log("Error submitting form");
        toast.error('An error occurred while submitting the form', toastOptions);
      }
    }
  };
  
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    const { name, value } = event.target;
    if (name === 'password') {
      accessPasswordStrength(value);
    }
  };
  // checking the validation of the user inputs
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    const upperCaseCharacters = /[A-Z]/;
    const specialCharacters = [
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', '"',
      ':', '{', '}', '|', '<', '>'
    ];

    if (password !== confirmPassword) {
      toast.error('Password and confirm passwords should be the same', toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal to or greater than 8 characters", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email required", toastOptions);
      return false;
    } else if (!upperCaseCharacters.test(password)) {
      toast.error("Password should contain at least one uppercase character", toastOptions);
      return false;
    }
    const containSpecialCharacters = specialCharacters.some(char => password.includes(char));
    if (!containSpecialCharacters) {
      toast.error("Password should contain at least one special character", toastOptions);
      return false;
    }
    return true;
  };

  return (
    <>
      <ToastContainer />
      <div className="form">
        <form className='form-main' onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>ChatSphere</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={(e) => handlePasswordChange(e)}
              onFocus={() => setPasswordStrength(true)}
              onBlur={() => setPasswordStrength(false)}
            />
            <span onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {passwordStrength && values.password && (
            <div className={`password-strength ${passwordStrength}`}>
              Password Strength: {passwordStrength}
            </div>
          )}
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              onFocus={() => setConfirmPasswordStrength(true)}
              onBlur={() => setConfirmPasswordStrength(false)}
              onChange={handleConfirmPasswordChange}
            />
            <span onClick={toggleConfirmPasswordVisibility}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          {confirmPasswordStrength && values.confirmPassword && (
            <div className={`password-strength ${confirmPasswordStrength}`}>
              Password Strength: {confirmPasswordStrength}
            </div>
          )};

          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </>
  );
}

export default Register;
