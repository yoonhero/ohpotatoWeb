import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 7px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.inputBgColor};
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};
  margin-top: 5px;
  box-sizing: border-box;
  color: #2e3131;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border-color: rgb(38, 38, 38);
  }
  
`;

export default Input;
