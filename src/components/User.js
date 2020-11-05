import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUsers } from "../actions/UserAction";
import '@babel/polyfill';

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <>
      <h1>User Page</h1>
      <Link to="/">To home page</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first_name} </li>
        ))}
      </ul>
    </>
  );
};

User.getInitialData = async (store) => {
  return store.dispatch(fetchUsers());
};

export default User;