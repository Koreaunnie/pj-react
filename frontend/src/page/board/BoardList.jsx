import {Box, Table} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/board/list")
      .then(res => res.data)
      .then(data => setBoardList(data));
  }, []);

  function handleRowClick(id) {
     navigate(`/view/${id}`);
  }

  return (
    <Box>
      <h3>게시물 목록</h3>

      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>번호</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>작성자</Table.ColumnHeader>
            <Table.ColumnHeader>작성일</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {boardList.map(board =>
            <Table.Row key={board.id} onClick={() => handleRowClick(board.id)}>
              <Table.Cell>{board.id}</Table.Cell>
              <Table.Cell>{board.title}</Table.Cell>
              <Table.Cell>{board.writer}</Table.Cell>
              <Table.Cell>{board.inserted}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>


    </Box>
  );
}