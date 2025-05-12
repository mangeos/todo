package com.example.demo.service;

import java.util.List;
import java.time.LocalDate;

import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Todo;

public interface TodoService {
    List<Todo> getAllTodos();

    TodoDTO getTodoById(Long id);

    TodoDTO createTodo(Todo todo, Long groupId);

    TodoDTO updateTodo(Long id, Todo todo);

    void deleteTodo(Long id);

    // void deleteTodosByGroup(String groupName);

    List<TodoDTO> getTodosByDate(LocalDate date);

    List<TodoDTO> getTodosGroupNameAndDate(String groupName, String date);

    List<TodoDTO> getTodosByGroup(String groupName);
}