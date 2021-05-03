import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import Button from "../components/auth/Button";
import Input from "../components/auth/Input";
import useUser from "../hooks/useUser";
import styled from "styled-components";
import FormBox from "../components/auth/FormBox";
import AuthLayout from "../components/auth/AuthLayout";

import { useState } from "react";
import { logUserOut } from "../apollo";
import Avatar from "../components/Avatar";

const ME_QUERY = gql`
  query me {
    me {
      email
      isMe
      firstName
      lastName
      username
      bio
      avatar
      isMe
    }
  }
`;
const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $avatar: Upload
    $bio: String
    $email: String
    $firstName: String
    $lastName: String
    $password: String
    $username: String
  ) {
    editProfile(
      avatar: $avatar
      bio: $bio
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      username: $username
    ) {
      ok
      error
    }
  }
`;

const InputBox = styled(Input)`
  width: 180px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0;
  margin-bottom: 10px;
`;

const EditProfileContainer = styled(AuthLayout)`
  position: absolute;
  top: -100px;
`;

const Label = styled.label``;

const SubmitButton = styled(Button)`
  margin-top: 4rem;
  width: 40%;
`;
const LogOuButton = styled(Button)`
  margin-top: 1rem;
  width: 40%;
  background: tomato;
  &:hover {
    background: red;
  }
`;
const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 30px;
`;
const EditAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border-style: solid;
  border-color: #ffffff;
  box-shadow: 0 0 8px 3px #b8b8b8;
  position: relative;
  margin-bottom: 30px;
  label div img {
    height: 100px;
    max-width: 100px;
    border-radius: 50%;
  }
  label span {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    font-size: 15px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const EditProfile = () => {
  const history = useHistory();
  const { data: userData } = useUser();
  const { username } = useParams();
  const { data, loading } = useQuery(ME_QUERY);

  const [avatarUrl, setAvatarUrl] = useState("");
  const { register, handleSubmit, getValues } = useForm({
    mode: "onChange",
  });
  const onCompleted = (data) => {
    console.log(data);
    const {
      editProfile: { ok, error },
    } = data;
    if (!ok) {
      return;
    } else {
      const { username } = getValues();
      history.push(`/edit/${username}`);
    }
  };

  const onSubmitValid = async (data) => {
    if (editProfileLoading) {
      return;
    }
    const { username, firstName, lastName, email, bio, avatar } = getValues();

    await editProfile({
      variables: {
        username,
        firstName,
        lastName,
        email,
        bio,
        avatar: avatar[0],
      },
    });
  };

  const [editProfile, { loading: editProfileLoading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      onCompleted,
    }
  );

  const editAvatar = async (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      console.log(result);
      setAvatarUrl(result);
    };
    reader.readAsDataURL(theFile);
    console.log(theFile);
  };
  return (
    <>
      {!loading && data?.me?.isMe ? (
        <EditProfileContainer>
          <Form onSubmit={ handleSubmit(onSubmitValid) }>
            <Title>Edit Profile</Title>
            <FormBox>
              <EditAvatar>
                <label for='attach-file'>
                  <div>
                    { data?.me?.avatar ? (
                      <img
                        src={ avatarUrl !== "" ? avatarUrl : data?.me?.avatar }
                        alt=''
                      />
                    ) : (
                      <img
                        src={
                          avatarUrl !== ""
                            ? avatarUrl
                            : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                        }
                        alt=''
                      />
                    ) }
                  </div>
                  <span>upload</span>
                </label>
                <FileInput
                  ref={ register({}) }
                  name='avatar'
                  id='attach-file'
                  type='file'
                  accept='image/*'
                  onChange={ editAvatar }
                />
              </EditAvatar>
              <div>
                <Label for='username'>username : </Label>
                <InputBox
                  ref={ register({}) }
                  type='text'
                  name='username'
                  placeholder='Username'
                  defaultValue={ data?.me?.username ? data?.me?.username : "" }
                />
              </div>
              <div>
                <Label for='firstName'>firstName : </Label>
                <InputBox
                  ref={ register({}) }
                  type='text'
                  name='firstName'
                  placeholder='firstName'
                  defaultValue={ data?.me?.firstName ? data?.me?.firstName : "" }
                />
              </div>
              <div>
                <Label for='lastName'>lastName : </Label>
                <InputBox
                  ref={ register({}) }
                  type='text'
                  name='lastName'
                  placeholder='lastName'
                  defaultValue={ data?.me?.lastName ? data?.me?.lastName : "" }
                />
              </div>
            </FormBox>
            <FormBox>
              <div>
                <Label for='username'>email : </Label>
                <InputBox
                  ref={ register({}) }
                  type='text'
                  name='email'
                  placeholder='email'
                  defaultValue={ data?.me?.email ? data?.me?.email : "" }
                />
              </div>
              <div>
                <Label for='bio'>bio : </Label>
                <InputBox
                  ref={ register({}) }
                  type='text'
                  name='bio'
                  placeholder='bio'
                  defaultValue={ data?.me?.bio ? data?.me?.bio : "" }
                />
              </div>
            </FormBox>

            <SubmitButton
              type='submit'
              value={ loading ? "Loading..." : "Submit" }
            />
            <LogOuButton type='submit' value='SignOut' onClick={ logUserOut } />
          </Form>
        </EditProfileContainer>
      ) : (
        ""
      ) }{ " " }
    </>
  );
};

export default EditProfile;
