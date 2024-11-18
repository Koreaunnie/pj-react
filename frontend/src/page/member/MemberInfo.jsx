import { Box, Field, Input, Spinner, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 회원 정보 얻기
    axios.get(`/api/member/${id}`).then((res) => setMember(res.data));
  }, []);

  function handleDeleteClick() {
    axios
      .delete("/api/member/remove", {
        data: { id, password },
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/member/signup");
      })
      .catch((e) => {
        const message = res.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
        setPassword("");
      });
  }

  if (!member) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 정보</h3>

      <Stack gap={5}>
        <Field label={"아이디"}>
          <Input value={member.id} readOnly />
        </Field>

        <Field label={"암호"}>
          <Input value={member.password} readOnly />
        </Field>

        <Field label={"자기소개"}>
          <Input value={member.description} readOnly />
        </Field>

        <Field label={"가입일시"}>
          <Input type={"datetime-local"} value={member.inserted} readOnly />
        </Field>

        <Button colorPalette={"red"}>회원 탈퇴</Button>

        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DialogTrigger asChild>
            <Button colorPalette={"red"}>탈퇴</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>탈퇴 확인</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Stack>
                <p>탈퇴하시겠습니까?</p>
                <Field label={"암호"}>
                  <Input
                    placeholer={"암호를 입력해주세요."}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
              </Stack>
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger>
                <Button>취소</Button>
              </DialogActionTrigger>
              <Button colorPalette={"red"} onClick={handleDeleteClick}>
                탈퇴
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Stack>
    </Box>
  );
}
