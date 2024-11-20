package com.example.backend.controller.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    final CommentService service;

    // 댓글 작성
    @GetMapping("list/{boardId}")
    public List<Comment> list(@PathVariable Integer boardId) {
        return service.list(boardId);
    }

    // 댓글 목록 조회
    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Comment comment, Authentication auth) {
        service.add(comment, auth);
        return ResponseEntity.ok().body(Map.of("message", Map.of(
                "type", "success",
                "text", "댓글이 등록되었습니다.")));
    }

    // 댓글 삭제
    @DeleteMapping("remove/{id}")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable Integer id, Authentication auth) {
        if (service.hasAccess(id, auth)) {
            service.remove(id);
        }
    }

    // 댓글 수정
    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody Comment comment,
                                                    Authentication auth) {
        if (service.hasAccess(comment.getId(), auth)) {
            if (service.update(comment)) {
                return ResponseEntity.ok().body(Map.of("message", Map.of(
                        "type", "success",
                        "text", "댓글이 수정되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message", Map.of(
                        "type", "error",
                        "text", "댓글이 수정되지 않았습니다.")));
            }
        } else {
            return ResponseEntity.status(403).build();
        }
    }
}