package com.mits.nss.repository;

import com.mits.nss.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByVolunteerId(Long volunteerId);
    List<Attendance> findByEventId(Long eventId);
    Optional<Attendance> findByVolunteerIdAndEventId(Long volunteerId, Long eventId);
}
