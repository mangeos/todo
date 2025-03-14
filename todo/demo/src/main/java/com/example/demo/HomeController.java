package com.example.demo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Todo;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {
    private final List<Todo> todos = new ArrayList<>();

    public HomeController() {

    }

    @GetMapping("/todos")
    public List<Todo> getTodos() {
        return todos;
    }

    @PostMapping("/todos")
    public Todo addTodo(@RequestBody Todo todo) {
        // todo.setId(tod); // Sätt unikt ID
        System.out.println(todo);
        todos.add(todo);
        return todo;
    }

    @PutMapping("/todos/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        Optional<Todo> existingTodo = todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst();

        if (existingTodo.isPresent()) {
            Todo todo = existingTodo.get();
            todo.setText(updatedTodo.getText());
            todo.setChecked(updatedTodo.isChecked());
            System.out.println(todo);
            return todo;
        } else {
            throw new RuntimeException("Todo not found");
        }
    }

    @DeleteMapping("/todos/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todos.removeIf(todo -> todo.getId().equals(id));
    }
}