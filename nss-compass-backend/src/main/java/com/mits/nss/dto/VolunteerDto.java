package com.mits.nss.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerDto {
    private Long id;

    @NotBlank(message = "Roll number is required")
    private String rollNo;

    @NotBlank(message = "Name is required")
    private String name;

    private String department;

    @Min(value = 1, message = "Year must be between 1 and 4")
    private Integer year;

    private String phone;
    private String gender;
    private String email;
    private String bloodGroup;
    private String address;
    private Integer hours;
    private String status;
}
