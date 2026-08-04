package com.mits.nss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsSummaryDto {
    private long totalEvents;
    private long eventsThisYear;
    private long totalVolunteers;
    private int attendancePercent;
}
