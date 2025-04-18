package com.example.demo.service.imp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GroupDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Group;
import com.example.demo.model.User;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.TodoRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.GroupService;
import com.example.demo.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupServiceImp implements GroupService {

        @Autowired
        private GroupRepository groupRepository;
        @Autowired
        private TodoRepository todoRepository;
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private JwtService jwtService;

        @Autowired
        private HttpServletRequest request;

        public Long getUserIdFromToken() {
                String authorizationHeader = request.getHeader("Authorization");
                if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String token = authorizationHeader.substring(7); // Ta bort "Bearer " från token
                        return jwtService.extractUserId(token); // Extrahera userId från token
                }
                throw new RuntimeException("JWT-token saknas eller är ogiltig");
        }

        public GroupServiceImp(GroupRepository groupRepository, TodoRepository todoRepository) {
                this.groupRepository = groupRepository;
                this.todoRepository = todoRepository;
        }

        @Override
        public GroupDTO getGroupById(Long id) {
                return groupRepository.findById(id)
                                .map(group -> new GroupDTO(
                                                group.getId(),
                                                group.getName(),
                                                group.getUsers().stream()
                                                                .map(User::getUsername)
                                                                .collect(Collectors.toList()),
                                                group.getTodos().stream()
                                                                .map(todo -> new TodoDTO(todo.getId(), todo.getText(),
                                                                                todo.isChecked(),
                                                                                todo.getDate()))
                                                                .collect(Collectors.toList())))
                                .orElseThrow(() -> new RuntimeException("Grupp med ID " + id + " hittades inte"));
        }

        @Transactional
        @Override
        public GroupDTO createGroup(Group group) {
                // Hämta användarens ID från JWT-token
                Long userId = getUserIdFromToken();

                // Hämta användaren från databasen
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Användaren hittades inte"));

                // Sätt användaren i gruppen
                group.setUsers(List.of(user));

                // Lägg till gruppen i användarens lista över grupper
                user.getGroups().add(group);

                // Spara gruppen i databasen
                Group savedGroup = groupRepository.save(group);

                // Konvertera till DTO innan retur
                return new GroupDTO(
                                savedGroup.getId(),
                                savedGroup.getName(),
                                savedGroup.getUsers().stream()
                                                .map(User::getUsername)
                                                .collect(Collectors.toList()),
                                savedGroup.getTodos().stream()
                                                .map(todo -> new TodoDTO(todo.getId(), todo.getText(), todo.isChecked(),
                                                                todo.getDate()))
                                                .collect(Collectors.toList()));
        }

        @Transactional(readOnly = true)
        @Override
        public List<GroupDTO> findAll() {
                // Hämta användarens ID från JWT-token
                Long userId = getUserIdFromToken();
                // Hämta grupper kopplade till användaren
                List<Group> groups = groupRepository.findByUsers_Id(userId);
                return groups.stream()
                                .map(group -> new GroupDTO(
                                                group.getId(),
                                                group.getName(),
                                                group.getUsers().stream()
                                                                .map(User::getUsername)
                                                                .collect(Collectors.toList()),
                                                group.getTodos().stream()
                                                                .map(todo -> new TodoDTO(todo.getId(), todo.getText(),
                                                                                todo.isChecked(),
                                                                                todo.getDate()))
                                                                .collect(Collectors.toList())))
                                .collect(Collectors.toList());
        }
}
