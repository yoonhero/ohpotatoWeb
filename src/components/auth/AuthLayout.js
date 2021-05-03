import { useReactiveVar } from "@apollo/client";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { darkModeVar, disabledDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

const Footer = styled.footer`
  margin-top: 20px;
`;

const DarkModaBtn = styled.span`
  cursor: pointer;
`;

const AuthLayout = ({ children }) => {
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <Container>
      <Wrapper>{ children }</Wrapper>
      {/* <Footer>
        <DarkModaBtn onClick={darkMode ? disabledDarkMode : enableDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </DarkModaBtn>
      </Footer> */}
    </Container>
  );
};

export default AuthLayout;
