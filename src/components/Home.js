import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Home Page</h1>
      <h3>Hello Jack!</h3>
      <Link to="/user">To user page</Link>
      <button onClick={() => console.log("click me")}>click me</button>
    </>
  );
};

export default Home;