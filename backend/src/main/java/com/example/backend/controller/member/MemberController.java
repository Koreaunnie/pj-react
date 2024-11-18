package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    final MemberService service;

    @PostMapping("signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {
        try {
            if (service.add(member)) {
                return ResponseEntity.ok().body(Map.of(
                        "message", Map.of("type", "success",
                                "text", "회원 가입이 완료되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                        "message", Map.of("type", "warning",
                                "text", "회원 가입 중 문제가 발생하였습니다.")));
            }
        } catch (DuplicateKeyException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", Map.of("type", "warning",
                            "text", "이미 사용 중인 아이디입니다.")));
        }
    }

    @GetMapping("check")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam String id) {
        if (service.checkId(id)) {
            // 아이디 있으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "warning",
                            "text", "이미 사용 중인 아이디 입니다."),
                    "available", false));
        } else {
            // 아이디 없으면
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "info",
                            "text", "사용 가능한 아이디 입니다."),
                    "available", true));

        }
    }

    @GetMapping("list"){
        public List<Member> list() {
            return service.list();
        }
    }

}
