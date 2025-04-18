package com.example.demo.dto;

import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {

    private Long id;

    private String name; // Gruppens namn

    private List<String> users; // En grupp kan ha flera användare

    private List<TodoDTO> todos; // En grupp har många todo-objekt
}
