import { Box } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, commentList }) {
  return (
    <Box>
      {commentList.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
}
