package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Insert("""
            INSERT INTO board
            (title, content, writer)
            VALUES (#{title}, #{content}, #{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insert(Board board);

    @Select("""
            SELECT id, title, writer, inserted
            FROM board
            ORDER BY id DESC
            LIMIT #{offset}, 10;
            """)
    List<Board> selectByPage(Integer offset);

    @Select("""
            SELECT *
            FROM board
            WHERE id = #{id}
            """)
    Board selectById(int id);

    @Delete("""
            DELETE FROM board
            WHERE id = #{id}
            """)
    int deleteById(int id);

    @Update("""
            UPDATE board
            SET title=#{title}, content=#{content}
            WHERE id=#{id}
            """)
    int update(Board board);
}
