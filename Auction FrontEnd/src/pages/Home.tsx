import { Link } from "react-router-dom";

export const Home = function () {
  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign up</Link>
    </>
  );
};
