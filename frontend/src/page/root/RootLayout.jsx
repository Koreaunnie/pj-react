import { Box, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/root/Navbar.jsx";

export function RootLayout() {
  return (
    <Stack>
      <Box>
        <Navbar />
      </Box>

      <Box mx={"auto"} w={{ base: "90%" }}>
        <Outlet />
      </Box>
    </Stack>
  );
}
