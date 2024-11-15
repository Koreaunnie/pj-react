import { Box, HStack, Table } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/api/board/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((data) => setBoardList(data));

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  // page 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handleRowClick(id) {
    navigate(`/view/${id}`);
  }

  function handlePageChange(e) {
    console.log(e.page);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
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
          {boardList.map((board) => (
            <Table.Row key={board.id} onClick={() => handleRowClick(board.id)}>
              <Table.Cell>{board.id}</Table.Cell>
              <Table.Cell>{board.title}</Table.Cell>
              <Table.Cell>{board.writer}</Table.Cell>
              <Table.Cell>{board.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <PaginationRoot
        onPageChange={handlePageChange}
        count={1500}
        pageSize={10}
        page={page}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Box>
  );
}
