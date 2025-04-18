package com.example.demo.dto;

import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private List<String> groupNames; // Bara gruppnamn, inte hela Group-objekt
}