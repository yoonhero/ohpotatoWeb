import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router";
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

const Room = () => {
  const scrollRef = useRef(null);
  const { id } = useParams();
  const [avatar, setAvatar] = useState("")
  const [talkingto, setTalkingto] = useState("")
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
  }, [])
  useEffect(() => {
    if (data !== undefined) {

      getAvatar(data?.seeRoom?.users)
      subscribeToMore({
        document: ROOM_UPDATE,
        variables: {
          id: Math.floor(id),
        },
        updateQuery,
      });
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
