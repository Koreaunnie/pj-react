import { Box, Card, Flex, Heading, HStack, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.jsx";

function DeleteButton({ onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette={"red"} variant={"surface"}>
          삭제
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <p>댓글을 삭제하시겠습니까?</p>
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger>
            <Button>취소</Button>
          </DialogActionTrigger>
          <Button colorPalette={"red"} onClick={onClick}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

function EditButton({ comment, onEditClick }) {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState(comment.comment);

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant={"surface"}>수정</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger>
            <Button>취소</Button>
          </DialogActionTrigger>
          <Button
            colorPalette={"blue"}
            onClick={() => {
              setOpen(false);
              onEditClick(comment.id, newComment);
            }}
          >
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export function CommentItem({ comment, onDeleteClick, onEditClick }) {
  const { hasAccess } = useContext(AuthenticationContext);

  return (
    <Card.Root size="sm" mb={5}>
      <Card.Header>
        <Flex justify={"space-between"}>
          <Heading textStyle="sm">{comment.memberId}</Heading>
          <Heading textStyle="sm">{comment.inserted}</Heading>
        </Flex>
      </Card.Header>

      <Card.Body>
        <Box css={{ whiteSpace: "pre" }} textStyle="sm">
          {comment.comment}
        </Box>
      </Card.Body>

      {hasAccess(comment.memberId) && (
        <Card.Footer css={{ justifyContent: "flex-end" }}>
          <HStack>
            <EditButton comment={comment} onEditClick={onEditClick} />
            <DeleteButton onClick={() => onDeleteClick(comment.id)} />
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
