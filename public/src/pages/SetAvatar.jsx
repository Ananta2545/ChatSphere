import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';
import './SetAvatar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';

function SetAvatar() {

  const api = "https://api.multiavatar.com/45678945";// this api link is used to fetch the avatars
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);// this is used to hold the array of avatars
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)// this is used to track which avatar is selected by the user
  const [isLoading, setIsLoading] = useState(true)// when avatar is being fetched it is loading or not loading


  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    // if the user is not there in the localStorage then redirect them to login
    const checkUser = async () => {
      try {
        const user = localStorage.getItem('chat-app-user');
        if (!user) {
          // Redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
  
    checkUser();
  }, []);

  // function to create the set profile picture
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an Avatar", toastOptions);
      return;
    }
    
    // if the user is not there in the chat-app-user
    const userJson = localStorage.getItem("chat-app-user");
    if (!userJson) {
      toast.error("User not found. Please log in again.", toastOptions);
      return;
    }
  
    const user = JSON.parse(userJson);
    if (!user || !user._id) {
      toast.error("User data is incomplete. Please log in again.", toastOptions);
      return;
    }
  
    try {
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
  
      if (data.isSet) {
        user.isAvatarImage = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate('/');
      } else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    } catch (error) {
      console.log("Error setting avatar", error);
      toast.error("Error setting avatar. Please try again", toastOptions);
    }
  };
  
  // when the component loads this useEffect will fetch the avatars
  useEffect(()=>{
    const fetchAvatars = async ()=>{
      const data = [];
      try{
        for(let i = 0;i<4;i++){
          // add a delay before each request so that there are not multiple request to the api we are using so that it doesnt give any error like too many request 
          await new Promise(resolve=>setTimeout(resolve, 1000));
          const image = await axios.get(`${api}/${Math.random() * 1000}`);
          const base64String = btoa(image.data);// the image data is converted into base 64 string and after that it stored in the array of data
          console.log(`data:image/svg+xml;base64,${base64String}`);
          data.push(base64String)
        }
        setAvatars(data); // we are inserting the data into setAvatars
        setIsLoading(false)// once the data is fetched the loading will stop
      }
      catch(error){
        if(error.response && error.response.status === 429){
          toast.error("Too many request. Please try again later", toastOptions)
        }else{
          toast.error("Failed to fetch avatars. Please try again later", toastOptions)
        }
      }
    }
    fetchAvatars();// calling the fetchAvatars function
  },[])
  
  

  return (
    <>
    {
      isLoading? <div className="container">
        <img src={loader} alt="loader" className='loader'/>
      </div>: (

        <div className='container'>
        <div className="title-container">
          <h1>Pick an Avatar as your profile picture</h1>
        </div>
        <div className="avatars">
          {
            avatars.map((avatar, index)=>{
              return (
                <div key={index} className={`Avatar ${avatar} ${selectedAvatar === index ? "selected":""}`}>
                  <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)} />
                </div>
              )
            })
          }
        </div>
        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
      </div>
          )
        }
        <ToastContainer/>
    </>
  )
}

export default SetAvatar