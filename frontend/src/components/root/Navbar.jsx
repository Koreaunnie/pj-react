import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";

export function Navbar() {
  const navigate = useNavigate();

  // TODO : 임시 - 삭제할 예정
  const token = localStorage.getItem("token");
  let name;
  if (token) {
    const decoded = jwtDecode(token);
    name = decoded.sub;
  }

  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>HOME</Box>
      <Box onClick={() => navigate("/add")}>작성</Box>
      <Box onClick={() => navigate("/member/signup")}>회원가입</Box>
      <Box onClick={() => navigate("/member/list")}>회원목록</Box>
      <Box onClick={() => navigate("/member/login")}>로그인</Box>
      <Box
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/member/login");
        }}
      >
        로그아웃
      </Box>
      <Box>{name}님이 로그인 하였습니다.</Box>
    </Flex>
  );
}
