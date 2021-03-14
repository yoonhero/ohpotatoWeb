import { gql, useQuery } from "@apollo/client";

import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";

import { LoadingSpinner } from "../components/LoadingSpinner";
import PageTitle from "../components/PageTitle";

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

const Home = () => {
  const { data, loading } = useQuery(SEE_ROOMS);
  console.log(data, loading);
  return (
    <div>
      <PageTitle title='' />
      {loading ? (
        <LoadingSpinner />
      ) : (
        data?.seeRooms?.map((room) => {
          return room?.users?.map((user) => {
            if (!user.isMe) {
              return (
                <Link to={`/room/${room?.id}`}>
                  <div key={room?.id}>
                    <Avatar url={user?.avatar} />
                    <span>Talk with {user?.username}</span>
                  </div>
                </Link>
              );
            }
          });
        })
      )}
    </div>
  );
};

export default Home;
