import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 10px;
  width: 90%;
`;

const CommentCaption = styled.span`
  margin-left: 10px;
  line-height: 18px;
  word-break: break-all;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};

    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DeleteBtn = styled.span`
  position: absolute;
  right: 40px;
  cursor: pointer;
  z-index: 2;
  &:hover {
    svg {
      color: tomato;
    }
  }
  svg {
    color: ${(props) => props.theme.fontColor};
  }
`;

const Comment = ({ id, photoId, isMine, author, payload }) => {
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok, error },
      },
    } = result;
    if (ok) {
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>

      <CommentCaption>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {isMine ? (
        <DeleteBtn onClick={onDeleteClick}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </DeleteBtn>
      ) : null}
    </CommentContainer>
  );
};

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;
