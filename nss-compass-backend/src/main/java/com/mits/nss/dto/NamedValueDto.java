package com.mits.nss.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NamedValueDto {
    private String name;
    private long value;
}
