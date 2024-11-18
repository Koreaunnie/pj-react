package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member
                (id, password, description)
            VALUES (#{id}, #{password}, #{description})
            """)
    int insert(Member member);

    @Select("""
            SELECT * FROM member
            WHERE id = #{id}
            """)
    Member selectById(String id);

    @Select("""
            SELECT id, inserted
            FROM member
            ORDER BY id
            """)
    List<Member> selectAll();

    @Delete("""
            DELETE FROM member
            WHERE id = #{id}
            """)
    int deleteById(String id);
}
