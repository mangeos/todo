package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Todo;
import java.util.List;
import java.time.LocalDate;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByDate(LocalDate date);

    List<Todo> findByGroupNameAndDate(String groupName, LocalDate date);

    List<Todo> findByGroupName(String groupName);

}