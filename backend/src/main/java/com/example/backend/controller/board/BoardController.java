package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {

    final BoardService service;

    // 게시물 작성
    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Board board) {

        if (service.validate(board)) {
            if (service.add(board)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                        "text", board.getId() + "번 게시물이 등록되었습니다."),
                                "data", board));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "게시물 등록에 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", Map.of("type", "warning",
                            "text", "제목과 본문은 비어있을 수 없습니다.")));
        }
    }

    // 게시물 목록
    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        return service.list(page);
    }

    // 게시물 상세 보기
    @GetMapping("view/{id}")
    public Board view(@PathVariable int id) {
        return service.get(id);
    }

    // 게시물 삭제
    @DeleteMapping("delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        if (service.remove(id)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", id + "번 게시글이 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "게시글 삭제 중 문제가 발생하였습니다.")));
        }
    }

    // 게시물 수정
    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Board board) {
        if (service.validate(board)) {
            if (service.update(board)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", board.getId() + "번 게시글이 수정되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "게시글이 수정 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", Map.of("type", "warning",
                            "text", "제목과 본문은 비어있을 수 없습니다.")));
        }
    }
}
