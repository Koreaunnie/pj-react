package com.example.backend.dto.member;

import lombok.Data;

@Data
public class MemberEdit {
    private String id;
    private String password;
    private String oldPassword;
    private String description;
}
