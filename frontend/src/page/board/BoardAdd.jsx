import {useState} from "react";
import axios from "axios";
import {Box, Input, Stack, Textarea} from "@chakra-ui/react";
import {Field} from "../../components/ui/field.jsx";
import {Button} from "../../components/ui/button.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const handleSaveClick = () => {
    axios.post("/api/board/add", {
      title, // title: title 에서 축약됨
      content,
      writer,
    });
  };
  return (
    <Box>
      <h3>게시물 작성</h3>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>
        <Field label={"작성자"}>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)}/>
        </Field>
        <Box>
          <Button onClick={handleSaveClick}>저장</Button>
        </Box>
      </Stack>
    </Box>
  );
}