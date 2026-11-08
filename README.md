
Smart Campus Room Availability Checker

Software Engineering — Assignment #04

Student: Zhumash Assylbek
Programming Language: Python
AI Tools: Claude and Bolt AI

PROJECT DESCRIPTION

Smart Campus Room Availability Checker is a Python application designed to help students find suitable and available university rooms.

The project extends Assignment #03 by introducing multiple rooms, capacity and equipment filtering, room-specific availability checking, and a graphical user interface.

FEATURES

- Four fictional campus rooms with individual booking schedules.
- Capacity filtering based on the number of attendees.
- Equipment filtering based on user requirements.
- Blocked room detection.
- Booking overlap validation.
- Maximum booking duration of 120 minutes.
- Automatic availability updates when switching rooms.
- Graphical user interface developed using Tkinter.

REQUIREMENTS

Python 3 with Tkinter support.

No additional third-party Python packages are required.

INSTALLATION

Clone the GitHub repository:

git clone -b assignment-04 https://github.com/AssylbekZhumash/Software-Engineering.git

Navigate to the project directory:

cd Software-Engineering

RUNNING THE APPLICATION

Run the following command:

python room_ui.py

The application opens a graphical interface where users can select room requirements, enter booking times, and check room availability.

RUNNING AUTOMATED TESTS

Execute all automated tests using:

python -m unittest discover -v

Initial Version: 50 tests passed.
Final Version: 68 tests passed.

PROJECT STRUCTURE

booking.py — Original booking validation logic.

booking_v1.py — Previous version of booking validation.

rooms.py — Fictional room catalog containing room information and booking schedules.

filtering.py — Capacity and equipment filtering.

availability.py — Room lookup and availability coordination.

room_ui.py — Tkinter graphical user interface.

test_booking.py — Original regression tests.

test_assignment4.py — New feature and integration tests.

docs/test_results.txt — Automated testing results.

VERSION CONTROL

GitHub Repository:
https://github.com/AssylbekZhumash/Software-Engineering

Branch: assignment-04

Initial Version (Before): e5683d7

Final Feature Implementation (After): f8133a7

LIMITATIONS

The application uses fictional static room data and a fixed current time.

It does not include authentication, payments, real-time APIs, or database integration.
