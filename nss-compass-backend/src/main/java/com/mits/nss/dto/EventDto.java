package com.mits.nss.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Date is required")
    private String date; // yyyy-MM-dd

    private String time; // HH:mm
    private String venue;
    private String category;
    private Integer participants;
    private String collaboration;
    private String description;
    private String achievements;
    private String chiefGuest;
    private String programOfficer;
    private String officialStaff;
    private String bannerUrl;
    private String reportUrl;
    private List<String> gallery;
    private String shortDescription;
}
