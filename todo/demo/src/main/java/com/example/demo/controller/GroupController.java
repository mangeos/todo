package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.GroupMembersDTO;
import com.example.demo.service.GroupService;

@RestController
@CrossOrigin(origins = "*")
public class GroupController {

    private GroupService groupService;

    public GroupController(GroupService groupService) {
        // Constructor
        this.groupService = groupService;
    }

    @GetMapping("/groupmembers/{groupName}")
    public GroupMembersDTO getGroupMembersByGroupName(@PathVariable String groupName) {
        return groupService.getGroupMembersByGroupName(groupName);
    }

    @PostMapping("/groupmembers/{groupName}")
    public GroupMembersDTO addGroupMembers(@PathVariable String groupName, @RequestBody GroupMembersDTO groupMembersDTO) {
        // Implementera logik för att lägga till medlemmar i gruppen
        // Använd groupService för att hantera logiken
        return groupService.addGroupMembers(groupName, groupMembersDTO);
    }
    

}
