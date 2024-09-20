import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';
// import { height } from '@fortawesome/free-solid-svg-icons/fa0';

export default function ChatInput({handleSendMsg}) {

  // 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);// for emoji 
  const [msg, setMsg] = useState("");// message part 
  const emojiPickerRef = useRef(null);

  const handleEmojiPickerHideShow = () => {// emoji picker will hide or show based on the click
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prevMsg) => prevMsg + emojiObject.emoji);
  };

  const handleClickOutside = (event)=>{// if click happens outside the emoji picker will hide
    if(emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)){
      setShowEmojiPicker(false);
    }
  }

  useEffect(()=>{
    document.addEventListener('mousedown',handleClickOutside);
    return ()=> document.removeEventListener('mousedown', handleClickOutside);
  })

  // this sendChat is used to sending the message
  const sendChat = (event)=>{
    event.preventDefault();
    if(msg.length > 0){
      handleSendMsg(msg);// passing msg as the parameter to handleSendMsg
      setMsg('');
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div ref={emojiPickerRef}>
              <Picker
                style={{ height: '350px', width: '300px' }}
                onEmojiClick={handleEmojiClick}
                />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e)=>sendChat(e)}>
        <input
          type="text"
          placeholder="Type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #080420;
  padding: 1rem 2rem;
  gap: 1rem;
  position: relative; /* Ensures the emoji picker is positioned relative to the container */
  margin-top: -43px;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0.5rem 1rem;
    gap: 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    position: relative; /* Make sure the emoji picker is relative to this container */
    
    .emoji {
      svg {
        font-size: 1.8rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .EmojiPickerReact {
        position: absolute;
        bottom: 60px; /* Adjust to position the emoji picker below the input */
        left: 0;
        z-index: 10;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        height: 200px;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories .epr-emoji-category-label {
          button {
            filter: contrast(0);
          }
        }

        .epr-search-container .epr_-2zpaw9 {
          background-color: transparent;
          border-color: #9a86f3;
        }

        .epr_-xuzz9z {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #ffffff34;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    position: relative;

    input {
      flex: 1;
      height: 100%;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 1.2rem;
      padding-left: 1rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 1.5rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;

      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }
`;
