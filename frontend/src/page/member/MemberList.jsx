import { Box, Spinner, Table } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function MemberList(props) {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    // 회원 목록 요청
    axios.get("/api/member/list").then((res) => setMemberList(res.data));
  }, []);

  if (!memberList || memberList.length === 0) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>회원 목록</h3>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.columnHeader>ID</Table.columnHeader>
            <Table.columnHeader>가입일시</Table.columnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {memberList.map((member) => (
            <Table.Row key={member.id}>
              <Table.Cell>{member.id}</Table.Cell>
              <Table.Cell>{member.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
