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
            <script>
                SELECT id, title, writer, inserted
                FROM board
                WHERE
                    <trim prefixOverrides="OR">
                        <if test="searchType == 'all' or searchType == 'title'">
                            title LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="searchType == 'all' or searchType == 'content'">
                            OR content LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                    </trim>
                ORDER BY id DESC
                LIMIT #{offset}, 10;
            </script>
            """)
    List<Board> selectByPage(Integer offset, String searchType, String keyword);

    @Select("""
            <script>
                SELECT COUNT(*)
                FROM board
                WHERE
                    <trim prefixOverrides="OR">
                        <if test="searchType == 'all' or searchType == 'title'">
                            title LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                        <if test="searchType == 'all' or searchType == 'content'">
                            OR content LIKE CONCAT('%', #{keyword}, '%')
                        </if>
                    </trim>
            </script>
            """)
    int countAll(String searchType, String keyword);

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
