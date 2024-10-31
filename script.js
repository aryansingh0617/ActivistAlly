const calendar = document.getElementById('calendar');
const monthYearDisplay = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const registerForm = document.getElementById('register-form');
const eventNameInput = document.getElementById('event-name');
const eventDescriptionInput = document.getElementById('event-description');

let currentDate = new Date();
let events = {};  // Store events as { 'YYYY-MM-DD': { name: 'Event Name', description: 'Description' } }

function generateCalendar(date) {
    calendar.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;

        const eventDate = `${year}-${month + 1}-${day}`;
        if (events[eventDate]) {
            dayCell.classList.add('event');
            dayCell.title = events[eventDate].name;
        }

        dayCell.addEventListener('click', () => openModal(eventDate));
        calendar.appendChild(dayCell);
    }
}

function openModal(date) {
    modal.style.display = 'flex';
    registerForm.dataset.date = date;
}

function closeModalFunction() {
    modal.style.display = 'none';
    eventNameInput.value = '';
    eventDescriptionInput.value = '';
}

closeModal.addEventListener('click', closeModalFunction);

window.onclick = function(event) {
    if (event.target == modal) {
        closeModalFunction();
    }
};

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = registerForm.dataset.date;
    const eventName = eventNameInput.value;
    const eventDescription = eventDescriptionInput.value;

    // Store event locally
    events[date] = {
        name: eventName,
        description: eventDescription
    };

    // Send event registration to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, name: eventName, description: eventDescription })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Log success message from server
        closeModalFunction();
        generateCalendar(currentDate);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Initial calendar generation
generateCalendar(currentDate);
