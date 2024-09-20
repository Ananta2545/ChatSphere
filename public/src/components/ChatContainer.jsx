import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import {v4 as uuidv4} from 'uuid';

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentUser && currentChat) {
          console.log('currentUser:', currentUser._id);
          console.log('currentChat:', currentChat._id);

          // Fetching messages from the backend
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });

          // Debugging response
          console.log('Fetched messages:', response.data);

          // Ensure that response.data exists and is an array
          if (response.data) {
            setMessages(response.data);
          } else {
            console.warn("No messages found or invalid response format");
          }
        } else {
          console.warn("currentUser or currentChat is undefined");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  // Handle sending messages // *****
  const handleSendMsg = async (msg) => {
    if (currentUser && currentChat) {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
    }
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({fromSelf: true, message: msg});
    setMessages(msgs);
  };

  // ****
  useEffect(()=>{
    if(socket.current){
      socket.current.on("msg-receive",(msg)=>{
        console.log("Received message:", msg);
        setArrivalMessage({fromSelf: false, message: msg});
      });
    }
  },[socket])

  // ** 
  useEffect(()=>{
    arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage]);
  },[arrivalMessage])

  // **
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  },[messages]);
  return (
    <>
      {/* If currentChat is active, display the chat avatar and username */}
      {currentChat ? (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="chat-avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="chat-username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {/* Display the fetched messages */}
            {messages.map((message) => (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      ) : (
        <p>No active chat</p>
      )}
    </>
  );
}

export default ChatContainer;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% auto;
  gap: 0.5rem;
  overflow: hidden;
  // background: #1f1f1f;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% auto;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    // background: linear-gradient(90deg, #3a3a3a, #1f1f1f);
    border-bottom: 1px solid #333;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .chat-avatar img {
        height: 2.5rem;
        border-radius: 50%;
        border: 2px solid #4e0eff;
      }
      .chat-username h3 {
        color: #fff;
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    height: 62vh;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .message-content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        background-color: #373737;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .message-content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }

`;
