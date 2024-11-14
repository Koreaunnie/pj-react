import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {BoardAdd} from "./page/board/BoardAdd.jsx";
import {RootLayout} from "./page/root/RootLayout.jsx";
import {BoardList} from "./page/board/BoardList.jsx";
import {BoardView} from "./page/board/BoardView.jsx";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
