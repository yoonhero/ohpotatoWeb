import { useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
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
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
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

const SearchInput = styled(Input)`
  width: 100%;
`;

const SearchButton = styled(Button)`
  position: absolute;
  background: inherit;
  top: 20px;
  svg {
    color: rgb(38, 38, 38);
  }
`;

const FileInput = styled.input`
  display: none;
`;

export const Header = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();
  const history = useHistory();

  const { register, handleSubmit, getValues, setValue } = useForm({
    mode: "onChange",
  });

  const onSubmitValid = async () => {
    const { search } = getValues();
    setValue("");
    history.push(`/search/${search}`);
  };

  const onSubmitImg = async () => {
    const { image } = getValues();
    if (!image) {
      return;
    }
    history.push("/upload", {
      image: image[0],
    });
  };

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <Link to={routes.home}>
            <FontAwesomeIcon icon={faPaperPlane} size='2x' />
          </Link>
        </Column>
        <Column>
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <SearchInput
              ref={register({})}
              type='text'
              name='search'
              placeholder='검색...'
            />

            <SearchButton type='submit'>
              <FontAwesomeIcon icon={faSearch} />
            </SearchButton>
          </form>
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Icon>
                <Link to={`/edit/${data?.me?.username}`}>
                  {data?.me?.avatar ? (
                    <Avatar url={data?.me?.avatar} />
                  ) : (
                    <FontAwesomeIcon icon={faUser} size='lg' />
                  )}
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <Link to={routes.home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
      </Wrapper>
    </SHeader>
  );
};
