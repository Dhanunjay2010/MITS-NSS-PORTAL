# MITS NSS Connect

Complete Frontend PRD Prompt for Lovable AI

Copy and paste the following prompt into Lovable AI.

Build a Complete Responsive Frontend for "MITS NSS Portal"

Project Overview

Design and develop a modern, responsive, professional frontend for MITS NSS PORTAL using React.js, HTML5, CSS3, JavaScript (ES6) and Bootstrap/Tailwind CSS (frontend only).

The website is completely public except the Admin Dashboard.

The design should look similar to a modern university portal with attractive animations, professional color palette and clean UI.

Use component-based architecture.

No backend implementation.

Use dummy data wherever required.

The project should be fully responsive for Desktop, Tablet and Mobile.

Theme

Primary Color

NSS Red (#C62828)

Secondary Color

White (#FFFFFF)

Accent Color

Dark Blue (#0D47A1)

Background

Light Gray (#F5F5F5)

Use modern cards with shadows, rounded corners, hover effects and smooth transitions.

Website Structure

There are two major parts.

Public Website

Admin Dashboard

PUBLIC WEBSITE

Header

Sticky Header

Left Side

• NSS Logo

• NSS Motto

• MITS College Logo

Center

Heading

MITS NSS PORTAL

Right Side Navigation

Home

Events / Activities

Attendance

Login

Navigation should smoothly redirect to corresponding pages.

Include hover effects and active navigation indicator.

HOME PAGE

This is the default landing page.

Hero Section

Large banner

Background image related to NSS

Heading

"Not Me But You"

Sub Heading

National Service Scheme

Button

Explore Activities

Volunteer Today

Image Slider

Create automatic image carousel.

Include 8-10 NSS activity images.

Auto slide every 3 seconds.

Manual navigation arrows.

Indicator dots.

About NSS

Short introduction

Mission

Vision

Objectives

Cards with icons.

NSS Activities Overview

Cards

Blood Donation

Tree Plantation

Swachh Bharat

Health Camps

Village Adoption

Awareness Programs

Each card contains

Image

Title

Short Description

Read More button

Statistics Section

Animated Counter

100+

Events

1200+

Volunteers

5000+

Service Hours

40+

Awards

Latest Announcements

Cards

Upcoming Events

Important Notices

Recent Activities

Footer

Quick Links

Contact Information

College Address

Social Media Icons

Copyright

EVENTS & ACTIVITIES PAGE

Display all NSS events.

Use attractive event cards.

Each Event Card contains

Event Banner

Title

Date

Venue

Short Description

Read More Button

Sample Events

Blood Donation Camp

Yoga Day

Independence Day Rally

Swachh Bharat

Plantation Drive

Road Safety Awareness

Health Camp

Women Empowerment

Digital Literacy

Each card should animate on hover.

Use pagination or Load More button.

ATTENDANCE PAGE

Center aligned attendance search card.

Card Title

Attendance Tracker

Fields

Roll Number

Date of Birth

Search Button

Modern glassmorphism design.

Input validation

Required fields

Search animation

Below search

Show sample attendance details

Event Name

Attendance Status

Date

Hours

Certificates Earned

(Use dummy data)

LOGIN PAGE

Center aligned login container.

Title

Admin Login

Fields

Email / Username

Password

Remember Me

Forgot Password

Login Button

Basic frontend validation

Required fields

Invalid email format

Password visibility toggle

Modern animations

After clicking Login

Navigate to Admin Dashboard.

(No backend)

ADMIN DASHBOARD

Professional Admin Panel

Dashboard Layout

Left Sidebar

Right Content Area

Top Navigation Bar

Responsive

Collapsible sidebar on mobile.

SIDEBAR MENU

Home

Add Events / Activities

Volunteers

Mark Attendance

Logout

Icons for every menu.

Active menu highlight.

TOP BAR

Welcome Admin

Search Bar

Notification Icon

Profile Image

Logout Button

DASHBOARD HOME

Display summary cards.

Card 1

Overall Events Organized

Example

128

Card 2

Events Organized This Academic Year

Example

37

Card 3

Total Volunteers

Example

432

Card 4

Attendance Percentage

Example

91%

Graph Section

Display sample charts using Chart.js

Monthly Events

Volunteer Growth

Attendance Statistics

Pie Chart

Department Wise Volunteers

Bar Chart

Monthly Events

Line Chart

Attendance Trend

ADD EVENTS / ACTIVITIES PAGE

Create a professional event registration form.

Fields

Event Title

Event Date

Event Time

Event Venue

Event Collaboration (Optional)

Event Description

Chief Guest

NSS Program Officer

Official Staff

Upload Event Banner

Upload Event Report (PDF)

Upload Event Images (Multiple)

Achievements

Submit Button

Reset Button

Use

Date Picker

Time Picker

Textarea

File Upload

Image Preview

Responsive Layout

Two-column form on desktop.

Single column on mobile.

VOLUNTEERS PAGE

Display volunteer management table.

Top Buttons

Add Volunteer

Import Excel

Export Excel

Search Volunteer

Filter

Department

Year

Volunteer Table

Columns

Serial Number

Roll Number

Volunteer Name

Department

Year of Study

Phone Number

Actions

Edit

Delete

View

Dummy Data

50 volunteers

Departments

CSE

CSM

CSBS

ECE

EEE

MECH

CIVIL

MBA

Years

1

2

3

4

Table Features

Sorting

Searching

Pagination

Hover Effects

Confirmation Dialog before Delete

ADD VOLUNTEER MODAL

Fields

Roll Number

Name

Department

Year

Phone Number

Gender

Email

Blood Group

Address

Save Button

Cancel Button

MARK ATTENDANCE PAGE

Top Section

Dropdown

Select Event

All created events should appear here (dummy data).

After selecting event

Display volunteer table.

Columns

Serial Number

Roll Number

Volunteer Name

Department

Year

Phone Number

Attendance

Present

Absent

Attendance Column

Present

Green Check Box

Absent

Red Cross Button

Save Attendance Button

Reset Attendance Button

Search Volunteer

Filter by Department

Filter by Year

Sticky table header.

COMMON UI FEATURES

Use

Cards

Rounded Corners

Shadows

Gradient Buttons

Hover Effects

Animations

Glassmorphism

Responsive Grid

Loading Spinner

Toast Notifications

Modal Dialogs

Confirmation Dialogs

Breadcrumb Navigation

Back to Top Button

Dark Mode Toggle (Optional)

RESPONSIVE DESIGN

Desktop

Laptop

Tablet

Mobile

Sidebar collapses automatically.

Navigation becomes hamburger menu.

Tables become scrollable.

Forms become single column.

COMPONENT STRUCTURE

src

components
    Header
    Footer
    Sidebar
    Navbar
    Hero
    ImageSlider
    EventCard
    AttendanceForm
    LoginForm
    DashboardCards
    Charts
    VolunteerTable
    AttendanceTable
    EventForm

pages
    Home
    Events
    Attendance
    Login

    dashboard
        DashboardHome
        AddEvent
        Volunteers
        MarkAttendance

assets
    images
    logos
    icons

styles

App.jsx

main.jsx


Routing

/

Home

/events

Events

/attendance

Attendance Tracker

/login

Admin Login

/dashboard

Dashboard Home

/dashboard/events

Add Event

/dashboard/volunteers

Volunteer List

/dashboard/attendance

Mark Attendance


Libraries

React Router DOM

React Icons

Chart.js

React Hook Form

Framer Motion

Bootstrap 5 or Tailwind CSS

SweetAlert2

AOS Animation Library

Dummy Data

Generate sample data for:

100 volunteers

20 events

Attendance records

Dashboard statistics

Department-wise volunteer counts

Monthly event statistics

Event images and banners (placeholder images)

Final Deliverables

Generate a complete frontend with:

Professional university-grade UI/UX

Fully responsive design

React component architecture

React Router navigation

Modern animations and transitions

Dashboard with charts and statistics

Event management form

Volunteer management table with CRUD UI

Attendance marking interface

Clean, maintainable, and well-commented code

Dummy data integration for demonstration

Production-ready frontend structure ready for backend integration with Spring Boot and MySQL.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/673137ab-0f50-4815-8304-398921697af2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
