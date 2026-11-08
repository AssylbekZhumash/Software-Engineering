
import re
import tkinter as tk
from tkinter import ttk

from rooms import ROOMS
from filtering import filter_rooms
from availability import check_room_availability

NOW = 540  # Fixed current time: 09:00

root = tk.Tk()
root.title("Smart Campus - Room Availability")
root.geometry("760x600")
root.minsize(620, 460)
root.columnconfigure(0, weight=1)
root.rowconfigure(0, weight=1)

main = ttk.Frame(root, padding=18)
main.grid(row=0, column=0, sticky="nsew")
main.columnconfigure(0, weight=1)
main.rowconfigure(3, weight=1)

ttk.Label(
    main,
    text="Smart Campus Room Checker",
    font=("Segoe UI", 18, "bold")
).grid(row=0, column=0, sticky="w", pady=(0, 12))

# Room requirements
filters = ttk.LabelFrame(main, text="Room Requirements", padding=10)
filters.grid(row=1, column=0, sticky="ew")

ttk.Label(filters, text="Attendees:").grid(row=0, column=0)

attendees_var = tk.StringVar(value="10")
ttk.Entry(
    filters, textvariable=attendees_var, width=10
).grid(row=0, column=1, padx=8)

equipment_names = [
    "projector", "whiteboard", "computers", "speakers"
]

equipment_vars = {
    name: tk.BooleanVar(
        value=name in ("projector", "whiteboard")
    )
    for name in equipment_names
}

for i, name in enumerate(equipment_names):
    ttk.Checkbutton(
        filters,
        text=name.title(),
        variable=equipment_vars[name]
    ).grid(row=1, column=i, padx=8, pady=10)

# Time selection
time_frame = ttk.LabelFrame(
    main, text="Booking Time - Today (Current: 09:00)", padding=10
)
time_frame.grid(row=2, column=0, sticky="ew", pady=10)

ttk.Label(time_frame, text="Start:").grid(row=0, column=0)

start_var = tk.StringVar(value="11:00")
ttk.Entry(
    time_frame, textvariable=start_var, width=10
).grid(row=0, column=1, padx=8)

ttk.Label(time_frame, text="End:").grid(row=0, column=2)

end_var = tk.StringVar(value="12:00")
ttk.Entry(
    time_frame, textvariable=end_var, width=10
).grid(row=0, column=3, padx=8)

# Room list
room_frame = ttk.LabelFrame(
    main, text="Matching Rooms", padding=10
)
room_frame.grid(row=3, column=0, sticky="nsew")
room_frame.columnconfigure(0, weight=1)
room_frame.rowconfigure(0, weight=1)

room_list = tk.Listbox(
    room_frame, height=7, exportselection=False
)
room_list.grid(row=0, column=0, sticky="nsew")

status_var = tk.StringVar(value="Select a room.")
ttk.Label(
    main, textvariable=status_var, wraplength=700
).grid(row=4, column=0, sticky="w", pady=10)

visible_rooms = []


def to_minutes(value, allow_24=False):
    """Convert HH:MM to integer minutes."""
    if not re.fullmatch(r"\d{1,2}:\d{2}", value.strip()):
        raise ValueError("Use HH:MM format.")

    hour, minute = map(int, value.strip().split(":"))

    if allow_24 and hour == 24 and minute == 0:
        return 1440

    if not (0 <= hour < 24 and 0 <= minute < 60):
        raise ValueError("Invalid clock time.")

    return hour * 60 + minute


def show_availability():
    selected = room_list.curselection()

    if not selected or not visible_rooms:
        return

    room = visible_rooms[selected[0]]

    try:
        start = to_minutes(start_var.get())
        end = to_minutes(end_var.get(), allow_24=True)
    except ValueError as error:
        status_var.set(f"Invalid time: {error}")
        return

    if room["blocked"]:
        status_var.set(
            f"{room['name']} is BLOCKED."
        )

    elif check_room_availability(
        room["id"], start, end, NOW
    ):
        status_var.set(
            f"AVAILABLE: {room['name']}"
        )

    else:
        status_var.set(
            f"UNAVAILABLE: {room['name']}"
        )


def refresh_rooms():
    global visible_rooms

    selected = room_list.curselection()
    selected_id = (
        visible_rooms[selected[0]]["id"]
        if selected and visible_rooms else None
    )

    room_list.delete(0, tk.END)

    try:
        count = int(attendees_var.get())
        if count < 1:
            raise ValueError()
    except ValueError:
        visible_rooms = []
        status_var.set("Enter a positive number of attendees.")
        return

    required = [
        name for name, var in equipment_vars.items()
        if var.get()
    ]

    visible_rooms = filter_rooms(ROOMS, count, required)

    if not visible_rooms:
        status_var.set("No rooms match your requirements.")
        return

    for room in visible_rooms:
        label = (
            f"{room['id']} - {room['name']} "
            f"({room['capacity']} seats)"
        )
        if room["blocked"]:
            label += " - BLOCKED"

        room_list.insert(tk.END, label)

    index = next(
        (
            i for i, room in enumerate(visible_rooms)
            if room["id"] == selected_id
        ),
        0
    )

    room_list.selection_set(index)
    room_list.activate(index)
    show_availability()


ttk.Button(
    main,
    text="Check Availability",
    command=show_availability
).grid(row=5, column=0, sticky="w", pady=10)

# Automatic updates
attendees_var.trace_add(
    "write", lambda *_: refresh_rooms()
)

for variable in equipment_vars.values():
    variable.trace_add("write", lambda *_: refresh_rooms())

start_var.trace_add(
    "write", lambda *_: show_availability()
)
end_var.trace_add(
    "write", lambda *_: show_availability()
)

room_list.bind(
    "<<ListboxSelect>>", lambda event: show_availability()
)

refresh_rooms()
root.mainloop()
