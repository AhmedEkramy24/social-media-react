import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import AddPost from "./Components/AddPost/AddPost";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import SinglePost from "./Components/SinglePost/SinglePost";
import Settings from "./Components/Settings/Settings";
import { Toaster } from "react-hot-toast";
import UserContextProvider from "./Context/UserContext";
import Protected from "./Components/Protected/Protected";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChangePass from "./Components/ChangePass/ChangePass";
import ChangePhoto from "./Components/ChangePhoto/ChangePhoto";
import ProfileContextProvider from "./Context/ProfileContext";

const query = new QueryClient();

const router = createHashRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: "addpost",
        element: (
          <Protected>
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "singlepost/:id",
        element: (
          <Protected>
            <SinglePost />
          </Protected>
        ),
      },
      {
        path: "settings",
        element: (
          <Protected>
            <Settings />
          </Protected>
        ),
      },
      {
        path: "changepass",
        element: (
          <Protected>
            <ChangePass />
          </Protected>
        ),
      },
      {
        path: "changephoto",
        element: (
          <Protected>
            <ChangePhoto />
          </Protected>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={query}>
        <UserContextProvider>
          <ProfileContextProvider>
            <RouterProvider router={router}></RouterProvider>
            <Toaster />
          </ProfileContextProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
