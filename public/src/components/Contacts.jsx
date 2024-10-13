import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo.svg';
import './Contacts.css';

const Contacts = ({ contacts=[], currentUser, changeChat }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);// hook to save currentUserName
  const [currentUserImage, setCurrentUserImage] = useState(undefined);// for Current user image
  const [currentSelected, setCurrentSelected] = useState(undefined);// which chat is selected it is for that

  // if there is currentUser then set avatarImage and username
  useEffect(() => {
    console.log('contacts : ',contacts);
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);// will rerender when the currentUser change

  
  // here the chat will be change 
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    currentUserImage && currentUserName && (
      <div className="main-container-contact">
        <div className="contact-brand">
          <img src={Logo} alt="logo" />
          <h3>ChatSphere</h3>
        </div>
        <div className="contacts">
          {
            contacts.map((contact, index) => {
              return (
              <div
                key={index}
                className={`contact ${index === currentSelected ? "Selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar-contact">
                  <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar"/>
                </div>
                <div className="username-contact">
                  <h3>{contact.username}</h3>
                </div>
              </div>  
            )
            })
          }
        </div>
        <div className="current-user-contact">
          <div className="avatar-contact">
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
          </div>
          <div className="username-contact">
            <h1>{currentUserName}</h1>
          </div>
        </div>
      </div>
    )
  );
};

export default Contacts;
