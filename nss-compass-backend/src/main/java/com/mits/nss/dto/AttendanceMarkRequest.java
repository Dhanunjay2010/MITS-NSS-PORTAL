package com.mits.nss.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AttendanceMarkRequest {
    @NotNull
    private Long eventId;

    @NotNull
    private List<Entry> entries;

    @Data
    public static class Entry {
        @NotNull
        private Long volunteerId;
        @NotNull
        private Boolean present;
        private Integer hours; // optional, defaults applied server-side if null
    }
}
