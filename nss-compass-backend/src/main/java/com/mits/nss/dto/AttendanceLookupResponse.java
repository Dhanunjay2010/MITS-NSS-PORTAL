package com.mits.nss.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceLookupResponse {
    private VolunteerDto volunteer;
    private List<AttendanceRecordDto> records;
}
