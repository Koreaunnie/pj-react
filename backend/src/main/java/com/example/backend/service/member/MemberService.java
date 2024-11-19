package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    final MemberMapper mapper;
    final JwtEncoder jwtEncoder;

    public boolean add(Member member) {
        int cnt = mapper.insert(member);
        return cnt == 1;
    }

    public boolean checkId(String id) {
        return mapper.selectById(id) != null;
    }

    public List<Member> list() {
        return mapper.selectAll();
    }

    public Member get(String id) {
        return mapper.selectById(id);
    }

    public boolean remove(Member member) {
        int cnt = 0;

        // 기존 암호와 비교
        Member db = mapper.selectById(member.getId());

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                cnt = mapper.deleteById(member.getId());
            }
        }
        return cnt == 1;
    }

    public boolean update(MemberEdit member) {
        int cnt = 0;

        Member db = mapper.selectById(member.getId());
        if (db != null) {
            if (db.getPassword().equals(member.getOldPassword())) {
                cnt = mapper.update(member);
            }
        }
        return cnt == 1;
    }

    public boolean checkEmail(String email) {
        Member member = mapper.selectByEmail(email);

        return member != null;
    }

    // 로그인
    public String token(Member member) {
        // 아이디가 존재하는지 확인
        Member db = mapper.selectById(member.getId());
        if (db != null) {
            // 비밀번호 일치하는지 확인
            if (db.getPassword().equals(member.getPassword())) {
                // token 만들어서 리턴
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getId())
                        .issuedAt(Instant.now()) // 언제부터
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7)) // 언제까지
//                        .claim("scope", "") // 권한
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }
        return null;
    }

    public boolean hasAccess(String id, Authentication authentication) {
        return id.equals(authentication.getName());
    }
}
