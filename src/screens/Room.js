import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router";
import { LoadingSpinner } from "../components/LoadingSpinner";
import styled, { keyframes } from "styled-components";
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
const ROOM_UPDATE = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
    }
  }
`;

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
      id
    }
  }
`;

const Content = styled.main`

  margin: 0 auto;
  margin-top: 45px;
  max-width: 930px;
  width: 100%;
`;

const wavemove = keyframes`
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -1600px;
  }
`
const swell = keyframes`
    0%, 100% {
    transform: translate3d(0,-25px,0);
  }
  50% {
    transform: translate3d(0,5px,0);
  }
`
const WaveWrapper = styled.div`
  /* position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 40vh;
  border-radius: 5px;
   background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%); 
  overflow: hidden; */
  height: 10%;
  width:100%;
  position:fixed;
  bottom:0;
  left:0;
  background: #015871;
  
`
const Wave = styled.div`
      /* width: 70vw;
  height: 70vh;
  position: absolute;
  left: 50%;
 background: #03a9f4;
  z-index:0;
  margin-left: -10vw;
  margin-top: -60vh;
  border-radius: 45%;
  background: #f5f5f5;
  animation: ${wavemove} 15s infinite linear; */
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x; 
  position: absolute;
  top: -198px;
  width: 6400px;
  height: 198px;
  animation: ${wavemove} 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
  &:nth-of-type(2){
    top: -175px;
  animation: ${wavemove} 7s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -.125s infinite, ${swell} 7s ease -1.25s infinite;
  opacity: 1;
  }

`
const Wava = styled.div`
`

const Chat = styled.div`
z-index: 1;
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
  z-index: 2;
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

const rays = keyframes`
  0% {
      transform: scale(1.1);
  }
  25% {
      transform: scale(0.9);
  }
  50% {
      transform: scale(1.1);
  }
  75% {
      transform: scale(0.9);
  }
  100% {
      transform: scale(1.1);
  }
`


const SunRays = styled.span`
  position: fixed;
  bottom: 32em;
  right: 18em;
  height: 15em;
  width: 15em;
  z-index: -5;
  background: radial-gradient(rgba(255, 237, 175, .8) 50%, rgba(255, 237, 175, .2) 70%);
  border-radius: 50%;
  box-shadow: 0 0 .5em rgba(255, 237, 175, 1);
  -webkit-animation: ${rays} 10s infinite;
  -moz-animation: ${rays} 10s infinite;
  animation: ${rays} 10s infinite;
  `
const Sun = styled.span`
  position: fixed;
  bottom: 34.5em;
  right: 20.5em;
  height: 10em;
  width: 10em;
  z-index: -5;
  background: rgba(255, 237, 175, 1);
  border-radius: 50%;
  box-shadow: 0 0 1em rgba(255, 237, 175, .5), inset 0 0 .5em #FFFFAD;
`
const vibrate = keyframes`
	to {
		transform: scale(0.75) translate(15px, 15px) rotate(45deg);
	}


`

const FireContainer = styled.div`
position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Fire = styled.div`
  position: relative;
`

const Diamond = styled.div`

  transform: rotate(45deg);
  width: 140px;
height: 140px;
  border-radius: 20px;
  animation: ${vibrate} 0.85s ease-in
		0.25s alternate-reverse infinite;
  background-color:#bf033b;
	background-image: linear-gradient(
		195deg,
	#bf033b 0%,
#ffc719 74%
	);
`

const DiamondRight = styled.div`
  position:absolute;
  top: 10px;
  right: -20px;
  transform: rotate(45deg);
  width: 70px;
height: 70px;
border-radius: 15px;
  animation: ${vibrate} 0.85s ease-in
		0.25s alternate-reverse infinite;
  background-color:#bf033b;
	background-image: linear-gradient(
		195deg,
	#bf033b 0%,
#ffc719 74%
	);
`

