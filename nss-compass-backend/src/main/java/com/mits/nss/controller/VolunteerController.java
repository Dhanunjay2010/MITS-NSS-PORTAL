package com.mits.nss.controller;

import com.mits.nss.dto.VolunteerDto;
import com.mits.nss.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping
    public ResponseEntity<Page<VolunteerDto>> list(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "name") String sortKey,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(volunteerService.search(query, department, year, sortKey, sortDir, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VolunteerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(volunteerService.getById(id));
    }

    @GetMapping("/by-roll/{rollNo}")
    public ResponseEntity<VolunteerDto> getByRollNo(@PathVariable String rollNo) {
        return ResponseEntity.ok(volunteerService.getByRollNo(rollNo));
    }

    @PostMapping
    public ResponseEntity<VolunteerDto> create(@Valid @RequestBody VolunteerDto dto) {
        return ResponseEntity.ok(volunteerService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VolunteerDto> update(@PathVariable Long id, @Valid @RequestBody VolunteerDto dto) {
        return ResponseEntity.ok(volunteerService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        volunteerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
