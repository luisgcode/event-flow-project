import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjzNKN-4PhJ7haNaSEfrdcamjcKmXTHf4",
  authDomain: "eventlogin-75b0b.firebaseapp.com",
  databaseURL: "https://eventlogin-75b0b-default-rtdb.firebaseio.com/",
  projectId: "eventlogin-75b0b",
  storageBucket: "eventlogin-75b0b.appspot.com",
  messagingSenderId: "907029754351",
  appId: "1:907029754351:web:bc6bdaf1d231b0d3a2061a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Logout function
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => console.error("Error:", error));
});

// Save event to Firebase
document.getElementById("eventForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("event-title").value;
  const date = document.getElementById("event-date").value;
  const time = document.getElementById("event-time").value || "Not set";
  const description = document.getElementById("event-description").value;
  const category = document.getElementById("event-category").value;
  const color = document.getElementById("event-color").value;
  const reminder = document.getElementById("event-reminder").value;

  const newEventRef = push(ref(db, "events"));
  set(newEventRef, {
    title,
    date,
    time,
    description,
    category,
    color,
    reminder,
  })
    .then(() => {
      document.getElementById("eventForm").reset();
    })
    .catch((error) => console.error("Error:", error));
});

// Display events
const eventsContainer = document.getElementById("events-container");
const modal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const saveEditBtn = document.getElementById("saveEdit");
let currentEventId = null;

onValue(ref(db, "events"), (snapshot) => {
  eventsContainer.innerHTML = "";
  if (!snapshot.exists()) {
    eventsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-plus fa-3x"></i>
        <p>No events yet. Click the "Add Event" button to get started!</p>
      </div>`;
    return;
  }

  snapshot.forEach((childSnapshot) => {
    const event = childSnapshot.val();
    const eventId = childSnapshot.key;

    const eventElement = document.createElement("div");
    eventElement.classList.add("event-item");
    eventElement.style.borderLeft = `5px solid ${event.color}`;

    eventElement.innerHTML = `
      <div class="event-header">
        <h3>${event.title}</h3> -
        <button class="edit-btn" data-id="${eventId}"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete-btn" data-id="${eventId}"><i class="fa-solid fa-delete-left"></i></button>
      </div>
      <p><strong>Date:</strong> ${event.date} at ${event.time}</p>
      <p><strong>Description:</strong> ${event.description}</p>
      <p><strong>Category:</strong> ${event.category}</p>
      <p><strong>Reminder:</strong> ${event.reminder}</p>
    `;

    eventsContainer.appendChild(eventElement);
  });

  // Delete event
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const eventId = e.target.closest("button").getAttribute("data-id");
      remove(ref(db, `events/${eventId}`))
        .then(() => console.log(`Event ${eventId} deleted.`))
        .catch((error) => console.error("Error deleting event:", error));
    });
  });

  // Edit event (open modal)
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const eventId = e.target.closest("button").getAttribute("data-id");
      currentEventId = eventId;
      const eventRef = ref(db, `events/${eventId}`);

      onValue(
        eventRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const event = snapshot.val();
            document.getElementById("edit-title").value = event.title;
            document.getElementById("edit-date").value = event.date;
            document.getElementById("edit-time").value = event.time;
            document.getElementById("edit-description").value =
              event.description;
            document.getElementById("edit-category").value = event.category;
            document.getElementById("edit-reminder").value = event.reminder;
            modal.style.display = "block";
          }
        },
        { onlyOnce: true }
      );
    });
  });
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Save edited event
saveEditBtn.addEventListener("click", () => {
  if (currentEventId) {
    const updatedEvent = {
      title: document.getElementById("edit-title").value,
      date: document.getElementById("edit-date").value,
      time: document.getElementById("edit-time").value,
      description: document.getElementById("edit-description").value,
      category: document.getElementById("edit-category").value,
      reminder: document.getElementById("edit-reminder").value,
    };

    update(ref(db, `events/${currentEventId}`), updatedEvent)
      .then(() => {
        modal.style.display = "none";
      })
      .catch((error) => console.error("Error updating event:", error));
  }
});
