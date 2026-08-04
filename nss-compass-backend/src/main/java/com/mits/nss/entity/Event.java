package com.mits.nss.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false)
    private LocalDate date;

    private LocalTime time;

    @Column(length = 200)
    private String venue;

    @Column(length = 100)
    private String category;

    private Integer participants;

    @Column(length = 150)
    private String collaboration;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String achievements;

    @Column(name = "chief_guest", length = 150)
    private String chiefGuest;

    @Column(name = "program_officer", length = 150)
    private String programOfficer;

    @Column(name = "official_staff", length = 150)
    private String officialStaff;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "report_url", length = 500)
    private String reportUrl;

    @ElementCollection
    @CollectionTable(name = "event_gallery", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> gallery = new ArrayList<>();

    @Column(name = "short_description", length = 500)
    private String shortDescription;
}
