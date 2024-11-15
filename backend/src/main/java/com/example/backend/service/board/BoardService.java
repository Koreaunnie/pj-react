package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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
    public Map<String, Object> list(Integer page, String searchType, String keyword) {

        // sql 의 LIMIT 키워드에서 사용되는 offset
        Integer offset = (page - 1) * 10;

        // 조회되는 게시물
        List<Board> list = mapper.selectByPage(offset, searchType, keyword);
        Integer count = mapper.countAll(searchType, keyword);

        // 전체 게시물
        return Map.of("list", list,
                "count", count);
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
