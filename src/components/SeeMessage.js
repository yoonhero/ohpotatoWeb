import Avatar from "./Avatar";
import { gql, useMutation } from "@apollo/client";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      error
    }
  }
`;

const MessageContiainer = styled.div`
margin: 10px;
  padding: 0px 10px;
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
  position: relative;
  


  @media only screen and (max-width: 400px){
    padding: 0px;
  }

`;

const Message = styled.div`
  display: flex;
  border-radius: 10px 15px;
max-width: 90%;
min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  overflow: hidden;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;
`

const Happiness = styled.div`
  display: flex;
max-width: 90%;
min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 20px 30px;
  color: white;
  overflow: visible;
  border-radius: 20px;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;
  /* background-color:#c5eff7; */
  /* border-radius: 40% 30% 70% 10%; */
  background-color: inherit;
  background-image: url(http://localhost:3000/happy.svg);
  background-repeat: none;
  background-size: 120% ;
  background-position: center;
`

const HappyMessage = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
max-width: 90%;
min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  overflow: hidden;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;
  border-radius: 50% / 10px 10px 100% 100%;
  background:#e74c3c;

  font-weight: 400;
  
  p{
    max-width: 80%;
  }
  
  /* &::after{
    position:absolute;
    content:"";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: black;
    top: -10px;
    
  }
  &::before{
    position:absolute;
    content:"";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: black;
    top: -10px;
    right: 70px;
  } */
`;

const dropping = keyframes`
  0% {
		transform: translate(0px,0px) rotate(-90deg);
    
	}

	60% {
		transform: translate(0px,15px) rotate(-80deg);
	}

	100% {
		transform: translate(0px,5px) rotate(-95deg);
	}
`

const SadMessage = styled.div`
  position:relative;
  display: flex;
  max-width: 90%;
  min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  color: white;
  overflow: visible;
  border-radius: 15px 10px;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;
  /* background-color:#c5eff7; */
  /* border-radius: 40% 30% 70% 10%; */
  background-color: #3A93E4;
  /*background-image:url("http://localhost:3000/sad2.svg");
  background-repeat: none;
  background-size: cover ;
  background-position: center; */
  
  svg{
    position:absolute;
    width: 20px;
    
    top: 30px;
    animation: ${dropping} 2s ease infinite;
    
  }

`

const FireTextColorChange = keyframes`
  0%{
    color: #FCFE09;
  }
  50% {
    color: #FFC629;
  }
  60%{
    color: #AA1404;
  }
  100%{
    color: #FFC629;
  }
`

const AngryMessage = styled.div`
position:relative;
display: flex;
  max-width: 90%;
  min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  color: black;
  overflow: visible;
  border-radius: 15px 10px;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;
  /* background-color:#c5eff7; */
  /* border-radius: 40% 30% 70% 10%; */
  background-color: #0e0e0e;
  /*background-image:url("http://localhost:3000/sad2.svg");
  background-repeat: none;
  background-size: cover ;
  background-position: center; */
  
  p{
    color: #ffeb3b;
    font-weight: 400;
    font-size: 18px;
    animation: ${FireTextColorChange} 4s infinite;
    text-shadow: 0 0 10px #ff8c3b;
    
  }
`

const CuriousMoving = keyframes`
  0% {
		transform: translate(0px,0px);
    
	}

	60% {
		transform: translate(0px,-15px) ;
	}

	100% {
		transform: translate(-15px,-5px);
	}
`

const CuriousMessage = styled.div`
  position: relative;
  border-radius: 10px 15px;
max-width: 90%;
min-width: 16%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  /* border-radius: 10px 20px 0 0; */
  font-size: 16px;
  margin: 0px 10px;

  p{
    z-index: 5;
  }
  svg{
    position: absolute;
    animation: ${CuriousMoving} 2s infinite;
    right: 10px;
  }
`




const SeeMessage = ({ message }) => {
  return (
    <MessageContiainer outGoing={ message?.user?.isMe } key={ message.id }>

      {message?.user?.isMe ? null : <Avatar url={ message?.user?.avatar } /> }
      <Message outGoing={ message?.user?.isMe }>
        <p>{ message?.payload }</p>
        {/* sad message <svg width="10px" height="20px" viewBox="0 0 482 297" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <ellipse rx="106.76" ry="143.996" transform="matrix(0.0193094 0.999814 -0.999933 0.0115742 182.388 146.414)" fill="#3A93E4" />
          <path d="M417.394 122.611C437.234 130.604 437.799 158.471 418.292 166.898L268.946 231.416C253.271 238.188 235.602 226.768 235.255 209.639L232.706 83.9246C232.359 66.796 249.557 54.9911 265.5 61.4144L417.394 122.611Z" fill="#3A93E4" />
        </svg> */}
        {/* curious message <FontAwesomeIcon icon={ faSearch } size="2x" /> */ }


      </Message>

    </MessageContiainer>
  )
  // if (message?.user?.isMe) {
  //   return (
  //     <Me key={ message.id }>
  //       <span></span>
  //     </Me>
  //   );
  // } else {

  //   return (
  //     <You>
  //       {message?.user?.avatar ? (
  //         <YouAvatar url={ message?.user?.avatar } />
  //       ) :
  //         null }

  //       <span>{ message?.payload }</span>
  //     </You>
  //   );
  // }
};

export default SeeMessage;
