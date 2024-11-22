import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { ToggleTip } from "../../components/ui/toggle-tip.jsx";

function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image key={file.name} src={file.src} border={"1px solid #000"} m={3} />
      ))}
    </Box>
  );
}

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [likeTooltipOpen, setLikeTooltipOpen] = useState(false);
  const navigate = useNavigate();
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/board/like/${id}`)
      .then((res) => res.data)
      .then((data) => setLike(data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/board/delete/${board.id}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  const handleLikeClick = () => {
    if (isAuthenticated) {
      axios
        .post("/api/board/like", {
          id: board.id,
        })
        .then((res) => res.data)
        .then((data) => setLike(data))
        .catch()
        .finally();
    } else {
      // tooltip 보여주기
      setLikeTooltipOpen(!likeTooltipOpen);
    }
  };

  return (
    <Box mx={"auto"} w={{ md: "1000px" }}>
      <Flex>
        <Heading mx={"auto"} size={{ base: "xl", md: "3xl" }} mt={5} mb={10}>
          {board.title}
        </Heading>

        <HStack mb={10}>
          <Box onClick={handleLikeClick}>
            <ToggleTip
              open={likeTooltipOpen}
              content={"로그인 후 좋아요를 클릭해주세요."}
            >
              <Heading>
                {like.like || <GoHeart />}
                {like.like && <GoHeartFill />}
              </Heading>
            </ToggleTip>
          </Box>

          <Box>
            <Heading>{like.count}</Heading>
          </Box>
        </HStack>
      </Flex>

      <Stack gap={5}>
        <Box borderTop={"1px solid #e4e4e7"} borderBottom={"1px solid #e4e4e7"}>
          <Flex as="thead" borderBottom={"1px solid #e4e4e7"}>
            <Flex as="tr" w="100%" px={5} py={2} backgroundColor={"#f4f4f5"}>
              <Box as="th" width="50%" textAlign="left">
                {board.writer}
              </Box>
              <Box as="th" width="50%" textAlign="right">
                {board.inserted}
              </Box>
            </Flex>
          </Flex>

          <Box as="tbody">
            <Flex as="tr" height="300px" p={5}>
              <Box as="td" colSpan={2}>
                {board.content}
              </Box>
            </Flex>

            <ImageFileView files={board.fileList} />
          </Box>
        </Box>

        {hasAccess(board.writer) && (
          <Box mx={"auto"}>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorPalette={"red"} mx={1}>
                  삭제
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.id}번 게시물을 삭제하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button>취소</Button>
                  </DialogActionTrigger>
                  <Button colorPalette={"red"} onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>

            <Button mx={1} onClick={() => navigate(`/edit/${board.id}`)}>
              수정
            </Button>
          </Box>
        )}
      </Stack>

      <CommentContainer boardId={board.id} />
    </Box>
  );
}