const DiamondLeft = styled.div`
  position:absolute;
  top: 10px;
  left: -20px;
  transform: rotate(45deg);
width: 70px;
height: 70px;
  border-radius: 15px;
  animation: ${vibrate} 0.85s ease-in
		0.25s alternate-reverse infinite;
  background-color:#bf033b;
	background-image: linear-gradient(
		195deg,
	#bf033b 0%,
#ffc719 74%
	);
`

const Room = () => {
  const scrollRef = useRef(null);
  const { id } = useParams();
  const [avatar, setAvatar] = useState("")
  const [talkingto, setTalkingto] = useState("")
  const [emotion, setEmotion] = useState(0)
  const { register, handleSubmit, getValues, setValue } = useForm({
    mode: "onChange",
  });
  const { data, loading, subscribeToMore } = useQuery(SEE_ROOM, {
    variables: { id: Math.floor(id) },
  });
  const { data: userData } = useUser();
  const [sendMessage, { loading: sendMessageLoading }] = useMutation(
    SEND_MESSAGE_MUTATION
  );
  useEffect(() => {
    animateScroll.scrollToBottom()
    setEmotion(localStorage.getItem("EMOTION"))
  }, [])
  useEffect(() => {
    if (data !== undefined) {

      getAvatar(data?.seeRoom?.users)
      // subscribeToMore({
      //   document: ROOM_UPDATE,
      //   variables: {
      //     id: Math.floor(id),
      //   },
      //   updateQuery,
      // });
    }
  }, [data])



  const updateQuery = (prevQuery, options) => {

    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: message,
      });
      const ROOM_ID = `Room:${id}`;
      client.cache.modify({
        id: ROOM_ID,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage) => aMessage.__ref === incomingMessage.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, incomingMessage];
          },
        },
      });
    }
    animateScroll.scrollToBottom()
  };
  const createMessage = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        sendMessage: { ok, id: messageId },
      },
    } = result;
    if (ok && userData?.me) {
      const newMessage = {
        __typename: "Message",
        createdAt: String(Date.now()),
        id: messageId,
        payload,
        read: false,
      };

      const newCacheComment = cache.writeFragment({
        data: newMessage,
        fragment: gql`
          fragment BSName on Message {
            id
            createdAt
            read
            payload
          }
        `,
      });
      cache.modify({
        id: `Room:${id}`,
        fields: {
          messages(prev) {
            return [...prev, newCacheComment];
          },
        },
      });
    }
    animateScroll.scrollToBottom()
  };

  const onSubmitValid = (data) => {
    if (sendMessageLoading || loading) {
      return;
    }
    sendMessage({
      variables: {
        ...data,
        roomId: Math.floor(id),
      },

      update: createMessage,
    });
  };

  const getAvatar = (data) => {
    data.map((user) => {
      if (user?.id !== userData.me.id) {
        setAvatar(user?.avatar)
        setTalkingto(user?.username)
      }
    })
  }


  const orderedData = data?.seeRoom?.messages?.slice().sort(function (a, b) {
    return a["id"] - b["id"];
  });

  return (
    <>
      <RoomHeader username={ talkingto } url={ avatar } />
      <Content>
        { emotion < 25 ? <><SunRays></SunRays>
          <Sun></Sun></> : emotion < 50 ? <WaveWrapper>
            <Wave></Wave>
            <Wave></Wave>
          </WaveWrapper> : emotion < 75 ? null : <FireContainer>
            <Fire>
              <DiamondLeft></DiamondLeft>
              <Diamond></Diamond>
              <DiamondRight></DiamondRight>
            </Fire>
          </FireContainer> }


        { loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Chat ref={ scrollRef } name="scrollToElement" id="scrolltoelement">
              { orderedData?.map((message) => (
                <SeeMessage message={ message } />
              )) }
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

          </>
        ) }
      </Content>
    </>
  );
};

export default Room;
