import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useHistory, useLocation, useParams } from "react-router";
import { LoadingSpinner } from "../components/LoadingSpinner";
import styled from "styled-components";
import { RoomHeader } from "../components/RoomHeader"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import SeeMessage from "../components/SeeMessage";
import { useForm } from "react-hook-form";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";
import { useRef, useState, useEffect } from "react";
import { client } from "../apollo";
import { scroller, animateScroll } from "react-scroll"
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
  mutation sendMessage($payload: String!, $userId: Int!) {
    sendMessage(payload: $payload, userId: $userId) {
      ok
      error
      id
      roomId
    }
  }
`;


export const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      unreadTotal
      users {
        id
        username
        avatar
        isMe
      }
    }
  }
`;

const Content = styled.main`

  margin: 0 auto;
  margin-top: 45px;
  max-width: 930px;
  width: 100%;
`;

const Chat = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 0 35px 92px;
  border: none;
  justify-content: flex-end;
  flex-direction: column;
  overflow-y: auto;
  @media only screen and (max-width: 400px){
    padding: 5px;
    padding-bottom: 90px;
  }
`;

const InputContainer = styled.form`

  background-color: #f5f5f5;
  margin: 0;
  justify-content: center;
  width: 100%;
  position: fixed;
  left:0;
  bottom: 0;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  button {
    margin-left: 15px;
    color: #f1f9f9;
    background: #484d51;
    border-radius: 50%;
    padding:10px;
    border: none;
    svg {
      font-size: 20px;
    }
  }
`;

const Input = styled.input`
  border-radius: 20px;
  border: none;
  background-image: linear-gradient(to top, #c1dfc4 0%, #deecdd 100%);
  width: 50%;

  bottom: 0;

  font-size: 17px;
  color: #757575;
  padding: 12px;
`;

const CreateRoom = () => {
  const location = useLocation()
  const history = useHistory()
  const scrollRef = useRef(null);
  const [avatar, setAvatar] = useState("")
  const [talkingto, setTalkingto] = useState("")
  const { register, handleSubmit, getValues, setValue } = useForm({
    mode: "onChange",
  });

  const { data: userData } = useUser();
  const [sendMessage, { loading: sendMessageLoading }] = useMutation(
    SEND_MESSAGE_MUTATION
  );

  useEffect(() => {
    if (location?.state?.talkingto === undefined) {
      history.push("/")
    }
    setAvatar(location?.state?.talkingto?.avatar)
    setTalkingto(location?.state?.talkingto?.username)
  }, [])

  const createMessage = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        sendMessage: { ok, roomId },
      },
    } = result;
    console.log(result)
    history.replace()
    console.log(roomId)
    if (ok && userData?.me) {
      history.push(`/room/${roomId}`)
    }
  };

  const onSubmitValid = (data) => {
    if (sendMessageLoading) {
      return;
    }
    sendMessage({
      variables: {
        ...data,
        userId: Math.floor(location?.state?.talkingto?.id),
      },

      update: createMessage,
    });

  };


  return (
    <>
      <RoomHeader username={ talkingto } url={ avatar } />
      <Content>
        <Chat ref={ scrollRef } name="scrollToElement" id="scrolltoelement">

        </Chat>
        <InputContainer onSubmit={ handleSubmit(onSubmitValid) }>
          <Input
            ref={ register({
              required: "Please type message",
            }) }
            name='payload'
            type='text'
            placeholder='type a message'
          />
          <button type='submit'>
            <FontAwesomeIcon icon={ faPaperPlane } />
          </button>
        </InputContainer>
      </Content>
    </>
  );
};

export default CreateRoom;
