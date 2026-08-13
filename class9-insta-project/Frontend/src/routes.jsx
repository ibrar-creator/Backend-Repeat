import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost";
import ReelsPage from "./features/post/pages/ReelsPage";
import Search from "./features/post/pages/Search";
import Messages from "./features/post/pages/Messages";
import Profile from "./features/post/pages/Profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Feed />, // 👈 ensure defined
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/create",
    element: <CreatePost />,
  },
  {
    path: "/reels",
    element: <ReelsPage />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/profile",
    element: <Profile />, // own profile (uses logged-in user from useAuth)
  },
  {
    path: "/profile/:username",
    element: <Profile />, // someone else's profile
  },
]);