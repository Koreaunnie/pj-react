import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BoardAdd } from "./page/board/BoardAdd.jsx";
import { RootLayout } from "./page/root/RootLayout.jsx";
import { BoardList } from "./page/board/BoardList.jsx";
import { BoardView } from "./page/board/BoardView.jsx";
import { BoardEdit } from "./page/board/BoardEdit.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import * as PropTypes from "prop-types";
import { MemberList } from "./page/member/MemberList.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx";
import React from "react";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import axios from "axios";

MemberList.propTypes = { children: PropTypes.node };

// axios 인터셉터 설정
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// react router 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BoardList />,
      },
      {
        path: "add",
        element: <BoardAdd />,
      },
      {
        path: "view/:id",
        element: <BoardView />,
      },
      {
        path: "edit/:id",
        element: <BoardEdit />,
      },
      {
        path: "member/signup",
        element: <MemberSignup />,
      },
      {
        path: "member/list",
        element: <MemberList />,
      },
      {
        path: "member/:id",
        element: <MemberInfo />,
      },
      {
        path: "member/edit/:id",
        element: <MemberEdit />,
      },
      {
        path: "member/login",
        element: <MemberLogin />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
