import { Badge, Box, HStack, Input, Table } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { Button } from "../../components/ui/button.jsx";
import { FaCommentDots } from "react-icons/fa";
import { FaImages } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/api/board/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((data) => {
        setBoardList(data.list);
        setCount(data.count);
      });

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("st")) {
      nextSearch.type = searchParams.get("st");
    } else {
      nextSearch.type = "all";
    }

    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

  // page 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handleRowClick(id) {
    navigate(`/view/${id}`);
  }

  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  // 카테고리 검색
  function handleSearchClick(e) {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      // 검색
      nextSearchParam.set("st", search.type);
      nextSearchParam.set("sk", search.keyword);
      nextSearchParam.set("page", 1);
    } else {
      // 검색 안함
      nextSearchParam.delete("st");
      nextSearchParam.delete("sk");
    }
    setSearchParams(nextSearchParam);
  }

  return (
    <Box>
      <h3>게시물 목록</h3>
      {boardList.length > 0 ? (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>번호</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>
                <GoHeartFill />
              </Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>작성일</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {boardList.map((board) => (
              <Table.Row
                key={board.id}
                onClick={() => handleRowClick(board.id)}
              >
                <Table.Cell>{board.id}</Table.Cell>
                <Table.Cell>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge variant={"subtle"}>
                      <FaCommentDots />
                      {board.countComment}
                    </Badge>
                  )}
                  {board.countFile > 0 && (
                    <Badge variant={"subtle"}>
                      <FaImages />
                      {board.countFile}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {board.countLike > 0 ? board.countLike : ""}
                </Table.Cell>
                <Table.Cell>{board.writer}</Table.Cell>
                <Table.Cell>{board.inserted}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}

      <HStack>
        <Box>
          <select
            value={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">본문</option>
          </select>
        </Box>
        <Input
          value={search.keyword}
          onChange={(e) =>
            setSearch({ ...search, keyword: e.target.value.trim() })
          }
        />
        <Button onClick={handleSearchClick}>검색</Button>
      </HStack>

      <PaginationRoot
        onPageChange={handlePageChange}
        count={count}
        pageSize={10}
        page={page}
        variant="solid"
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
