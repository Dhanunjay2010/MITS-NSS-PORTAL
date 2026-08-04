package com.mits.nss.service;

import com.mits.nss.dto.MonthlyValueDto;
import com.mits.nss.dto.NamedValueDto;
import com.mits.nss.dto.StatsSummaryDto;
import com.mits.nss.entity.Attendance;
import com.mits.nss.entity.Event;
import com.mits.nss.entity.Volunteer;
import com.mits.nss.repository.AttendanceRepository;
import com.mits.nss.repository.EventRepository;
import com.mits.nss.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final EventRepository eventRepository;
    private final VolunteerRepository volunteerRepository;
    private final AttendanceRepository attendanceRepository;

    private static final String[] MONTHS = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};

    @Transactional(readOnly = true)
    public StatsSummaryDto summary() {
        List<Event> events = eventRepository.findAll();
        long totalEvents = events.size();
        int currentYear = LocalDate.now().getYear();
        long eventsThisYear = events.stream().filter(e -> e.getDate() != null && e.getDate().getYear() == currentYear).count();
        long totalVolunteers = volunteerRepository.count();
        int attendancePercent = computeOverallAttendancePercent();

        return StatsSummaryDto.builder()
                .totalEvents(totalEvents)
                .eventsThisYear(eventsThisYear)
                .totalVolunteers(totalVolunteers)
                .attendancePercent(attendancePercent)
                .build();
    }

    @Transactional(readOnly = true)
    public List<MonthlyValueDto> monthlyEvents() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (String m : MONTHS) counts.put(m, 0L);

        for (Event e : eventRepository.findAll()) {
            if (e.getDate() == null) continue;
            String month = e.getDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            counts.merge(month, 1L, Long::sum);
        }
        return counts.entrySet().stream()
                .map(en -> new MonthlyValueDto(en.getKey(), en.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NamedValueDto> departmentVolunteers() {
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Volunteer v : volunteerRepository.findAll()) {
            String dept = v.getDepartment() != null ? v.getDepartment() : "Unknown";
            counts.merge(dept, 1L, Long::sum);
        }
        return counts.entrySet().stream()
                .map(en -> new NamedValueDto(en.getKey(), en.getValue()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MonthlyValueDto> attendanceTrend() {
        Map<String, long[]> perMonth = new LinkedHashMap<>(); // [presentCount, totalCount]
        for (String m : MONTHS) perMonth.put(m, new long[]{0, 0});

        for (Attendance a : attendanceRepository.findAll()) {
            if (a.getEvent() == null || a.getEvent().getDate() == null) continue;
            String month = a.getEvent().getDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long[] arr = perMonth.get(month);
            arr[1] += 1;
            if (Boolean.TRUE.equals(a.getPresent())) arr[0] += 1;
        }

        return perMonth.entrySet().stream()
                .map(en -> {
                    long present = en.getValue()[0];
                    long total = en.getValue()[1];
                    long pct = total == 0 ? 0 : Math.round((present * 100.0) / total);
                    return new MonthlyValueDto(en.getKey(), pct);
                })
                .collect(Collectors.toList());
    }

    private int computeOverallAttendancePercent() {
        List<Attendance> all = attendanceRepository.findAll();
        if (all.isEmpty()) return 0;
        long present = all.stream().filter(a -> Boolean.TRUE.equals(a.getPresent())).count();
        return (int) Math.round((present * 100.0) / all.size());
    }
}
