import Avatar from "./Avatar";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      error
    }
  }
`;

const ConversationStart = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 27px;
  text-align: center;
  span {
    font-size: 14px;
    display: inline-block;
    &:before,
    &:after {
      position: absolute;
      top: 10px;
      display: inline-block;
      width: 30%;
      height: 1px;
      content: "";
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
`;

const Bubble = styled.div`
  min-width: 20%;
  max-width: 60%;
  margin-top: 1rem;
  font-size: 16px;
  position: relative;
  display: inline-block;
  clear: both;
  margin-bottom: 8px;
  padding: 20px 34px;
  vertical-align: top;
  border-radius: 15px;
  align-items: center;
  &:before {
    position: absolute;
    top: 19px;
    display: block;
    width: 8px;
    height: 6px;
    transform: rotate(29deg) skew(-35deg);
  }
`;

const YouAvatar = styled(Avatar)``;
const You = styled(Bubble)`
  display: flex;
  flex-direction: row;
  float: left;
  color: #6c7a89;
  background-color: #e8f1f7;
  align-self: flex-start;
  span {
    margin-left: 1rem;
    max-width: 80%;
  }
  &:after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #e8f1f7;
    content: "";
    position: absolute;
    top: -10px;
    left: 30px;
  }
  &:before {
    left: -3px;
    background-color: blue;
  }
`;

const Me = styled(Bubble)`
  float: right;
  color: #ffffff;
  background-color: #73a2e2;
  align-self: flex-end;
  &:after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #73a2e2;
    content: "";
    position: absolute;
    top: -10px;
    right: 30px;
  }
  &:before {
    right: -3px;
    background-color: #eceff1;
  }
  div {
    position: absolute;
    left: -5px;

    top: -5px;
    color: #67809f;
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
max-width: 80%;
  color: ${(props) =>
    props.outGoing ? "white" : "#52616b"};;
  background-color: ${(props) =>
    props.outGoing ? "#3fc380" : "#c9d6df"};
  padding: 15px 20px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 15px;
  margin: 0px 10px;
  position: relative;
  &:after {border-width:15px 10px; left:50%; margin-left:-10px;
    border-color:transparent transparent #3fc380 transparent; top:-25px;
}
`;
const SeeMessage = ({ message }) => {
  return (
    <MessageContiainer outGoing={ message?.user?.isMe } key={ message.id }>
      {message?.user?.isMe ? null : <Avatar url={ message?.user?.avatar } /> }
      <Message outGoing={ message?.user?.isMe }>{ message?.payload }</Message>
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
