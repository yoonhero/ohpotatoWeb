import styled from "styled-components";

export const BaseBox = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 100%;
`;

export const FatLink = styled.span`
  font-weight: 600;
  color: rgb(142, 142, 142);
`;

const SNotification = styled.div`
  font-size: 12px;
  margin-top: 10px;
  color: #2ecc71;
`;

export const Notification = ({ children }) => {
  return children ? <SNotification>{children}</SNotification> : null;
};

export const FatText = styled.span`
  font-weight: 600;
`;
