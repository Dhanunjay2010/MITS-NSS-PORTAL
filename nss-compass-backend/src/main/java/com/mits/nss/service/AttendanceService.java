package com.mits.nss.service;

import com.mits.nss.dto.AttendanceLookupResponse;
import com.mits.nss.dto.AttendanceMarkRequest;
import com.mits.nss.dto.AttendanceRecordDto;
import com.mits.nss.entity.Attendance;
import com.mits.nss.entity.Event;
import com.mits.nss.entity.Volunteer;
import com.mits.nss.exception.ResourceNotFoundException;
import com.mits.nss.repository.AttendanceRepository;
import com.mits.nss.repository.EventRepository;
import com.mits.nss.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final VolunteerRepository volunteerRepository;
    private final EventRepository eventRepository;
    private final VolunteerService volunteerService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    @Transactional(readOnly = true)
    public AttendanceLookupResponse lookupByRollNo(String rollNo) {
        Volunteer volunteer = volunteerRepository.findByRollNoIgnoreCase(rollNo)
                .orElseThrow(() -> new ResourceNotFoundException("No volunteer found with roll number " + rollNo));

        List<AttendanceRecordDto> records = attendanceRepository.findByVolunteerId(volunteer.getId()).stream()
                .sorted(Comparator.comparing((Attendance a) -> a.getEvent().getDate()).reversed())
                .map(a -> AttendanceRecordDto.builder()
                        .event(a.getEvent().getTitle())
                        .category(a.getEvent().getCategory())
                        .date(a.getEvent().getDate() != null ? a.getEvent().getDate().format(DATE_FMT) : null)
                        .present(a.getPresent())
                        .hours(a.getHours())
                        .build())
                .collect(Collectors.toList());

        return AttendanceLookupResponse.builder()
                .volunteer(volunteerService.toDto(volunteer))
                .records(records)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordDto> byEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId).stream()
                .map(a -> AttendanceRecordDto.builder()
                        .event(a.getEvent().getTitle())
                        .category(a.getEvent().getCategory())
                        .date(a.getEvent().getDate() != null ? a.getEvent().getDate().format(DATE_FMT) : null)
                        .present(a.getPresent())
                        .hours(a.getHours())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void mark(AttendanceMarkRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + request.getEventId()));

        for (AttendanceMarkRequest.Entry entry : request.getEntries()) {
            Volunteer volunteer = volunteerRepository.findById(entry.getVolunteerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found with id " + entry.getVolunteerId()));

            Attendance attendance = attendanceRepository
                    .findByVolunteerIdAndEventId(volunteer.getId(), event.getId())
                    .orElseGet(() -> Attendance.builder().volunteer(volunteer).event(event).build());

            attendance.setPresent(entry.getPresent());
            int hours = entry.getHours() != null ? entry.getHours() : (Boolean.TRUE.equals(entry.getPresent()) ? 2 : 0);
            attendance.setHours(hours);
            attendanceRepository.save(attendance);

            // Keep volunteer's cumulative service hours in sync
            if (Boolean.TRUE.equals(entry.getPresent())) {
                recalculateVolunteerHours(volunteer);
            }
        }
    }

    private void recalculateVolunteerHours(Volunteer volunteer) {
        int total = attendanceRepository.findByVolunteerId(volunteer.getId()).stream()
                .filter(a -> Boolean.TRUE.equals(a.getPresent()))
                .mapToInt(Attendance::getHours)
                .sum();
        volunteer.setHours(total);
        volunteerRepository.save(volunteer);
    }
}
