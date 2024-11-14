package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    // 게시물 작성
    public void add(Board board) {
        mapper.insert(board);
    }

    // 게시물 목록
    public List<Board> list() {
        return mapper.selectAll();
    }
}
