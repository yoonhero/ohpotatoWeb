import styled from "styled-components";
import { BaseBox } from "../shared";

const Container = styled(BaseBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  border-radius:10px;
  div {
    display: flex;
    justify-content: center;
  align-items: center;
  flex-direction: column;
    svg {
      color: #dadfe1;
    }
    img{

    max-width: 30%;
  }
  h1{
    font-size: 30px;
    font-weight: 400;
  }
  }
  

  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 50px;
    
  }
`;

const FormBox = ({ children }) => {
  return <Container>{ children }</Container>;
};

export default FormBox;
