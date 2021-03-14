import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faPaperPlane,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEllipsisV,
  faHeart as SolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { FEED_QUERY } from "../../screens/Home";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
      error
    }
  }
`;

const EDIT_PHOTO_MUTATION = gql`
  mutation editPhoto($id: Int!, $caption: String!) {
    editPhoto(id: $id, caption: $caption) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  margin-left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  min-width: 615px;
  max-width: 615px;
  @media only screen and (max-width: 615px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

const PhotoHeader = styled.div`
  justify-content: space-between;
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid rgb(239, 239, 239);
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

const PhotoData = styled.div``;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin: 0 15px 15px 15px;
  display: block;
`;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px",
    border: "none",
    backgroundColor: "white",
  },
};

const PhotoActionBtn = styled.button`
  width: 100%;
  background-color: inherit;
  padding: 20px 200px;
  border: none;
  &:focus {
    outline: none;
  }
`;

const Separator = styled.div`
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  div {
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.borderColor};
  }
`;

const Photo = ({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
  isMine,
}) => {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const location = useLocation();
  const body = document.body;
  const photoOptions = () => {
    disableBodyScroll(body);
    setModalIsOpen(true);
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });
  const [deletePhotoMutation, { loading }] = useMutation(DELETE_PHOTO_MUTATION);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  function closeModal() {
    enableBodyScroll(body);
    setModalIsOpen(false);
  }

  const deletePhoto = async () => {
    if (loading) {
      return;
    }
    if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      return;
    }
    await deletePhotoMutation({
      variables: {
        id,
      },
    });
  };

  return (
    <>
      <PhotoContainer key={id}>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <PhotoActionBtn
            onClick={function () {
              setModalIsOpen(false);
              navigator.clipboard.writeText(window.location.href);
              clearAllBodyScrollLocks(body);
              window.alert("링크 복사 완료!!");
            }}
          >
            공유하기
          </PhotoActionBtn>

          {isMine ? (
            <>
              <Separator>
                <div></div>
              </Separator>
              <PhotoActionBtn onClick={deletePhoto}>지우기</PhotoActionBtn>
            </>
          ) : null}

          <Separator>
            <div></div>
          </Separator>
          <PhotoActionBtn onClick={closeModal}>취소</PhotoActionBtn>
        </Modal>
        <PhotoHeader>
          <div>
            <Link to={`/users/${user.username}`}>
              <Avatar lg url={user.avatar} />
            </Link>

            <Link to={`/users/${user.username}`}>
              <Username>{user.username}</Username>
            </Link>
          </div>

          <div>
            <span onClick={photoOptions}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </span>
          </div>
        </PhotoHeader>
        <PhotoFile src={file} />
        <PhotoData>
          <PhotoActions>
            <div>
              <PhotoAction onClick={toggleLikeMutation}>
                <FontAwesomeIcon
                  style={{ color: isLiked ? "tomato" : "inherit" }}
                  icon={isLiked ? SolidHeart : faHeart}
                />
              </PhotoAction>
              <PhotoAction>
                <FontAwesomeIcon icon={faComment} />
              </PhotoAction>
              <PhotoAction>
                <FontAwesomeIcon icon={faPaperPlane} />
              </PhotoAction>
            </div>
            <div>
              <FontAwesomeIcon icon={faBookmark} />
            </div>
          </PhotoActions>
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
          <Comments
            photoId={id}
            author={user.username}
            caption={caption}
            commentNumber={commentNumber}
            comments={comments}
          />
        </PhotoData>
      </PhotoContainer>
    </>
  );
};

Photo.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }),
  caption: PropTypes.string,
  file: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likes: PropTypes.number.isRequired,
  commentNumber: PropTypes.number.isRequired,
};

export default Photo;
