package com.example.demo.service.imp;

import java.util.List;
import java.util.Optional;

import com.example.demo.dto.GroupDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Group;
import com.example.demo.model.Todo;
import com.example.demo.model.User;

import java.time.LocalDate;

import com.example.demo.service.JwtService;
import com.example.demo.service.TodoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.TodoRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.imp.GroupServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoServiceImp implements TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private GroupServiceImp groupServiceImp;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserRepository userRepository;

    public Long getUserIdFromToken() {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Ta bort "Bearer " från token
            return jwtService.extractUserId(token); // Extrahera userId från token
        }
        throw new RuntimeException("JWT-token saknas eller är ogiltig");
    }

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Override
    public Todo getTodoById(Long id) {
        Optional<Todo> todo = todoRepository.findById(id);
        return todo.orElse(null);
    }

    // @Override
    // public Todo createTodo(Todo todo) {
    // Long userId = getUserIdFromToken(); // Hämta användarens ID från token
    // User user = new User();
    // user.setId(userId); // Skapa en User-instans med ID:t

    // // Hämta befintliga användare kopplade till todo (om det är en uppdatering)
    // if (todo.getId() != null) {
    // Optional<Todo> existingTodo = todoRepository.findById(todo.getId());
    // if (existingTodo.isPresent()) {
    // // Behåll befintliga användare
    // todo.setUsers(existingTodo.get().getUsers());
    // }
    // }

    // // Lägg till den nya användaren i listan
    // todo.getUsers().add(user);
    // // Spara todo med uppdaterad lista över användare
    // return todoRepository.save(todo);
    // }

    @Override
    public TodoDTO createTodo(Todo todo, Long groupId) {
        // Long userId = getUserIdFromToken(); // Hämta användarens ID från token

        Group group = groupRepository.findById(groupId).get();
        if (group == null) {
            throw new RuntimeException("Group not found");
        }

        todo.setGroup(group);

        Todo savedTodo = todoRepository.save(todo);

        return convertToDTO(savedTodo);

    }

    private TodoDTO convertToDTO(Todo todo) {
        return new TodoDTO(todo.getId(), todo.getText(), todo.isChecked(), todo.getDate());
    }

    // @Override
    // public Todo updateTodo(Long id, Todo todo) {
    // if (todoRepository.existsById(id)) {
    // todo.setId(id);
    // return todoRepository.save(todo);
    // }
    // return null;
    // }

    @Override
    public Todo updateTodo(Long id, Todo updatedTodo) {

        // Hämta den befintliga todo:n från databasen
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        // // Behåll befintliga användare kopplade till todo
        // List<User> existingUsers = existingTodo.getUsers();

        // // Lägg till den inloggade användaren om den inte redan är kopplad
        // if (!existingUsers.contains(user)) {
        // existingUsers.add(user);
        // }

        // // Uppdatera fälten i todo
        existingTodo.setText(updatedTodo.getText());
        existingTodo.setChecked(updatedTodo.isChecked());
        existingTodo.setDate(updatedTodo.getDate());
        existingTodo.setGroupName(updatedTodo.getGroupName());

        // Spara den uppdaterade todo:n
        return todoRepository.save(existingTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteTodosByGroup(String groupName) {
        todoRepository.deleteByGroupName(groupName);
    }

    @Override
    public List<Todo> getTodosByDate(LocalDate date) {
        return todoRepository.findByDate(date); // Implementera metod för att hämta todos baserat på datum
    }

    @Override
    public List<Todo> getTodosGroupNameAndDate(String groupName, String date) {
        LocalDate localDate = LocalDate.parse(date);
        return todoRepository.findByGroupNameAndDate(groupName, localDate);
    }

    @Override
    public List<Todo> getTodosByGroup(String groupName) {
        return todoRepository.findByGroupName(groupName);
    }
}
