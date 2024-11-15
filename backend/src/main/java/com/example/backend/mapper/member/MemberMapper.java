package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    @Insert("""
            INSERT INTO member
                (id, password, description)
            VALUES (#{id}, #{password}, #{description})
            """)
    int insert(Member member);
}
