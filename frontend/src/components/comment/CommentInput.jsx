import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useContext(AuthenticationContext);

  function handleSaveClick() {
    console.log("보낼 데이터:", {
      boardId: boardId,
      comment,
    });

    axios
      .post("/api/comment/add", {
        boardId: boardId,
        comment,
      })
      .then()
      .catch()
      .finally();
  }

  return (
    <Box>
      <Group attached h={120} w={"100%"}>
        <Textarea
          h={120}
          value={comment}
          resize={"none"}
          disabled={!isAuthenticated}
          placeholder={isAuthenticated ? "" : "로그인 후 댓글을 남겨주세요."}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          h={118}
          variant={"surface"}
          disabled={!isAuthenticated}
          onClick={() => {
            setComment("");
            onSaveClick(comment);
          }}
        >
          댓글 쓰기
        </Button>
      </Group>
    </Box>
  );
}
