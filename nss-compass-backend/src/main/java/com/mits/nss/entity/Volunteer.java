package com.mits.nss.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "volunteers", uniqueConstraints = @UniqueConstraint(columnNames = "roll_no"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "roll_no", nullable = false, length = 30)
    private String rollNo;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 20)
    private String department;

    @Column(nullable = false)
    private Integer year;

    @Column(length = 20)
    private String phone;

    @Column(length = 10)
    private String gender;

    @Column(length = 120)
    private String email;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @Column(length = 255)
    private String address;

    @Column(nullable = false)
    private Integer hours;

    @Column(length = 20)
    private String status; // "Active" | "Inactive"
}
