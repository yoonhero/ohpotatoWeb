import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import styled from "styled-components";

import { client } from "../apollo";
import Button from "./auth/Button";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;

const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  padding: 10px 4px;
  margin: 0;

  cursor: pointer;
`;

const SearchUser = styled.div`
  margin: 0;
  margin-top: 1rem;
  width: 80%;
  border-radius: 10px;
  padding: 10px 10px;
  background: #f3f1ef;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;

    align-items: center;
    img {
      background-color: #bfbfbf;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    h1 {
      margin-left: 15px;
      font-size: 20px;
      font-weight: 400;
      color: rgb(142, 142, 142);
    }
  }
`;

const Users = (user) => {
  const {
    user: { username },
  } = user;
  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: unfollowUserUpdate,
  });
  const followUserCompleted = (data) => {
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${username}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });
  };
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    onCompleted: followUserCompleted,
  });

  const getButton = (user) => {
    const { isMe, isFollowing } = user;
    if (isMe) {
      return (
        <div>
          <Link to={`/edit/${user?.username}/`}>
            <ProfileBtn>Edit Profile</ProfileBtn>
          </Link>
        </div>
      );
    }
    if (isFollowing) {
      return (
        <div>
          <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>
        </div>
      );
    } else {
      return (
        <div>
          <ProfileBtn onClick={followUser}>Follow</ProfileBtn>
        </div>
      );
    }
  };

  console.log(user);
  return (
    <SearchUser key={user?.id}>
      <div>
        <Link to={`/users/${username}`}>
          <img src={user?.user?.avatar} />
        </Link>

        <Link to={`/users/${username}`}>
          <h1>{user?.user?.username}</h1>
        </Link>
      </div>

      {user?.user ? getButton(user.user) : null}
    </SearchUser>
  );
};

export default Users;
