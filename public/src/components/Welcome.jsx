import React from 'react'
import Robot from '../assets/robot.gif'
import styled from 'styled-components'

function Welcome({currentUser}) {
  // We are passing the currentuser here to display
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      {currentUser && (
        <>
          <h1>Welcome, <span>{currentUser.username}!</span></h1>
          <br />
          <h3>Please Select a chat to start messaging!!!</h3>
        </>
      )}
    </Container>
  );
}

export default Welcome;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    height: 20rem;
  }
  h1, h3 {
    color: white;
  }
  span {
    color: #4e0eff;
  }
`;
