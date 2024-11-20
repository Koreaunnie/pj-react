package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {

    final BoardService service;

    // 게시물 작성
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(Board board,
                                                   @RequestParam(value = "files[]", required = false) MultipartFile[] files,
                                                   Authentication authentication) {

        if (service.validate(board)) {
            if (service.add(board, files, authentication)) {
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
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "st", defaultValue = "all") String searchType,
                                    @RequestParam(value = "sk", defaultValue = "") String keyword) {

        System.out.println(searchType);
        System.out.println(keyword);

        return service.list(page, searchType, keyword);
    }

    // 게시물 상세 보기
    @GetMapping("view/{id}")
    public Board view(@PathVariable int id) {
        return service.get(id);
    }

    // 게시물 삭제
    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(
            @PathVariable int id,
            Authentication authentication) {
        if (service.hasAccess(id, authentication)) {
            if (service.remove(id)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", id + "번 게시글이 삭제되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "게시글 삭제 중 문제가 발생하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403).body(Map.of("message", Map.of(
                    "type", "error",
                    "text", "삭제 권한이 없습니다.")));
        }
    }

    // 게시물 수정
    @PutMapping("update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> update(
            @RequestBody Board board,
            Authentication authentication) {
        if (service.hasAccess(board.getId(), authentication)) {


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
        } else {
            return ResponseEntity.status(403).body(Map.of("message", Map.of(
                    "type", "error",
                    "text", "수정 권한이 없습니다.")));
        }
    }
}
