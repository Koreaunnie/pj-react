import { useNavigate, useParams } from "react-router-dom";
import { Box, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";
import {AuthenticationContext} from "../../components/context/AuthenticationProvider.jsx";

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // 버튼 클릭이 여러번 되는 걸 막기 위해

  const { hasAccess } = useContext(AuthenticationContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);

  const handleSaveClick = () => {
    setProgress(true);

    axios
      .put("/api/board/update", board)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/view/${board.id}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProgress(false);
        setDialogOpen(false);
      });
  };

  // board가 null일 때 (첫 렌더)
  if (board === null) {
    return <Spinner />;
  }

  // 제목이나 본문이 비어있는지 확인
  const disabled = !(
    board.title.trim().length > 0 && board.content.trim().length > 0
  );

  return (
    (<Box>
      <h3>{id}번 게시물 수정</h3>

      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </Field>

        { hasAccess(board.writer) && (
        <Box>
          <DialogRoot
            open={dialogOpen}
            onOpenChange={(e) => setDialogOpen(e.open)}
          >
            <DialogTrigger asChild>
              <Button disabled={disabled}>저장</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>수정 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>{board.id}번 게시물을 수정하시겠습니까?</p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button>취소</Button>
                </DialogActionTrigger>
                <Button
                  loading={progress}
                  colorPalette={"blue"}
                  onClick={handleSaveClick}
                >
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
        )}
      </Stack>
    </Box>
  );
}
