package com.mits.nss.seed;

import com.mits.nss.entity.*;
import com.mits.nss.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database on first startup so the app is usable immediately:
 *  - one admin user (credentials from application.yml / env vars)
 *  - a set of demo volunteers, events, attendance records and announcements
 *  mirroring the shapes the frontend was originally built against.
 * Safe to re-run: it only inserts data when the relevant tables are empty.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final VolunteerRepository volunteerRepository;
    private final EventRepository eventRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.seed-email}")
    private String adminEmail;

    @Value("${app.admin.seed-password}")
    private String adminPassword;

    private static final String[] DEPARTMENTS = {"CSE", "CSM", "CSBS", "ECE", "EEE", "MECH", "CIVIL", "MBA"};
    private static final String[] FIRST_NAMES = {"Aarav", "Vivek", "Ravi", "Sneha", "Priya", "Kiran", "Arjun", "Meera",
            "Neha", "Rohit", "Anjali", "Karthik", "Divya", "Suresh", "Lakshmi", "Rahul", "Pooja", "Vikram",
            "Deepa", "Manoj", "Sruthi", "Naveen", "Bhavana", "Harsha", "Yamini", "Sai", "Tejaswi", "Chaitanya",
            "Madhuri", "Prasad"};
    private static final String[] LAST_NAMES = {"Reddy", "Kumar", "Sharma", "Rao", "Naidu", "Patel", "Verma",
            "Gupta", "Singh", "Nair", "Iyer", "Chowdary", "Prasad", "Goud"};
    private static final String[] BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"};
    private static final String[] TOWNS = {"Madanapalle", "Angallu", "Punganur", "Chittoor", "Tirupati", "Kadiri",
            "Piler", "Bangarupalem"};

    private static final String[] EVENT_TITLES = {
            "Blood Donation Camp", "International Yoga Day", "Independence Day Rally", "Swachh Bharat Drive",
            "Tree Plantation Drive", "Road Safety Awareness", "Free Health Camp", "Women Empowerment Workshop",
            "Digital Literacy Program", "Village Adoption Visit", "Anti-Drug Awareness Rally",
            "AIDS Awareness Campaign", "Clean Campus Initiative", "Voter Awareness Drive", "Save Water Campaign"
    };
    private static final String[] EVENT_CATEGORIES_BY_INDEX = {
            "Health", "Health", "Celebration", "Environment", "Environment", "Awareness", "Health",
            "Education", "Education", "Community Service", "Awareness", "Awareness", "Environment",
            "Awareness", "Environment"
    };
    private static final String[] VENUES = {"MITS Auditorium", "College Grounds", "Adopted Village", "Community Hall", "Open Air Theatre"};
    private static final String[] BANNERS = {
            "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200",
            "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=1200",
            "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200",
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    };

    private static int seed(int i, int mod) {
        return ((i * 9301 + 49297) % mod + mod) % mod;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        List<Volunteer> volunteers = seedVolunteers();
        List<Event> events = seedEvents();
        seedAttendance(volunteers, events);
        seedAnnouncements();
    }

    private void seedAdmin() {
        if (adminUserRepository.findByEmailIgnoreCase(adminEmail).isPresent()) return;
        AdminUser admin = AdminUser.builder()
                .name("Admin")
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .build();
        adminUserRepository.save(admin);
        log.info("Seeded admin user -> email: {}", adminEmail);
    }

    private List<Volunteer> seedVolunteers() {
        if (volunteerRepository.count() > 0) return volunteerRepository.findAll();

        List<Volunteer> volunteers = new ArrayList<>();
        for (int i = 0; i < 60; i++) {
            String dept = DEPARTMENTS[seed(i + 1, DEPARTMENTS.length)];
            int year = seed(i + 3, 4) + 1;
            String fn = FIRST_NAMES[seed(i + 5, FIRST_NAMES.length)];
            String ln = LAST_NAMES[seed(i + 7, LAST_NAMES.length)];
            int rollPrefix = 22 + (year == 1 ? 4 : year == 2 ? 3 : year == 3 ? 2 : 1);

            Volunteer v = Volunteer.builder()
                    .rollNo(rollPrefix + "J41A" + String.format("%04d", 1000 + i))
                    .name(fn + " " + ln)
                    .department(dept)
                    .year(year)
                    .phone("9" + String.valueOf(800000000L + i * 12345L).substring(0, 9))
                    .gender(i % 2 == 0 ? "Male" : "Female")
                    .email((fn + "." + ln + i + "@mits.ac.in").toLowerCase())
                    .bloodGroup(BLOOD_GROUPS[seed(i + 11, BLOOD_GROUPS.length)])
                    .address((100 + i) + ", " + TOWNS[seed(i + 13, TOWNS.length)] + ", Andhra Pradesh")
                    .hours(0)
                    .status(seed(i + 19, 10) > 1 ? "Active" : "Inactive")
                    .build();
            volunteers.add(v);
        }
        volunteers = volunteerRepository.saveAll(volunteers);
        log.info("Seeded {} volunteers", volunteers.size());
        return volunteers;
    }

    private List<Event> seedEvents() {
        if (eventRepository.count() > 0) return eventRepository.findAll();

        List<Event> events = new ArrayList<>();
        for (int i = 0; i < EVENT_TITLES.length; i++) {
            String title = EVENT_TITLES[i];
            LocalDate date = LocalDate.of(2025, (i % 12) + 1, ((i * 3) % 27) + 1);
            String banner = BANNERS[i % BANNERS.length];

            Event e = Event.builder()
                    .title(title)
                    .date(date)
                    .time(LocalTime.of(9 + (i % 6), 0))
                    .venue(VENUES[i % VENUES.length])
                    .category(EVENT_CATEGORIES_BY_INDEX[i % EVENT_CATEGORIES_BY_INDEX.length])
                    .participants(60 + ((i * 37) % 240))
                    .bannerUrl(banner)
                    .gallery(List.of(
                            BANNERS[(i + 1) % BANNERS.length],
                            BANNERS[(i + 3) % BANNERS.length]
                    ))
                    .shortDescription(title + " organized by MITS NSS Unit to promote social awareness and community welfare.")
                    .description("The " + title + " was a flagship initiative under the MITS NSS Unit. Volunteers from across "
                            + "all departments participated actively, spreading awareness and delivering meaningful impact to "
                            + "the community. The event was inaugurated by our Chief Guest and coordinated by the NSS Program Officer.")
                    .chiefGuest("Dr. Ramesh Chandra")
                    .programOfficer("Prof. Lakshmi Narayana")
                    .officialStaff("NSS Coordination Team")
                    .build();
            events.add(e);
        }
        events = eventRepository.saveAll(events);
        log.info("Seeded {} events", events.size());
        return events;
    }

    private void seedAttendance(List<Volunteer> volunteers, List<Event> events) {
        if (attendanceRepository.count() > 0) return;

        List<Attendance> records = new ArrayList<>();
        for (Volunteer v : volunteers) {
            int start = v.getId() != null ? v.getId().intValue() : 1;
            int limit = Math.min(events.size(), 10);
            for (int i = 0; i < limit; i++) {
                Event e = events.get(i);
                boolean present = (start + i * 3) % 7 != 0;
                int hours = present ? 2 + ((start + i) % 4) : 0;
                records.add(Attendance.builder()
                        .volunteer(v)
                        .event(e)
                        .present(present)
                        .hours(hours)
                        .build());
            }
        }
        attendanceRepository.saveAll(records);

        // Recalculate each volunteer's total service hours from the seeded attendance
        for (Volunteer v : volunteers) {
            int total = attendanceRepository.findByVolunteerId(v.getId()).stream()
                    .filter(Attendance::getPresent)
                    .mapToInt(Attendance::getHours)
                    .sum();
            v.setHours(total);
        }
        volunteerRepository.saveAll(volunteers);
        log.info("Seeded {} attendance records", records.size());
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() > 0) return;

        List<Announcement> announcements = List.of(
                Announcement.builder()
                        .tag("Upcoming")
                        .title("Annual NSS Camp — 2026")
                        .date(LocalDate.of(2026, 2, 10))
                        .body("Seven-day residential camp at Adopted Village. Registrations open for all NSS volunteers.")
                        .build(),
                Announcement.builder()
                        .tag("Notice")
                        .title("Blood Donation Drive Registrations")
                        .date(LocalDate.of(2026, 1, 25))
                        .body("Volunteers can register at the NSS office. Certificates will be issued to all donors.")
                        .build(),
                Announcement.builder()
                        .tag("Recent")
                        .title("Swachh Bharat Rally Successfully Held")
                        .date(LocalDate.of(2026, 1, 5))
                        .body("Over 250 volunteers participated. Coverage across 3 wards near MITS campus.")
                        .build()
        );
        announcementRepository.saveAll(announcements);
        log.info("Seeded {} announcements", announcements.size());
    }
}
