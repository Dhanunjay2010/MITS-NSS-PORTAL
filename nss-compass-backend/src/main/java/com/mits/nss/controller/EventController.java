package com.mits.nss.controller;

import com.mits.nss.dto.EventDto;
import com.mits.nss.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> list() {
        return ResponseEntity.ok(eventService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    /**
     * Creates an event. Accepts multipart/form-data so the banner, report (PDF)
     * and gallery images can be uploaded in the same request as the form fields.
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<EventDto> create(
            @RequestParam String title,
            @RequestParam String date,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) String venue,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer participants,
            @RequestParam(required = false) String collaboration,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String achievements,
            @RequestParam(required = false) String chiefGuest,
            @RequestParam(required = false) String programOfficer,
            @RequestParam(required = false) String officialStaff,
            @RequestParam(required = false) MultipartFile banner,
            @RequestParam(required = false) MultipartFile report,
            @RequestParam(required = false) List<MultipartFile> images
    ) {
        EventDto dto = EventDto.builder()
                .title(title).date(date).time(time).venue(venue).category(category)
                .participants(participants).collaboration(collaboration).description(description)
                .achievements(achievements).chiefGuest(chiefGuest).programOfficer(programOfficer)
                .officialStaff(officialStaff)
                .build();
        return ResponseEntity.ok(eventService.create(dto, banner, report, images));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<EventDto> update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String date,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) String venue,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer participants,
            @RequestParam(required = false) String collaboration,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String achievements,
            @RequestParam(required = false) String chiefGuest,
            @RequestParam(required = false) String programOfficer,
            @RequestParam(required = false) String officialStaff,
            @RequestParam(required = false) MultipartFile banner,
            @RequestParam(required = false) MultipartFile report,
            @RequestParam(required = false) List<MultipartFile> images
    ) {
        EventDto dto = EventDto.builder()
                .title(title).date(date).time(time).venue(venue).category(category)
                .participants(participants).collaboration(collaboration).description(description)
                .achievements(achievements).chiefGuest(chiefGuest).programOfficer(programOfficer)
                .officialStaff(officialStaff)
                .build();
        return ResponseEntity.ok(eventService.update(id, dto, banner, report, images));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
