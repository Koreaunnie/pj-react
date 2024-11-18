import { Box, Field, Input, Spinner, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // 회원 정보 얻기
    axios.get(`/api/member/${id}`).then((res) => setMember(res.data));
  }, []);

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
      </Stack>
    </Box>
  );
}
