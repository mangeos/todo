package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByUsers_Id(Long userId);

    void deleteByName(String groupName);

    Group findByName(String groupName);

}
