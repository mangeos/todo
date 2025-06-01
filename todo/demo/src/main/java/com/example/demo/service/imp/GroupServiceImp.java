package com.example.demo.service.imp;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.GroupDTO;
import com.example.demo.dto.GroupMembersDTO;
import com.example.demo.dto.TodoDTO;
import com.example.demo.model.Group;
import com.example.demo.model.User;
import com.example.demo.model.Todo;
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
                                .toList();
        }

        @Override
        @Transactional
        public void deleteTodosByGroup(String groupName) {
                Group group = groupRepository.findByName(groupName);

                for (User user : group.getUsers()) {
                        user.getGroups().remove(group);
                }
                // Radera alla användare kopplade till gruppen
                group.getUsers().clear();
                // Radera alla todos kopplade till gruppen
                List<Todo> todos = todoRepository.findByGroupName(groupName);
                for (Todo todo : todos) {
                        todoRepository.deleteById(todo.getId());
                }
                // Radera gruppen från databasen
                groupRepository.delete(group);
        }

        @Transactional
        @Override
        public GroupMembersDTO getGroupMembersByGroupName(String groupName) {
                Group group = groupRepository.findByName(groupName);
                if (group == null) {
                        throw new RuntimeException("Grupp med namn " + groupName + " hittades inte");
                }
                System.out.println(groupName + " group members: " + group.getUsers());
                // Force initialization of lazy-loaded users
                Hibernate.initialize(group.getUsers());

                List<String> members = group.getUsers().stream()
                                .map(User::getUsername)
                                .collect(Collectors.toList());

                GroupMembersDTO groupMembersDTO = new GroupMembersDTO();
                groupMembersDTO.setMembers(members);

                return groupMembersDTO;
        }

        @Transactional
        @Override
        public GroupMembersDTO addGroupMembers(String groupName, GroupMembersDTO groupMembersDTO) {
                Group group = groupRepository.findByName(groupName);
                if (group == null) {
                        throw new RuntimeException("Grupp med namn " + groupName + " hittades inte");
                }
                // Force initialization of lazy-loaded users
                Hibernate.initialize(group.getUsers());
                List<String> membersToAdd = groupMembersDTO.getMembers();
                System.out.println("membersToAdd!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                System.out.println(membersToAdd);
                List<User> usersToAdd = membersToAdd.stream().map(member -> {
                        // Hämta användaren från databasen baserat på användarnamnet
                        return userRepository.findByUsername(member)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Användare med namn " + member + " hittades inte"));
                }).collect(Collectors.toList());

                // Lägg till användarna i gruppen
                group.getUsers().addAll(usersToAdd);
                System.out.println("group.getUsers()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                System.out.println("Before saving group: " + group.getUsers());

                for (User user : usersToAdd) {
                        user.getGroups().add(group); // Lägg till gruppen till användarens lista också
                }

                // Spara gruppen med de nya medlemmarna
                Group updatedGroup = groupRepository.save(group);
                System.out.println("After saving group: " + updatedGroup.getUsers());
                // Skapa en ny GroupMembersDTO med de uppdaterade medlemmarna
                GroupMembersDTO updatedGroupMembersDTO = new GroupMembersDTO();
                updatedGroupMembersDTO.setMembers(updatedGroup.getUsers().stream()
                                .map(User::getUsername)
                                .collect(Collectors.toList()));

                return updatedGroupMembersDTO;
        }
}
