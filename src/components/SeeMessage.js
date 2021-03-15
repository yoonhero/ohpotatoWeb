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
const SeeMessage = ({ message }) => {
  const [readMessage] = useMutation(READ_MESSAGE_MUTATION);

  if (message?.user?.isMe) {
    return (
      <Me key={message.id}>
        <span>{message?.payload}</span>
        {message?.read ? null : (
          <div>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        )}
      </Me>
    );
  } else {
    readMessage({
      variables: {
        id: message.id,
      },
    });
    return (
      <You>
        {message?.user?.avatar ? (
          <YouAvatar url={message?.user?.avatar} />
        ) : (
          <YouAvatar url='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXd3N3////a2dr7+/v29vbf3t/s7Ozx8fHe3d75+fnj4uPn5+fq6urv7+/l5OX39vdM82/MAAAE+ElEQVR4nO2di5qqMAyEsSAqKr7/2x4rywKuKJCkM/XkfwLnS5lcerEoHMdxHMdxHMdxHMdxHMdxHMdxHMdxHMdxHMcBER6gf4UFd1VNe67rqrrdqsPl0rbHbxIa9udDWe6mlGVVN9+hsrk+ixtxOB8zF9kc3sjrqNpsRYairT7J66j3WWoM9TJ5XSCb7DSGdoW+yKHISmNoTysF3qnRv3oF++t6fXdObSZhDO1H/5zjmofENQ7zJ4x79K//zPEmEHjnzB7GsMFippB/jI1U350Ds8SzgsCYGmlZm+XnqFijuFcSyLtQ1QTudhdGiUexi445o+X8JSzslJbSoAU9Ey66AnclWtEzGolwCpmh7jcX2/Nc0KLGrOrnF4NWNUZ/jUaI1qm2j/bwtFJa1dozFVrYL0YCeczGxGYesCRFg0zRw1G82RhpB0eTYWSkHQx2erQUSDFf3Db9XQxa3j3bG/pMpEULNPWZCN5r7JJhR4lWKJ8AfwK9TG2dNILedNOZAb/jBl6mxrniTnmECrTqDMeAyxpzo0Fbjd4gf57r1yvE5nyr+cUY7EDKPlnsdiekwEJ7lk+nMBwSKIQ2UK7QFbpCvELz/jeCHQunyIfYjP/9Nc3316XWkza8wu/vD4PwNOkSsD1+ioQInmLYpwts85TCTLFDDPuNGYJtYPO6DS3QPCMSHBsyXqbwRWqeL9D6Cms3xW+QFsbLFL17+MAy6Z8YQvgfnImy9BqGA0OFpdcwnBeK2JyB3sG3f0dYFacURtphY6fwozQjbFp9qmszFvU3RTnzS9BfpyTJ/hf9pEi1RiPafspRzUzQ/RRZcv0EzdKGy2V6FK8goieIc+hVb5QRjASdk4olSUfxCpWFyrpEO4LcUdEz7o9IJXK66ISj6FAt+csmP2z3mxwe4IlsfkaJ/hMc2JQZT1m9SxdWL9VsHvr6ITRro3jN6dW9EOotflrVmTz2GZrt6SKH5xMl+nLQKNXHrjHsde4IVbRpQ28YRfmeWag1R1FlzRbG0GhPvW9kn6PFNUSiKjXsbc5g8hSqdhv5HGNhpfHTaxgGwxavfI2Az91CY302scR6qsGm2l+Q7+6aHVGYgsv+6m8lzoF669PURKdgLDXFYwO/IM7RJhWIkJjIZAZS200ykxlIazfJIxhJGUWIwKQSU9zJe0WyIzbGxfY8qcrwANIXSbJO09xQnyHFDjHIZXoSuA3KZXrs3QYs0PyaUOJq9BXGFWqKFwY+YXu+Ha3ugaE+gjUaMVynKeZOSzAbFNvfal6I1UUMcK4fY5T3U7xjshSTEhxajz5jUp+iy7UpFsUbi810GDwexZIpetQzBk2m6FHPGGwhVA8iXQjVg8gXQu0gJnjwajWq9zKYypkBxcKGqpwZUCxsOEOoGURGn4moeQ1hquhQSxhcNfcYpfqbZDrzCq2JDVrHG3QEpt/QXo7OX8/xLlKl/w+0/ycZCRov2LAmww6FlEjspBEFN0XuaS9BrpB7kSosU9K2YkDcYNDWpD3i2pS1cRqQtlDsn6H4Q6T/DOUfIvtnKJ7v87aGA7ImkeHsxSdkZzN4tn3nEf0FJHlR2iErTfmNRmg1/Pk+Isn5ORiNzGqYRzQDkmFNuptNEgRXorOwUpGZ0rdOHYIGin2C0eMK58mh7o5sr73zSIeShJhD3R3ZXnvnkfAlKf/rY5jBkKbj7ajmH95NWlrOaBenAAAAAElFTkSuQmCC' />
        )}

        <span>{message?.payload}</span>
      </You>
    );
  }
};

export default SeeMessage;
