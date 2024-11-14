import {Box} from "@chakra-ui/react";
import {useEffect} from "react";
import axios from "axios";

export function BoardList() {
  useEffect(() => {
    axios.get("/api/board/list");
  }, []);

  return (
    <Box>
      <h3>게시물 목록</h3>
      {/* 게시물들을 테이블로 */}
    </Box>
  );
}