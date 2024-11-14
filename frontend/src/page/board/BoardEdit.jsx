import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export function BoardEdit() {
  const { id } = useParams();
  return (
    <Box>
      <h3>{id}번 게시글 수정</h3>
    </Box>
  );
}
