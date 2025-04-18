package com.example.demo.dto;

import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoDTO {

    private Long id;
    private String text;
    private boolean checked;
    private LocalDate date;

}
