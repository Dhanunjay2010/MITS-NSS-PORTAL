package com.mits.nss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRecordDto {
    private String event;
    private String category;
    private String date;
    private Boolean present;
    private Integer hours;
}
