import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";
import styled from "styled-components"
import Button from "../components/auth/Button";
import { BaseBox, FatText } from "../components/shared";
import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';
import { CircleSlider } from "react-circle-slider"


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: "none",
    borderRadius: "20px"
  }
}

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

const SEE_USERS = gql`
  query seeFriends($username: String!) {
    seeFriends(username: $username, page:1) {
      ok
      followers {
        username
        avatar
        id
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

const Actions = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`

const Action = styled.div`

`

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
    gap: 50px;
  }
  @media only screen and (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
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


const UsersContainer = styled.div`
display:flex;
  padding: 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const UserContainer = styled.div`
display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  
`;

const Users = styled.div`
  min-width: 60vw;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  p{
    font-size: 16px;
    font-weight: 400;
    margin-left: 20px;
  }
`

const PlusRoomBtn = styled.button`
  border: none;
  background: inherit;
  svg{
    font-size: 20px;
    color: #000;
  }
`

const ControlEmotion = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right:0;
  top: 0;
  svg{
    position:absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    z-index: 20;
  }
  img{
    position:absolute;
    top: 10px;
    right: 10px;
    width: 80px;

  }
`

const Home = () => {
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_ROOMS);
  const { data: userData } = useUser();
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState([]);
  const history = useHistory()
  const [value, setValue] = useState(0)
  const [emotion, setEmotion] = useState("./happ.png")
  const { data: uesrsData, refetch } = useQuery(SEE_USERS, {
    variables: {
      username,
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    setValue(localStorage.getItem("EMOTION"))
  }, [])
  useEffect(() => {

    if (userData !== undefined) {
      setUsername(userData.me.username)
    }

  }, [userData])
  useEffect(() => {
    if (username !== "") {
      client.query({
        query: SEE_PROFILE_QUERY, variables: {
          username
        }
      }).then((a) => setProfileData(a.data));
    }
  }, [username])
  useEffect(() => {
    localStorage.setItem("EMOTION", value)
    if (value < 25) {
      setEmotion("./happ.png")

    } else if (value < 50) {
      setEmotion("./sadd.png")
    } else if (value < 75) {
      setEmotion("./dilike.png")
    } else {
      setEmotion("./angy.png")
    }
  }, [value])
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  // const { data: profileData } = useQuery(SEE_PROFILE_QUERY, {
  //   variables: {
  //     username,
  //   },
  // });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const createRoom = (user) => {
    if (data === undefined) {
      return;
    }
    const { username: userName } = user;
    let existing = [];
    let existingRoom = [];
    data?.seeRooms.find((room) => {
      room.users.find((user) => {
        if (user.username === userName) {
          existing = user;
        }
      });
      if (existing.length !== 0) {
        existingRoom = room;
      }
      existing = []
    });
    if (existingRoom.length !== 0) {
      history.push(`/room/${existingRoom.id}`)
      // navigation.navigate("Room", {
      //   id: existingRoom.id,
      //   talkingTo: existing,
      // });
    } else {
      history.push(`/createRoom/`, {
        talkingto: user,
      })
      // navigation.navigate("FirstMessage", {
      //   user: user,
      // });
    }
  };
  const handleEmotionChange = (value) => {
    setValue(value)
  }
  return (
    <Main>
      <Header>
        { profileData?.seeProfile ? (
          <>
            <ControlEmotion>
              <CircleSlider value={ value } onChange={ handleEmotionChange } circleColor="#fff" progressColor="#c2e9fb" knobColor=" #a1c4fd" />
              <img src={ emotion } />
            </ControlEmotion>

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
        <Actions>
          <Action onClick={ openModal }>
            <FontAwesomeIcon icon={ faCommentDots } size="large" />
          </Action>
          <Modal
            isOpen={ modalIsOpen }
            onRequestClose={ closeModal }
            style={ customStyles }
            contentLabel="Plus Room"
          >

            <Users>
              { uesrsData?.seeFriends?.followers?.map(user => {
                return (
                  <UsersContainer>
                    <UserContainer onClick={ () => createRoom(user) }>
                      <Avatar url={ user.avatar } />
                      <p>{ user.username }</p>
                    </UserContainer>
                    <PlusRoomBtn onClick={ () => createRoom(user) }>
                      <FontAwesomeIcon icon={ faPlus } size={ 24 } color='white' />
                    </PlusRoomBtn>
                  </UsersContainer>
                )
              }) }

            </Users>

          </Modal>

        </Actions>
        { loading ? (
          <LoadingSpinner />
        ) : (
          data?.seeRooms?.map((room) => {
            return room?.users?.map((user) => {
              if (!user.isMe) {
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
