package com.mits.nss.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyValueDto {
    private String month;
    private long value;
}
