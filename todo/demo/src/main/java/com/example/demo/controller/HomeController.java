package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.dto.GroupDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Group;
import com.example.demo.model.Todo;
import com.example.demo.service.GroupService;
import com.example.demo.service.TodoService;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {

    private TodoService todoService;
    private GroupService groupService;

    public HomeController(TodoService todoService, GroupService groupService) {
        this.todoService = todoService;
        this.groupService = groupService;
    }

    @GetMapping("/todos")
    public List<Todo> getTodos() {
        return todoService.getAllTodos();
    }

    @PostMapping("/todos")
    public TodoDTO addTodo(@RequestBody Todo todo, @RequestParam("groupId") Long groupId) {
        return todoService.createTodo(todo, groupId);
    }

    @GetMapping("/todos/date")
    public List<TodoDTO> getTodosByDate(@RequestParam("date") String date) {
        LocalDate localDate = LocalDate.parse(date);
        return todoService.getTodosByDate(localDate);
    }

    @GetMapping("/todos/group/date")
    public List<TodoDTO> getTodosByGroupAndDate(@RequestParam("groupName") String groupName,
            @RequestParam("date") String date) {
        System.out.println(groupName + "-" + date);
        return todoService.getTodosGroupNameAndDate(groupName, date);
    }

    @GetMapping("/todos/group")
    public List<TodoDTO> getTodosByGroup(@RequestParam("groupName") String groupName) {
        System.out.println(groupName);
        return todoService.getTodosByGroup(groupName);
    }

    @PostMapping("/group")
    public GroupDTO addGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    @GetMapping("/group")
    public List<GroupDTO> getGroup() {
        return groupService.findAll();
    }

    @PutMapping("/todos/{id}")
    public TodoDTO updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        return todoService.updateTodo(id, updatedTodo);
    }

    @DeleteMapping("/todos/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    @DeleteMapping("/todos/group/{groupName}")
    public void deleteTodosByGroup(@PathVariable String groupName) {
        System.out.println(groupName);
        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        groupService.deleteTodosByGroup(groupName);
    }

}