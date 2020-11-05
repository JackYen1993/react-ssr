import Home from "./components/Home";
import User from "./components/User";

const Routes = [
  {
    exact: true,
    path: "/",
    component: Home
  },
  {
    path: "/user",
    component: User
  }
];

export default Routes;