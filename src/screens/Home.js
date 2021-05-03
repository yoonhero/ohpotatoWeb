import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";
import styled from "styled-components"
import Button from "../components/auth/Button";
import { BaseBox, FatText } from "../components/shared";
import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";

export const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      unreadTotal
      users {
        id
        username
        avatar
        isMe
      }
    }
  }
`;


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

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
    lastName
    username
    bio
    avatar
    isMe
    }
  }
`;

const Main = styled.div`
 width: 100%;
  min-height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Rooms = styled.div`
width: 100%;
  min-height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Header = styled(BaseBox)`
max-width: 580px;
  display: flex;
  flex-direction:row;
  justify-content: space-around;
  padding: 30px;

`;


const Column = styled.div``;

const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;

const List = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
`;

const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;


const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  padding: 8px 10px;
  margin: 0;

  cursor: pointer;
`;


const Grid = styled.div`
position:relative;
  max-width: 580px;
  min-height: 360px;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
  @media only screen and (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0px;
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0px;
  }
  border-radius: 10px;

box-shadow: 0 6px 25px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 1.0px );
-webkit-backdrop-filter: blur( 1.0px );
`;
const RoomBtn = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
  background-color: white;
  width: 150px;
  height:150px;
  border-radius: 50%;
`;

const Icons = styled.div`
  border-radius: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.div`
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const Home = () => {
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_ROOMS);
  const { data: userData } = useUser();
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState([]);
  useEffect(() => {

    if (userData !== undefined) {
      setUsername(userData.me.username)
    }

  }, [userData])
  useEffect(() => {
    if (username !== "") {
      const profile = client.query({
        query: SEE_PROFILE_QUERY, variables: {
          username
        }
      }).then((a) => setProfileData(a.data));
    }
  }, [username])
  // const { data: profileData } = useQuery(SEE_PROFILE_QUERY, {
  //   variables: {
  //     username,
  //   },
  // });

  return (
    <Main>
      <Header>
        { profileData?.seeProfile ? (
          <>
            <Column>
              <Row>
                <Avatar url={ profileData?.seeProfile?.avatar } lg />
              </Row>

              <Row>
                <Link to={ `/edit/${username}/` }>
                  <ProfileBtn>Edit Profile</ProfileBtn>
                </Link>
                {/* { data?.seeProfile ? getButton(data.seeProfile) : null } */ }
              </Row>
            </Column>

            <Column>


              <Row>
                <Username>{ profileData?.seeProfile?.username }</Username>
                {/* { data?.seeProfile ? getButton(data.seeProfile) : null } */ }
              </Row>
              {/* <Row>
                <List>
                  <Item>
                    <span>
                      <Value>{ data?.seeProfile?.totalFollowers }</Value>{ " " }
                        followers
                      </span>
                  </Item>
                  <Item>
                    <span>
                      <Value>{ data?.seeProfile?.totalFollowing }</Value>{ " " }
                        following
                      </span>
                  </Item>
                </List>
              </Row> */}
              <Row>

                <Name>
                  { profileData?.seeProfile?.firstName } { profileData?.seeProfile?.lastName }
                </Name>
              </Row>
              <Row>{ profileData?.seeProfile?.bio }</Row>
            </Column>
          </>
        ) : (
          <PageTitle title={ "User not Found" } />
        ) }
      </Header>
      <Grid>
        { loading ? (
          <LoadingSpinner />
        ) : (
          data?.seeRooms?.map((room) => {
            return room?.users?.map((user) => {
              if (!user.isMe) {
                console.log(user.avatar)
                return (
                  <Link to={ `/room/${room?.id}` }>
                    <RoomBtn key={ user?.id } bg={ user.avatar !== null ? user.avatar : "https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png" } >
                      <Icons>
                        <Icon>
                          Talk with
                </Icon>
                        <Icon>
                          { user?.username }
                        </Icon>
                      </Icons>
                    </RoomBtn>

                  </Link>
                );
              }
            });
          })
        ) }
      </Grid>
    </Main>
  );
};

export default Home;
