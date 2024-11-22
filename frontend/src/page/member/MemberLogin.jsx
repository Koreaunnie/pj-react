import { Box, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import React, { useContext, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  function handleLoginClick() {
    axios
      .post("/api/member/login", { id, password })
      .then((res) => res.data)
      .then((data) => {
        // 로그인 성공 시
        //토스트 띄우고
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        // 홈("/")으로 이동
        navigate("/");
        // login
        authentication.login(data.token);
      })
      .catch((e) => {
        // 로그인 실패 시
        const message = e.response.data.message;
        // 토스트 띄우기
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally();
  }

  return (
    <Box mx={"auto"} w={{ md: "400px" }}>
      <MyHeading>로그인</MyHeading>

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

        <Box mt={3} mx={"auto"}>
          <Button onClick={handleLoginClick}>로그인</Button>
        </Box>
      </Stack>
    </Box>
  );
}
