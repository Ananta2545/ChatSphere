import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';// allows to create web socket connections to a socket.io server

const Chat = () => {
  const navigate = useNavigate();// used to navigate between the routes

  const socket = useRef();
  const [contacts, setContacts] = useState([]); // stores the retrieved users data from the backend
  const [currentUser, setCurrentUser] = useState(undefined); // stores the current logged-in user
  const [currentChat, setCurrentChat] = useState(undefined); // which is the current chat this useState hook will keep the currentChat status
  const [isLoaded, setIsLoaded] = useState(false);
  
  // if the user is not there in the local storage redirect them to the login page 
  useEffect(() => {
    const fetchUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(JSON.parse(user));// setting the current user
        setIsLoaded(true);
      }
    };
    fetchUser();// calling the function
  }, [navigate]);

  // when the component that is currentUser changes a connection to the socket io server is established using io
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);// the socket connection is established when the currentUser is present
      socket.current.emit("add-user", currentUser._id);// once the socket is connected it emits an event called add-user with the currentUser id informs the server that a new user is connected
    }
  },[currentUser])


  //through the below function we are fetching the contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {// if currentUser is present
        if (currentUser.isAvatarImage) {// if currentUser has the avatarImage set
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);// a get request is sent to the allUsersRoute with the id
          setContacts(data); // setting the data in contacts
        } else {
          navigate('/setAvatar');
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);// if currentUser change then this hook will re render 


  const handleChatChange = (chat)=>{
    setCurrentChat(chat);// this function is doing the change functionality when different chat is selected then that chat will be active
  }
  
  return (
    <div className="main-container-chat">
      <div className="container-chat">
        <Contacts contacts={contacts} setContacts={setContacts} currentUser={currentUser} changeChat={handleChatChange} />
        
        {
          isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )
        }
      </div>
    </div>
  );
};

export default Chat;
