package com.example.demo.service;

import java.util.List;
import java.time.LocalDate;

import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Todo;

public interface TodoService {
    List<Todo> getAllTodos();

    Todo getTodoById(Long id);

    TodoDTO createTodo(Todo todo, Long groupId);

    Todo updateTodo(Long id, Todo todo);

    void deleteTodo(Long id);

    void deleteTodosByGroup(String groupName);

    List<Todo> getTodosByDate(LocalDate date);

    List<Todo> getTodosGroupNameAndDate(String groupName, String date);

    List<Todo> getTodosByGroup(String groupName);
}