package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    final CommentMapper mapper;

    // 댓글 작성
    public void add(Comment comment, Authentication auth) {
        comment.setMemberId(auth.getName());
        mapper.insert(comment);
    }

    // 댓글 목록 조회
    public List<Comment> list(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    // 권한 확인 (로그인 여부)
    public boolean hasAccess(Integer id, Authentication auth) {
        Comment comment = mapper.selectById(id);
        return comment.getMemberId().equals(auth.getName());
    }

    // 댓글 삭제
    public void remove(Integer id) {
        mapper.deleteById(id);
    }

    // 댓글 수정
    public boolean update(Comment comment) {
        int cnt = mapper.update(comment);
        return cnt == 1;
    }
}