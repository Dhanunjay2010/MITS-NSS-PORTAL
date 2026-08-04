package com.mits.nss.repository;

import com.mits.nss.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long>, JpaSpecificationExecutor<Volunteer> {
    Optional<Volunteer> findByRollNoIgnoreCase(String rollNo);
    boolean existsByRollNoIgnoreCase(String rollNo);
}
