import styled from "styled-components";

const Button = styled.input`
  width: 100%;
  border: none;
  border-radius: 3px;
  margin-top: 12px;
  background-color: ${(props) => props.theme.accent};
  color: #ffffff;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.2" : "1")};
  box-shadow:  8px 8px 16px #d6d6d6,
             -8px -8px 16px #ffffff;
`;
export default Button;
