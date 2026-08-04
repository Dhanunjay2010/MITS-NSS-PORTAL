package com.mits.nss.controller;

import com.mits.nss.dto.AttendanceLookupResponse;
import com.mits.nss.dto.AttendanceMarkRequest;
import com.mits.nss.dto.AttendanceRecordDto;
import com.mits.nss.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /** Public: used by the Attendance Tracker page on the site. */
    @GetMapping("/lookup")
    public ResponseEntity<AttendanceLookupResponse> lookup(@RequestParam String rollNo) {
        return ResponseEntity.ok(attendanceService.lookupByRollNo(rollNo));
    }

    /** Admin: used by the Mark Attendance dashboard page to prefill existing marks. */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<AttendanceRecordDto>> byEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.byEvent(eventId));
    }

    /** Admin: bulk-save attendance for an event. */
    @PostMapping("/mark")
    public ResponseEntity<Void> mark(@Valid @RequestBody AttendanceMarkRequest request) {
        attendanceService.mark(request);
        return ResponseEntity.ok().build();
    }
}
