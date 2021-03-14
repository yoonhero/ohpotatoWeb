import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const SLoading = styled.div`
  z-index: -2;
  position: absolute;
  width: 100%;
  display: flex;
  height: 100vh;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  svg {
    font-size: 40px;
    font-weight: 400;
  }
`;

export const LoadingSpinner = () => {
  return (
    <SLoading>
      <FontAwesomeIcon icon={faSpinner} pulse />
    </SLoading>
  );
};
