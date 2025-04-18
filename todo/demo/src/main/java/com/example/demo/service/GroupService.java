package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;

import com.example.demo.dto.GroupDTO;
import com.example.demo.model.Group;

public interface GroupService {

    GroupDTO getGroupById(Long id);

    GroupDTO createGroup(Group group);

    List<GroupDTO> findAll();

    // void deleteGroup(Long id);

}
