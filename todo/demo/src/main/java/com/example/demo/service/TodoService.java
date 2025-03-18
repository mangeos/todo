package com.example.demo.service;

import java.util.List;
import java.time.LocalDate;
import com.example.demo.model.Todo;

public interface TodoService {
    List<Todo> getAllTodos();

    Todo getTodoById(Long id);

    Todo createTodo(Todo todo);

    Todo updateTodo(Long id, Todo todo);

    void deleteTodo(Long id);

    List<Todo> getTodosByDate(LocalDate date);
}