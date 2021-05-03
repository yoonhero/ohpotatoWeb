import { useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faAngleLeft,
  faCompass,
  faHome,
  faPaperPlane,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Input from "./auth/Input";
import Avatar from "./Avatar";

const SHeader = styled.header`
top: 0;
left:0;
position: fixed;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  z-index: 10;
  svg {
    color: #6c7a89;
  }
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div`
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  p{
    margin-left: 10px;
  }
`;

const Icon = styled.span`
  text-decoration: none;
  margin-left: 15px;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: ${(props) => props.theme.bgColor};
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;


export const RoomHeader = ({ url, username }) => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();
  const history = useHistory();

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={ routes.home }>
            <FontAwesomeIcon icon={ faAngleLeft } size='2x' />
          </Link>
        </Column>
        <Column>
          <Avatar url />
          <p>{ username }</p>
        </Column>
        <Column>
          { isLoggedIn ? (
            <IconsContainer>
              <Icon>
                <Link to={ `/edit/${data?.me?.username}` }>
                  { data?.me?.avatar ? (
                    <Avatar url={ data?.me?.avatar } />
                  ) : (
                    <FontAwesomeIcon icon={ faUser } size='lg' />
                  ) }
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <Link to={ routes.home }>
              <Button>Login</Button>
            </Link>
          ) }
        </Column>
      </Wrapper>
    </SHeader>
  );
};


