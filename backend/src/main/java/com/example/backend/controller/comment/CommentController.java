package com.example.backend.controller.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    final CommentService service;

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public void add(@RequestBody Comment comment,
                    Authentication authentication) {
        service.add(comment, authentication);

    }
}
