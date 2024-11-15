import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>HOME</Box>
      <Box onClick={() => navigate("/add")}>작성</Box>
      <Box onClick={() => navigate("/member/signup")}>회원가입</Box>
    </Flex>
  );
}
