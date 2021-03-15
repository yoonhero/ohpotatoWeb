import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useParams } from "react-router";
import { LoadingSpinner } from "./LoadingSpinner";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import SeeMessage from "./SeeMessage";
import { useForm } from "react-hook-form";
import PageTitle from "./PageTitle";
import useUser from "../hooks/useUser";

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

const ROOM_UPDATE_SUBSCRIPTION = gql`
  subscription($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        avatar
        username
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

const InputContainer = styled.form`
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
  const { register, handleSubmit, getValues, setValue } = useForm({
    mode: "onChange",
  });
  const { data, loading } = useQuery(SEE_ROOM, {
    variables: { id: Math.floor(id) },
  });
  const { data: userData } = useUser();
  const [sendMessage, { loading: sendMessageLoading }] = useMutation(
    SEND_MESSAGE_MUTATION
  );

  const {
    data: roomUpdateData,
    loading: roomUpdateLoading,
    error,
  } = useSubscription(ROOM_UPDATE_SUBSCRIPTION, {
    variables: {
      id: Math.floor(id),
    },
  });
  if (roomUpdateLoading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log(roomUpdateData);

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
  const orderedData = data?.seeRoom?.messages?.slice().sort(function (a, b) {
    return a["id"] - b["id"];
  });

  return (
    <>
      <PageTitle title={`Talked with ${id}`} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Chat>
            {orderedData?.map((message) => (
              <SeeMessage message={message} />
            ))}
          </Chat>
          <InputContainer onSubmit={handleSubmit(onSubmitValid)}>
            <Input
              ref={register({
                required: "Please type message",
              })}
              name='payload'
              type='text'
              placeholder='type a message'
            />
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
