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
    public boolean add(Board board) {
        int cnt = mapper.insert(board);

        return cnt == 1;
    }

    // 게시물 목록
    public List<Board> list(Integer page) {
        return mapper.selectByPage((page - 1) * 10);
    }

    // 게시물 상세 보기
    public Board get(int id) {
        return mapper.selectById(id);
    }

    // 게시물 작성 시 제목, 내용 공백 불가
    public boolean validate(Board board) {
        boolean title = board.getTitle().trim().length() > 0;
        boolean content = board.getContent().trim().length() > 0;

        return title && content;
    }

    // 게시물 삭제
    public boolean remove(int id) {
        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }

    // 게시물 수정
    public boolean update(Board board) {
        int cnt = mapper.update(board);
        return cnt == 1;
    }
}
