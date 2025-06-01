package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Gruppens namn

    // @JsonManagedReference // För att undvika cirkulär referens
    @ManyToMany(mappedBy = "groups", fetch = FetchType.EAGER) // Ladda användare direkt
    private List<User> users = new ArrayList<>(); // En grupp kan ha flera användare

    // @JsonManagedReference // För att undvika cirkulär referens
    @OneToMany(mappedBy = "group", fetch = FetchType.EAGER) // Ladda användare direkt
    private List<Todo> todos = new ArrayList<>(); // En grupp har många todo-objekt
}