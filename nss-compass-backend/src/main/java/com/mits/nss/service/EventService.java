package com.mits.nss.service;

import com.mits.nss.dto.EventDto;
import com.mits.nss.entity.Event;
import com.mits.nss.exception.BadRequestException;
import com.mits.nss.exception.ResourceNotFoundException;
import com.mits.nss.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository repository;
    private final FileStorageService fileStorageService;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    @Transactional(readOnly = true)
    public List<EventDto> findAll() {
        return repository.findAllByOrderByDateDesc().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto getById(Long id) {
        return toDto(findEntity(id));
    }

    @Transactional(readOnly = true)
    public Event findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
    }

    @Transactional
    public EventDto create(EventDto dto, MultipartFile banner, MultipartFile report, List<MultipartFile> images) {
        Event entity = toEntity(dto);
        entity.setId(null);

        if (banner != null && !banner.isEmpty()) {
            entity.setBannerUrl(fileStorageService.store(banner, "banners"));
        }
        if (report != null && !report.isEmpty()) {
            entity.setReportUrl(fileStorageService.store(report, "reports"));
        }
        List<String> gallery = new ArrayList<>();
        if (images != null) {
            for (MultipartFile img : images) {
                if (img != null && !img.isEmpty()) {
                    gallery.add(fileStorageService.store(img, "gallery"));
                }
            }
        }
        if (!gallery.isEmpty()) entity.setGallery(gallery);

        if (entity.getShortDescription() == null && entity.getDescription() != null) {
            entity.setShortDescription(
                    entity.getDescription().length() > 160
                            ? entity.getDescription().substring(0, 160) + "..."
                            : entity.getDescription()
            );
        }
        if (entity.getParticipants() == null) entity.setParticipants(0);

        return toDto(repository.save(entity));
    }

    @Transactional
    public EventDto update(Long id, EventDto dto, MultipartFile banner, MultipartFile report, List<MultipartFile> images) {
        Event entity = findEntity(id);
        Event updated = toEntity(dto);
        updated.setId(entity.getId());
        updated.setBannerUrl(entity.getBannerUrl());
        updated.setReportUrl(entity.getReportUrl());
        updated.setGallery(entity.getGallery());

        if (banner != null && !banner.isEmpty()) {
            updated.setBannerUrl(fileStorageService.store(banner, "banners"));
        }
        if (report != null && !report.isEmpty()) {
            updated.setReportUrl(fileStorageService.store(report, "reports"));
        }
        if (images != null && !images.isEmpty()) {
            List<String> gallery = new ArrayList<>(entity.getGallery());
            for (MultipartFile img : images) {
                if (img != null && !img.isEmpty()) {
                    gallery.add(fileStorageService.store(img, "gallery"));
                }
            }
            updated.setGallery(gallery);
        }
        return toDto(repository.save(updated));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id " + id);
        }
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Event> findAllEntities() {
        return repository.findAll();
    }

    public EventDto toDto(Event e) {
        return EventDto.builder()
                .id(e.getId())
                .title(e.getTitle())
                .date(e.getDate() != null ? e.getDate().format(DATE_FMT) : null)
                .time(e.getTime() != null ? e.getTime().format(TIME_FMT) : null)
                .venue(e.getVenue())
                .category(e.getCategory())
                .participants(e.getParticipants())
                .collaboration(e.getCollaboration())
                .description(e.getDescription())
                .achievements(e.getAchievements())
                .chiefGuest(e.getChiefGuest())
                .programOfficer(e.getProgramOfficer())
                .officialStaff(e.getOfficialStaff())
                .bannerUrl(e.getBannerUrl())
                .reportUrl(e.getReportUrl())
                .gallery(e.getGallery())
                .shortDescription(e.getShortDescription())
                .build();
    }

    private Event toEntity(EventDto dto) {
        LocalDate date;
        try {
            date = LocalDate.parse(dto.getDate(), DATE_FMT);
        } catch (Exception ex) {
            throw new BadRequestException("Invalid date format, expected yyyy-MM-dd");
        }
        LocalTime time = null;
        if (dto.getTime() != null && !dto.getTime().isBlank()) {
            try {
                time = LocalTime.parse(dto.getTime(), TIME_FMT);
            } catch (Exception ex) {
                throw new BadRequestException("Invalid time format, expected HH:mm");
            }
        }
        return Event.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .date(date)
                .time(time)
                .venue(dto.getVenue())
                .category(dto.getCategory())
                .participants(dto.getParticipants())
                .collaboration(dto.getCollaboration())
                .description(dto.getDescription())
                .achievements(dto.getAchievements())
                .chiefGuest(dto.getChiefGuest())
                .programOfficer(dto.getProgramOfficer())
                .officialStaff(dto.getOfficialStaff())
                .shortDescription(dto.getShortDescription())
                .gallery(dto.getGallery() != null ? dto.getGallery() : new ArrayList<>())
                .build();
    }
}
