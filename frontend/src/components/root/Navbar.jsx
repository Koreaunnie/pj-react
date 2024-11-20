import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();

  // step 2 : context 사용하기
  const { id, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>HOME</Box>

      {isAuthenticated && <Box onClick={() => navigate("/add")}>작성</Box>}

      {isAuthenticated || (
        <Box onClick={() => navigate("/member/signup")}>회원가입</Box>
      )}

      {isAdmin && <Box onClick={() => navigate("/member/list")}>회원목록</Box>}

      {isAuthenticated || (
        <Box onClick={() => navigate("/member/login")}>로그인</Box>
      )}

      {isAuthenticated && (
        <Box
          onClick={() => {
            logout();
            navigate("/member/login");
          }}
        >
          로그아웃
        </Box>
      )}

      <Box onClick={() => navigate(`/member/${id}`)}>{id}</Box>
    </Flex>
  );
}
