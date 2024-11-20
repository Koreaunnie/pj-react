package com.example.backend.controller.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public void add(@RequestBody Comment comment, Authentication auth) {
        service.add(comment, auth);
    }

    // 댓글 삭제
    @DeleteMapping("remove/{id}")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable Integer id, Authentication auth) {
        if (service.hasAccess(id, auth)) {
            service.remove(id);
        }
    }
}