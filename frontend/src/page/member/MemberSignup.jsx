import { Box, Group, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [idCheck, setIdCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(true);
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        email: email.length === 0 ? null : email,
        description,
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });

        navigate("/");
      })
      .catch((e) => {
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        console.log("성공이든 실패든 무조건 실행");
      });
  }

  const handleIdCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          id: id,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });

        setIdCheck(data.available);
      });
  };

  const handleEmailCheckClick = () => {
    axios
      .get("/api/member/check", {
        params: {
          email,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });

        setEmailCheck(data.available);
      });
  };

  // 이메일 중복 확인 버튼 활성화 여부
  let emailCheckButtonDisabled = email.length === 0;

  // 가입 버튼 비활성화 여부
  let disabled = true;

  if (idCheck) {
    if (emailCheck) {
      if (password === passwordCheck) {
        disabled = false;
      }
    }
  }

  return (
    <Box>
      <h3>회원가입</h3>
      <Stack gap={5}>
        <Field label="아이디" helperText="아이디 중복확인을 해주세요." required>
          <Group attached>
            <Input
              placeholder="20자 이내"
              value={id}
              onChange={(e) => {
                setIdCheck(false);
                setId(e.target.value);
              }}
            />
            <Button onClick={handleIdCheckClick} variant={"outline"}>
              중복확인
            </Button>
          </Group>
        </Field>

        <Field label="비밀번호" required>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field label="비밀번호 확인" required>
          <Input
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </Field>

        <Field label="이메일">
          <Group>
            <Input
              placeholder="example@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // 이메일은 필수 입력이 아니어서
                // 입력하지 않을 경우 중복체크 하지 않아도 됨
                if (e.target.value.length > 0) {
                  setEmailCheck(false);
                } else {
                  setEmailCheck(true);
                }
              }}
            />
            <Button
              disabled={emailCheckButtonDisabled}
              onClick={handleEmailCheckClick}
              variant={"outline"}
            >
              중복확인
            </Button>
          </Group>
        </Field>

        <Field label="자기소개">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Box>
          <Button disabled={disabled} onClick={handleSaveClick}>
            가입
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
