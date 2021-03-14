import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { LoadingSpinner } from "./LoadingSpinner";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import SeeMessage from "./SeeMessage";

export const SEE_ROOM = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id

      unreadTotal
      users {
        id

        username

        avatar
      }
      messages {
        id
        payload
        user {
          username
          avatar
          isMe
        }
        createdAt
        read
      }
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      error
    }
  }
`;

const OtherMessage = styled.div`
  position: relative;
  background-color: #2ecc71;
  max-width: 30%;
  min-width: 10%;
  color: white;
  margin-top: 1rem;
  border-radius: 15px;
  padding: 20px 20px 20px;
  &:after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #2ecc71;
    content: "";
    position: absolute;
    top: -10px;
    left: 30px;
  }
`;

const MyMessage = styled.div`
  position: relative;
  background-color: #2ecc71;
  max-width: 30%;
  min-width: 10%;
  color: white;
  margin-top: 1rem;
  border-radius: 15px;
  padding: 20px 20px 20px;
  &:after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #2ecc71;
    content: "";
    position: absolute;
    top: -10px;
    left: 30px;
  }
`;
const Username = styled.span`
  margin-left: 1rem;
  font-size: 17px;
  font-weight: 600px;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const Container = styled.div`
  top: 50%;
  left: 50%;
  width: 80%;
  height: 75%;
  background-color: #ffffff;
  transform: translate(-50%, -50%);
`;

const Input = styled.input`
  border-radius: 20px;
  border: none;
  background-color: #a0cbe7;
  width: 50%;

  bottom: 0;

  font-size: 17px;
  color: #757575;
  padding: 20px;
`;
const Chat = styled.div`
  position: relative;

  overflow: hidden;
  padding: 0 35px 92px;
  border: none;
  justify-content: flex-end;
  flex-direction: column;
`;

const InputContainer = styled.div`
  background-color: #a0cbe7;
  margin: 0;
  justify-content: center;
  width: 100%;
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  button {
    color: #9ab7e3;
    background: inherit;
    border: none;
    svg {
      font-size: 30px;
    }
  }
`;

const Room = () => {
  const { id } = useParams();
  const { data, loading } = useQuery(SEE_ROOM, {
    variables: { id: Math.floor(id) },
  });
  console.log(data);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Chat>
            {data?.seeRoom?.messages?.map((message) => (
              <SeeMessage message={message} />
            ))}
          </Chat>
          <InputContainer>
            <Input type='text' placeholder='type a message' />
            <button type='submit'>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </InputContainer>
        </>
      )}
    </>
  );
};

export default Room;
