# Fictional room catalog for Smart Campus

ROOMS = [
    {
        "id": "R101",
        "name": "Study Room",
        "capacity": 8,
        "equipment": ["whiteboard"],
        "blocked": False,
        "bookings": [(600, 660)]
    },
    {
        "id": "R102",
        "name": "Presentation Room",
        "capacity": 20,
        "equipment": ["projector", "whiteboard"],
        "blocked": False,
        "bookings": [(660, 720)]
    },
    {
        "id": "R103",
        "name": "Media Lab",
        "capacity": 12,
        "equipment": ["projector", "computers"],
        "blocked": True,
        "bookings": [(780, 840)]
    },
    {
        "id": "R104",
        "name": "Conference Hall",
        "capacity": 40,
        "equipment": ["projector", "whiteboard", "speakers"],
        "blocked": False,
        "bookings": [(900, 960)]
    }
]