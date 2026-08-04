package com.mits.nss.controller;

import com.mits.nss.dto.AnnouncementDto;
import com.mits.nss.dto.MonthlyValueDto;
import com.mits.nss.dto.NamedValueDto;
import com.mits.nss.dto.StatsSummaryDto;
import com.mits.nss.service.AnnouncementService;
import com.mits.nss.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;
    private final AnnouncementService announcementService;

    /** Admin dashboard summary cards. */
    @GetMapping("/summary")
    public ResponseEntity<StatsSummaryDto> summary() {
        return ResponseEntity.ok(statsService.summary());
    }

    /** Admin dashboard: monthly events line/bar chart. */
    @GetMapping("/monthly-events")
    public ResponseEntity<List<MonthlyValueDto>> monthlyEvents() {
        return ResponseEntity.ok(statsService.monthlyEvents());
    }

    /** Admin dashboard: department-wise volunteers pie chart. */
    @GetMapping("/department-volunteers")
    public ResponseEntity<List<NamedValueDto>> departmentVolunteers() {
        return ResponseEntity.ok(statsService.departmentVolunteers());
    }

    /** Admin dashboard: attendance trend line chart. */
    @GetMapping("/attendance-trend")
    public ResponseEntity<List<MonthlyValueDto>> attendanceTrend() {
        return ResponseEntity.ok(statsService.attendanceTrend());
    }

    /** Public: home page "Latest Announcements" section. */
    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementDto>> announcements() {
        return ResponseEntity.ok(announcementService.findAll());
    }
}
