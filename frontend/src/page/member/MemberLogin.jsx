import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import React, { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLoginClick() {
    axios.post("/api/member/login", { id, password }).then().catch().finally();
  }

  return (
    <Box>
      <h3>로그인</h3>
      <Stack>
        <Field label={"아이디"}>
          <Input value={id} onChange={(e) => setId(e.target.value)} />
        </Field>

        <Field label={"비밀번호"}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Box>
          <Button onClick={handleLoginClick}>로그인</Button>
        </Box>
      </Stack>
    </Box>
  );
}
