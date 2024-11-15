import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");

  function handleSaveClick() {
    axios
      .post("/api/member/signup", { id, password, description })
      .then((res) => {
        console.log("잘됨");
      })
      .catch((e) => {
        console.log("안됨");
      })
      .finally(() => {
        console.log("성공이든 실패든 무조건 실행");
      });
  }

  return (
    <Box>
      <h3>회원가입</h3>
      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input value={id} onChange={(e) => setId(e.target.value)} />
        </Field>

        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field label={"자기소개"}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Box>
          <Button onClick={handleSaveClick}>가입</Button>
        </Box>
      </Stack>
    </Box>
  );
}
