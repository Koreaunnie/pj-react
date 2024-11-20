import { Box, Flex, HStack } from "@chakra-ui/react";
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
        <Button colorPalette={"red"}>삭제</Button>
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

export function CommentItem({ comment, onDeleteClick }) {
  const { hasAccess } = useContext(AuthenticationContext);

  return (
    <HStack borderBottom={"1px solid black"} m={5}>
      <Box flex={1}>
        <Flex justify={"space-between"}>
          <h3>{comment.memberId}</h3>
          <h4>{comment.inserted}</h4>
        </Flex>
        <p>{comment.comment}</p>
      </Box>

      {hasAccess(comment.memberId) && (
        <Box>
          <Button>수정</Button>

          <DeleteButton onClick={() => onDeleteClick(comment.id)} />
        </Box>
      )}
    </HStack>
  );
}
