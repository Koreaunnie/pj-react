package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.BoardFile;
import com.example.backend.mapper.board.BoardMapper;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;
    final CommentMapper commentMapper;
    final S3Client s3;

    @Value("${image.src.prefix}")
    String imageSrcPrefix;

    @Value("${bucket.name}")
    String bucketName;

    // 게시물 작성
    public boolean add(Board board, MultipartFile[] files, Authentication authentication) {
        board.setWriter(authentication.getName());

        int cnt = mapper.insert(board);

        if (files != null && files.length > 0) {
            // 파일 업로드
            for (MultipartFile file : files) {

                String objectKey = String.format("pj1114/%s/%s", board.getId(), file.getOriginalFilename());
                PutObjectRequest por = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectKey)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                try {
                    s3.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                // board_file 테이블에 파일명 입력
                mapper.insertFile(board.getId(), file.getOriginalFilename());

            }
        }
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
        Board board = mapper.selectById(id);
        List<String> fileNameList = mapper.selectFilesByBoardId(id);
        List<BoardFile> fileSrcList = fileNameList.stream()
                .map(name -> new BoardFile(name, String.format("%s/%s/%s", imageSrcPrefix, id, name)))
                .toList();
        board.setFileList(fileSrcList);
        return board;
    }

    // 게시물 작성 시 제목, 내용 공백 불가
    public boolean validate(Board board) {
        boolean title = board.getTitle().trim().length() > 0;
        boolean content = board.getContent().trim().length() > 0;

        return title && content;
    }

    // 게시물 삭제
    public boolean remove(int id) {
        // 첨부파일 지우기
        // 실제파일(s3) 지우기
        List<String> fileName = mapper.selectFilesByBoardId(id);

        for (String file : fileName) {
            String key = String.format("pj1114/%s/%s", id, file);
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3.deleteObject(dor);
        }
        // db 지우기
        mapper.deleteFileByBoardId(id);

        // 댓글 지우기
        commentMapper.deleteByBoardId(id);

        int cnt = mapper.deleteById(id);
        return cnt == 1;
    }

    // 게시물 수정
    public boolean update(Board board, List<String> removeFiles) {
        // 이미 업로드된 파일 지우기
        for (String file : removeFiles) {
            String key = String.format("pj1114/%s/%s", board.getId(), file);
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            // s3 파일 지우기
            s3.deleteObject(dor);

            // db 파일 지우기
            mapper.deleteFileByBoardIdAndName(board.getId(), file);
        }

        int cnt = mapper.update(board);
        return cnt == 1;
    }

    // 게시물 삭제할 권한이 있는지 확인 (게시물 작성자와 로그인한 사용자 확인)
    public boolean hasAccess(int id, Authentication authentication) {
        Board board = mapper.selectById(id);

        return board.getWriter().equals(authentication.getName());
    }
}
