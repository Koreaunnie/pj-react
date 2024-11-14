import {createBrowserRouter, Outlet, RouterProvider, useNavigate} from "react-router-dom";
import {Box, Flex, Stack} from "@chakra-ui/react";
import React from "react";

function Navbar() {
  const navigate = useNavigate();

  return <Flex gap={3}>
    <Box onClick={() => navigate("/")}>HOME</Box>
    <Box onClick={() => navigate("/add")}>작성</Box>
  </Flex>
}

function RootLayout() {
  return <Stack>
    <Box>
      <Navbar/>
    </Box>
    <Box>
      <Outlet/>
    </Box>
  </Stack>
}

function BoardAdd() {
  return <Box>
    <h3>게시물 작성</h3>
  </Box>
}

function BoardList() {
  return <Box>
    <h3>게시물 목록</h3>
  </Box>
}

const router = createBrowserRouter([{
  path: "/",
  element: <RootLayout/>,
  children: [
    {
      index: true,
      element: <BoardList/>
    },
    {
      path: "add",
      element: <BoardAdd/>
    }
  ]
}]);


function App() {
  return <RouterProvider router={router}/>
}

export default App
