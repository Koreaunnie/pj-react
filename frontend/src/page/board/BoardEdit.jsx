import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  FormatNumber,
  HStack,
  Icon,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Switch } from "../../components/ui/switch.jsx";
import { MyHeading } from "../../components/root/MyHeading.jsx";
import { CiFileOn } from "react-icons/ci";

function ImageView({ files, onRemoveSwitchClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name}>
          <Switch
            colorPalette={"red"}
            onCheckedChange={(e) => onRemoveSwitchClick(e.checked, file.name)}
          />
          <Image border={"1px solid black"} m={5} src={file.src} />
        </HStack>
      ))}
    </Box>
  );
}

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // 버튼 클릭이 여러번 되는 걸 막기 위해
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  const { hasAccess } = useContext(AuthenticationContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);

  const handleRemoveSwitchClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };

  const handleSaveClick = () => {
    setProgress(true);

    axios
      .putForm("/api/board/update", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFiles,
        uploadFiles,
      })
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

  // 게시물 수정 시 파일 업로드
  function setUploadFileList(files) {}

  return (
    <Box>
      <MyHeading>{id}번 게시물 수정</MyHeading>

      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Field>

        <Field label={"본문"}>
          <Textarea
            h={250}
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </Field>

        <ImageView
          files={board.fileList}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />

        <Box>
          <Box>
            <input
              onChange={(e) => setUploadFiles(e.target.files)}
              type={"file"}
              multiple
              accept={"image/*"}
            />
          </Box>
          <Box>
            {Array.from(uploadFiles).map((file) => (
              <Card.Root size={"sm"} mb={2}>
                <Card.Body>
                  <HStack>
                    <Text
                      css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
                      me={"auto"}
                      truncate
                    >
                      <Icon mr={2} mt={-1}>
                        <CiFileOn />
                      </Icon>

                      {file.name}
                    </Text>
                    <Text>
                      <FormatNumber
                        value={file.size}
                        notation={"compact"}
                        compactDisplay="short"
                      ></FormatNumber>
                    </Text>
                  </HStack>
                </Card.Body>
              </Card.Root>
            ))}
          </Box>
        </Box>

        {hasAccess(board.writer) && (
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
