package com.mits.nss.service;

import com.mits.nss.dto.AnnouncementDto;
import com.mits.nss.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository repository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("MMM d, yyyy");

    @Transactional(readOnly = true)
    public List<AnnouncementDto> findAll() {
        return repository.findAllByOrderByDateDesc().stream()
                .map(a -> AnnouncementDto.builder()
                        .id(a.getId())
                        .tag(a.getTag())
                        .title(a.getTitle())
                        .date(a.getDate() != null ? a.getDate().format(DATE_FMT) : null)
                        .body(a.getBody())
                        .build())
                .collect(Collectors.toList());
    }
}
