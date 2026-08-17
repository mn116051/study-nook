```javascript
/* =========================================================
   STUDY NOOK
   Main application JavaScript
   ========================================================= */


/* -----------------------------
   BASIC DATA
----------------------------- */

const levels = [1, 2, 3, 4];

const subjects = [
    "Mathematics",
    "English",
    "Science",
    "Humanities"
];

const motivations = [
    "A little progress is still progress ♡",
    "You don't have to finish everything today.",
    "One page at a time 🌷",
    "Your future self will thank you.",
    "Small steps still move you forward ♡"
];


/* -----------------------------
   USER DATA
----------------------------- */

let userData = JSON.parse(localStorage.getItem("studyNookUser")) || {

    username: "Student",

    xp: 0,

    level: 1,

    totalStudySeconds: 0,

    todayStudySeconds: 0,

    streak: 0,

    longestStreak: 0,

    sessions: 0,

    lastStudyDate: null,

    avatar: {
        skin: "#f6d2b8",
        presentation: "androgynous",
        hair: "short",
        headwear: "none"
    }

};


function saveUserData() {

    localStorage.setItem(
        "studyNookUser",
        JSON.stringify(userData)
    );

}


/* -----------------------------
   NAVIGATION
----------------------------- */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    document.querySelectorAll(".nav-item").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );

    });

    document.getElementById("sidebar")?.classList.remove("open");

    if (pageId === "calendar") {
        renderCalendar();
        renderUpcomingEvents();
    }

    if (pageId === "resources") {
        renderResources();
    }

    if (pageId === "rooms") {
        renderRoomBrowser();
    }

    updateEverything();

}


function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("open");

}


/* -----------------------------
   DASHBOARD
----------------------------- */

function formatStudyTime(seconds) {

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;

}


function updateDashboard() {

    document.getElementById("dashboardUsername").textContent =
        userData.username;

    document.getElementById("welcomeName").textContent =
        userData.username;

    document.getElementById("levelDisplay").textContent =
        userData.level;

    document.getElementById("profileLevel").textContent =
        userData.level;

    document.getElementById("xpDisplay").textContent =
        userData.xp;

    document.getElementById("profileXP").textContent =
        userData.xp;

    document.getElementById("todayStudyTime").textContent =
        formatStudyTime(userData.todayStudySeconds);

    document.getElementById("goalTime").textContent =
        formatStudyTime(userData.todayStudySeconds);

    document.getElementById("profileStudyTime").textContent =
        formatStudyTime(userData.totalStudySeconds);

    document.getElementById("streakDisplay").textContent =
        userData.streak;

    document.getElementById("profileStreak").textContent =
        userData.streak;

    document.getElementById("sessionDisplay").textContent =
        userData.sessions;

    document.getElementById("profileSessions").textContent =
        userData.sessions;


    const xpNeeded =
        userData.level * 100;

    document.getElementById("xpNeeded").textContent =
        xpNeeded;

    const percentage =
        Math.min(
            100,
            (userData.xp / xpNeeded) * 100
        );

    document.getElementById("xpProgress").style.width =
        percentage + "%";


    const goalSeconds = 2 * 60 * 60;

    const goalPercentage =
        Math.min(
            100,
            (userData.todayStudySeconds / goalSeconds) * 100
        );

    document.getElementById("goalProgress").style.width =
        goalPercentage + "%";


    const levelTitles = [
        "Little Learner",
        "Study Sprout",
        "Bookworm",
        "Study Star",
        "Nook Master"
    ];

    document.getElementById("levelTitle").textContent =
        levelTitles[
            Math.min(
                userData.level - 1,
                levelTitles.length - 1
            )
        ];

}


function updateTodayDate() {

    const date = new Date();

    document.getElementById("todayDate").textContent =
        date.toLocaleDateString(
            undefined,
            {
                weekday: "short",
                day: "numeric",
                month: "short"
            }
        );

}


function updateMotivation() {

    const index =
        new Date().getDate() %
        motivations.length;

    document.getElementById("motivationText").textContent =
        motivations[index];

}


/* -----------------------------
   CALENDAR
----------------------------- */

let calendarDate = new Date();

let events =
    JSON.parse(
        localStorage.getItem("studyNookEvents")
    ) || [];


function saveEvents() {

    localStorage.setItem(
        "studyNookEvents",
        JSON.stringify(events)
    );

}


function openEventModal() {

    document
        .getElementById("eventModal")
        .classList.remove("hidden");

}


function closeEventModal() {

    document
        .getElementById("eventModal")
        .classList.add("hidden");

}


document
    .getElementById("eventForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const newEvent = {

            id: Date.now(),

            title:
                document.getElementById("eventTitle").value,

            date:
                document.getElementById("eventDate").value,

            start:
                document.getElementById("eventStart").value,

            end:
                document.getElementById("eventEnd").value,

            category:
                document.getElementById("eventCategory").value,

            subject:
                document.getElementById("eventSubject").value,

            description:
                document.getElementById("eventDescription").value

        };


        events.push(newEvent);

        saveEvents();

        this.reset();

        closeEventModal();

        renderCalendar();

        renderUpcomingEvents();

        renderDashboardEvents();

    });


function changeMonth(amount) {

    calendarDate.setMonth(
        calendarDate.getMonth() + amount
    );

    renderCalendar();

}


function goToToday() {

    calendarDate = new Date();

    renderCalendar();

}


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    document.getElementById("calendarMonth").textContent =
        calendarDate.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric"
            }
        );


    const grid =
        document.getElementById("calendarGrid");

    grid.innerHTML = "";


    for (let i = 0; i < firstDay; i++) {

        const blank =
            document.createElement("div");

        blank.className = "calendar-day";

        grid.appendChild(blank);

    }


    for (let day = 1; day <= daysInMonth; day++) {

        const cell =
            document.createElement("div");

        cell.className = "calendar-day";


        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            cell.classList.add("today");

        }


        const number =
            document.createElement("div");

        number.className =
            "calendar-day-number";

        number.textContent = day;

        cell.appendChild(number);


        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        events
            .filter(item => item.date === dateString)
            .forEach(item => {

                const event =
                    document.createElement("div");

                event.className =
                    "calendar-event";

                event.textContent =
                    item.title;

                cell.appendChild(event);

            });


        grid.appendChild(cell);

    }

}


function getCountdown(dateString) {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    const target =
        new Date(dateString + "T00:00:00");

    const difference =
        Math.round(
            (target - today) /
            (1000 * 60 * 60 * 24)
        );


    if (difference === 0) return "Today!";

    if (difference === 1) return "Tomorrow!";

    if (difference < 0) return "Passed";

    return `${difference} days away`;

}


function renderUpcomingEvents() {

    const container =
        document.getElementById("upcomingEvents");

    const upcoming =
        [...events]
            .filter(event => {

                const date =
                    new Date(event.date + "T00:00:00");

                return date >= new Date(
                    new Date().toDateString()
                );

            })
            .sort(
                (a,b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(0, 10);


    if (!upcoming.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>🌷</span>
                <p>Your calendar is clear!</p>
                <small>Enjoy the free time or add something coming up.</small>
            </div>
        `;

        return;

    }


    container.innerHTML =
        upcoming.map(event => `

            <div class="upcoming-event">

                <small>${escapeHTML(event.category)}</small>

                <h4>${escapeHTML(event.title)}</h4>

                <p>
                    📅 ${formatDate(event.date)}
                </p>

                ${
                    event.start
                    ? `<p>⏰ ${event.start}</p>`
                    : ""
                }

                ${
                    event.subject
                    ? `<p>📚 ${escapeHTML(event.subject)}</p>`
                    : ""
                }

                <strong>
                    ${getCountdown(event.date)}
                </strong>

            </div>

        `).join("");

}


function renderDashboardEvents() {

    const container =
        document.getElementById("dashboardEvents");

    const upcoming =
        [...events]
            .filter(event => {

                const target =
                    new Date(event.date);

                return target >=
                    new Date(
                        new Date().toDateString()
                    );

            })
            .sort(
                (a,b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(0, 3);


    if (!upcoming.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>🌷</span>
                <p>Your calendar is clear!</p>
                <small>Add something coming up.</small>
            </div>
        `;

        return;

    }


    container.innerHTML =
        upcoming.map(event => `

            <div class="upcoming-event">

                <h4>${escapeHTML(event.title)}</h4>

                <p>
                    📅 ${formatDate(event.date)}
                    ${event.start ? " · ⏰ " + event.start : ""}
                </p>

                <strong>
                    ${getCountdown(event.date)}
                </strong>

            </div>

        `).join("");

}


function formatDate(date) {

    return new Date(date + "T00:00:00")
        .toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "long"
            }
        );

}


/* -----------------------------
   STUDY ROOMS
----------------------------- */

function renderRoomBrowser() {

    const container =
        document.getElementById("roomBrowser");

    container.innerHTML = `

        <div class="scrap-card">

            <p class="eyebrow">STEP 1</p>

            <h3>Choose your level 🌷</h3>

            <div class="level-grid">

                ${levels.map(level => `

                    <button
                        class="level-card"
                        onclick="chooseLevel(${level})"
                    >

                        <span>📚</span>

                        <h3>Level ${level}</h3>

                        <p>Choose subjects</p>

                    </button>

                `).join("")}

            </div>

        </div>

    `;

}


function chooseLevel(level) {

    const container =
        document.getElementById("roomBrowser");

    container.innerHTML = `

        <div class="scrap-card">

            <button
                class="text-button"
                onclick="renderRoomBrowser()"
            >
                ← Back to Levels
            </button>

            <p class="eyebrow">STEP 2</p>

            <h3>Level ${level} Subjects 🌷</h3>

            <div class="subject-grid">

                ${subjects.map(subject => `

                    <button
                        class="subject-card"
                        onclick="openRoom('level${level}-${subject.toLowerCase()}')"
                    >

                        <span>
                            ${getSubjectIcon(subject)}
                        </span>

                        <h3>${subject}</h3>

                        <p>Enter study room →</p>

                    </button>

                `).join("")}

            </div>

        </div>

    `;

}


function getSubjectIcon(subject) {

    const icons = {

        Mathematics: "📐",

        English: "📖",

        Science: "🔬",

        Humanities: "🌏"

    };

    return icons[subject] || "📚";

}


function openRoom(roomId) {

    const parts =
        roomId.split("-");

    const level =
        parts[0].replace("level", "");

    const subject =
        parts
            .slice(1)
            .map(word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
            )
            .join(" ");


    const interfaceElement =
        document.getElementById("roomInterface");


    interfaceElement.classList.remove("hidden");


    document.getElementById("roomBrowser").innerHTML = "";


    interfaceElement.innerHTML = `

        <div class="scrap-card">

            <div class="room-header">

                <div>

                    <p class="eyebrow">
                        LEVEL ${level} · ${subject.toUpperCase()}
                    </p>

                    <h2>
                        ${subject} Study Room
                    </h2>

                </div>

                <button
                    class="secondary-button"
                    onclick="renderRoomBrowser(); document.getElementById('roomInterface').classList.add('hidden')"
                >
                    ← Leave Room
                </button>

            </div>


            <div class="room-columns">

                <div>

                    <div class="scrap-card">

                        <p class="eyebrow">ROOM CHAT 💬</p>

                        <h3>
                            Level ${level} ${subject}
                        </h3>

                        <div class="chat-box">

                            <div
                                id="chatMessages"
                                class="chat-messages"
                            >

                                <div class="empty-state">

                                    <span>🌷</span>

                                    <p>
                                        Start the conversation!
                                    </p>

                                </div>

                            </div>


                            <div class="chat-input">

                                <input
                                    id="chatInput"
                                    placeholder="Write something..."
                                    onkeydown="if(event.key==='Enter') sendLocalMessage()"
                                >

                                <button
                                    onclick="sendLocalMessage()"
                                >
                                    Send
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                <div>

                    <div class="scrap-card">

                        <p class="eyebrow">
                            STUDENTS HERE
                        </p>

                        <h3>🌱 ${level} · ${subject}</h3>

                        <div class="empty-state">

                            <span>🪴</span>

                            <p>
                                It's quiet here right now.
                            </p>

                            <small>
                                Be the first one to start studying!
                            </small>

                        </div>

                    </div>


                    <div
                        class="scrap-card"
                        style="margin-top:20px;"
                    >

                        <p class="eyebrow">
                            ROOM STATUS
                        </p>

                        <p>
                            🟢 You are currently studying
                        </p>

                        <button
                            class="primary-button"
                            onclick="showPage('timer')"
                        >
                            Open Focus Timer
                        </button>

                    </div>

                </div>

            </div>

        </div>

    `;


    window.currentRoomId =
        roomId;

}


function sendLocalMessage() {

    const input =
        document.getElementById("chatInput");

    const messages =
        document.getElementById("chatMessages");


    if (!input || !messages) return;


    const text =
        input.value.trim();

    if (!text) return;


    const message =
        document.createElement("div");

    message.style.background =
        "#f0e0e2";

    message.style.padding =
        "10px";

    message.style.borderRadius =
        "12px";

    message.style.marginBottom =
        "8px";

    message.innerHTML =
        `<strong>${escapeHTML(userData.username)}</strong><br>${escapeHTML(text)}`;


    const empty =
        messages.querySelector(".empty-state");

    if (empty) empty.remove();


    messages.appendChild(message);

    input.value = "";

    messages.scrollTop =
        messages.scrollHeight;

}


/* -----------------------------
   TIMER
----------------------------- */

let timerMode = "stopwatch";

let timerRunning = false;

let timerSeconds = 0;

let timerInterval = null;

let pomodoroFocus = 25;

let pomodoroBreak = 5;

let pomodoroSeconds = 0;


function setTimerMode(mode) {

    pauseTimer();

    timerMode = mode;

    timerSeconds = 0;

    pomodoroSeconds =
        pomodoroFocus * 60;


    document.querySelectorAll(".timer-tab")
        .forEach(button =>
            button.classList.remove("active")
        );


    if (mode === "stopwatch") {

        document.querySelectorAll(".timer-tab")[0]
            .classList.add("active");

        document.getElementById("timerModeLabel")
            .textContent = "STOPWATCH";

        document.getElementById("pomodoroLabel")
            .classList.add("hidden");

    } else {

        document.querySelectorAll(".timer-tab")[1]
            .classList.add("active");

        document.getElementById("timerModeLabel")
            .textContent = "POMODORO";

        document.getElementById("pomodoroLabel")
            .classList.remove("hidden");

    }

    updateTimerDisplay();

}


function setPomodoro(focus, breakTime) {

    pomodoroFocus = focus;

    pomodoroBreak = breakTime;

    setTimerMode("pomodoro");

}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;


    timerInterval =
        setInterval(() => {

            if (timerMode === "stopwatch") {

                timerSeconds++;

                recordStudySecond();

            } else {

                if (pomodoroSeconds > 0) {

                    pomodoroSeconds--;

                    recordStudySecond();

                } else {

                    pomodoroSeconds =
                        pomodoroBreak * 60;

                    document.getElementById("pomodoroLabel")
                        .textContent =
                        "Break 🌷";

                }

            }


            updateTimerDisplay();

        }, 1000);

}


function pauseTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    pauseTimer();

    timerSeconds = 0;

    pomodoroSeconds =
        pomodoroFocus * 60;

    updateTimerDisplay();

}


function updateTimerDisplay() {

    let seconds;

    if (timerMode === "stopwatch") {

        seconds = timerSeconds;

    } else {

        seconds = pomodoroSeconds;

    }


    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );

    const remainingSeconds =
        seconds % 60;


    document.getElementById("timerDisplay")
        .textContent =
        `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(remainingSeconds).padStart(2,"0")}`;

}


/* -----------------------------
   STUDY TRACKING
----------------------------- */

function recordStudySecond() {

    userData.totalStudySeconds++;

    userData.todayStudySeconds++;

    saveUserData();


    updateDashboard();

}


function awardXP() {

    userData.xp++;

    const needed =
        userData.level * 100;


    if (userData.xp >= needed) {

        userData.xp -= needed;

        userData.level++;

    }


    saveUserData();

}


/* Give XP every minute studied */

setInterval(() => {

    if (timerRunning) {

        awardXP();

    }

}, 60000);


/* -----------------------------
   AVATAR
----------------------------- */

function setSkin(color) {

    userData.avatar.skin =
        color;

    applyAvatar();

}


function setPresentation(type) {

    userData.avatar.presentation =
        type;

    applyAvatar();

}


function setHair(type) {

    userData.avatar.hair =
        type;

    applyAvatar();

}


function setHeadwear(type) {

    userData.avatar.headwear =
        type;

    applyAvatar();

}


function applyAvatar() {

    document.querySelectorAll(".avatar-face")
        .forEach(face => {

            face.style.background =
                userData.avatar.skin;

        });


    document.querySelectorAll(".avatar-hair")
        .forEach(hair => {

            if (
                userData.avatar.headwear === "hijab" ||
                userData.avatar.headwear === "wrapped"
            ) {

                hair.style.background =
                    "#a88f9b";

            } else {

                hair.style.background =
                    "#5b4037";

            }

        });


    saveUserData();

}


function saveAvatar() {

    saveUserData();

    updateEverything();

    alert("Your Study Nook look has been saved ♡");

}


function resetAvatar() {

    userData.avatar = {

        skin: "#f6d2b8",
        presentation: "androgynous",
        hair: "short",
        headwear: "none"

    };

    applyAvatar();

}


/* -----------------------------
   RESOURCES
----------------------------- */

let resources =
    JSON.parse(
        localStorage.getItem("studyNookResources")
    ) || [];


function saveResources() {

    localStorage.setItem(
        "studyNookResources",
        JSON.stringify(resources)
    );

}


function openResourceModal() {

    document
        .getElementById("resourceModal")
        .classList.remove("hidden");

}


function closeResourceModal() {

    document
        .getElementById("resourceModal")
        .classList.add("hidden");

}


document
    .getElementById("resourceForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        resources.push({

            id: Date.now(),

            title:
                document.getElementById("resourceTitle").value,

            subject:
                document.getElementById("resourceSubject").value,

            level:
                document.getElementById("resourceLevel").value,

            description:
                document.getElementById("resourceDescription").value,

            link:
                document.getElementById("resourceLink").value

        });


        saveResources();

        this.reset();

        closeResourceModal();

        renderResources();

    });


function renderResources() {

    const container =
        document.getElementById("resourceList");

    if (!container) return;


    const level =
        document.getElementById("resourceLevelFilter")
            .value;

    const subject =
        document.getElementById("resourceSubjectFilter")
            .value;


    const filtered =
        resources.filter(resource => {

            return (
                (level === "all" ||
                    resource.level === level) &&

                (subject === "all" ||
                    resource.subject === subject)
            );

        });


    if (!filtered.length) {

        container.innerHTML = `
            <div class="scrap-card">
                <div class="empty-state">
                    <span>📚</span>
                    <p>No resources yet.</p>
                    <small>Add something useful for your fellow students ♡</small>
                </div>
            </div>
        `;

        return;

    }


    container.innerHTML =
        filtered.map(resource => `

            <div class="resource-card">

                <p class="eyebrow">
                    LEVEL ${escapeHTML(resource.level)}
                    ·
                    ${escapeHTML(resource.subject)}
                </p>

                <h3>
                    ${escapeHTML(resource.title)}
                </h3>

                <p>
                    ${escapeHTML(resource.description || "Study resource")}
                </p>

                <a
                    href="${escapeAttribute(resource.link)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Resource →
                </a>

            </div>

        `).join("");

}


/* -----------------------------
   STUDY AI
----------------------------- */

function cleanSentences(text) {

    return text
        .replace(/\s+/g, " ")
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 25);

}


function summariseNotes() {

    const input =
        document.getElementById("summaryInput")
            .value.trim();

    const output =
        document.getElementById("summaryOutput");


    if (!input) {

        output.innerHTML =
            "Paste some notes first ♡";

        return;

    }


    const sentences =
        cleanSentences(input);


    const selected =
        sentences.slice(
            0,
            Math.min(5, sentences.length)
        );


    if (!selected.length) {

        output.innerHTML =
            "Try adding a little more detailed text so Study AI can find the key ideas.";

        return;

    }


    output.innerHTML = `

        <h4>✨ Study Summary</h4>

        <ul>

            ${selected
                .map(sentence =>
                    `<li>${escapeHTML(sentence)}.</li>`
                )
                .join("")}

        </ul>

        <small>
            This is a browser-based study helper and does not use an external AI service.
        </small>

    `;

}


let flashcards = [];

let flashcardIndex = 0;

let flashcardShowingAnswer = false;


function generateFlashcards() {

    const input =
        document.getElementById("flashcardInput")
            .value.trim();

    const output =
        document.getElementById("flashcardOutput");


    const sentences =
        cleanSentences(input);


    if (!sentences.length) {

        output.innerHTML =
            "Paste some notes first ♡";

        return;

    }


    flashcards =
        sentences.slice(0, 8)
            .map(sentence => {

                const words =
                    sentence.split(" ");

                const keyWord =
                    words.find(word =>
                        word.length > 7
                    ) || words[0];


                return {

                    question:
                        `What is important about "${keyWord}"?`,

                    answer:
                        sentence

                };

            });


    flashcardIndex = 0;

    flashcardShowingAnswer = false;

    renderFlashcard();

}


function renderFlashcard() {

    const output =
        document.getElementById("flashcardOutput");


    if (!flashcards.length) return;


    const card =
        flashcards[flashcardIndex];


    output.innerHTML = `

        <div
            class="flashcard"
            onclick="flipFlashcard()"
        >

            <strong>
                ${
                    flashcardShowingAnswer
                    ? "ANSWER"
                    : "QUESTION"
                }
            </strong>

            <p>
                ${
                    flashcardShowingAnswer
                    ? escapeHTML(card.answer)
                    : escapeHTML(card.question)
                }
            </p>

            <small>
                Tap to flip · ${flashcardIndex + 1}/${flashcards.length}
            </small>

        </div>

        <div style="margin-top:10px;display:flex;gap:8px;">

            <button
                class="secondary-button"
                onclick="previousFlashcard()"
            >
                ← Previous
            </button>

            <button
                class="secondary-button"
                onclick="nextFlashcard()"
            >
                Next →
            </button>

        </div>

    `;

}


function flipFlashcard() {

    flashcardShowingAnswer =
        !flashcardShowingAnswer;

    renderFlashcard();

}


function nextFlashcard() {

    flashcardIndex =
        (flashcardIndex + 1) %
        flashcards.length;

    flashcardShowingAnswer = false;

    renderFlashcard();

}


function previousFlashcard() {

    flashcardIndex =
        (flashcardIndex - 1 +
            flashcards.length) %
        flashcards.length;

    flashcardShowingAnswer = false;

    renderFlashcard();

}


function generateQuiz() {

    const input =
        document.getElementById("quizInput")
            .value.trim();

    const output =
        document.getElementById("quizOutput");


    const sentences =
        cleanSentences(input);


    if (!sentences.length) {

        output.innerHTML =
            "Paste some notes first ♡";

        return;

    }


    const questions =
        sentences.slice(0, 5);


    output.innerHTML = `

        <h4>✏️ Mini Quiz</h4>

        ${questions.map((sentence,index) => `

            <div class="quiz-question">

                <strong>
                    Question ${index + 1}
                </strong>

                <p>
                    Which statement best represents this idea?
                </p>

                <label>
                    <input
                        type="radio"
                        name="quiz${index}"
                        value="correct"
                    >
                    ${escapeHTML(sentence)}
                </label>

                <br>

                <label>
                    <input
                        type="radio"
                        name="quiz${index}"
                        value="wrong"
                    >
                    This information is unrelated.
                </label>

            </div>

        `).join("")}

        <button
            class="primary-button"
            style="margin-top:15px;"
            onclick="checkQuiz(${questions.length})"
        >
            Submit Quiz
        </button>

        <div id="quizResult"></div>

    `;

}


function checkQuiz(number) {

    let score = 0;


    for (let i = 0; i < number; i++) {

        const selected =
            document.querySelector(
                `input[name="quiz${i}"]:checked`
            );

        if (
            selected &&
            selected.value === "correct"
        ) {

            score++;

        }

    }


    document.getElementById("quizResult")
        .innerHTML = `

            <div class="motivation-note">

                🌷

                <p>
                    You scored ${score}/${number}!
                </p>

                ✿

            </div>

        `;

}


/* -----------------------------
   SECURITY HELPERS
----------------------------- */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* -----------------------------
   UPDATE EVERYTHING
----------------------------- */

function updateEverything() {

    updateDashboard();

    updateTodayDate();

    updateMotivation();

    renderDashboardEvents();

    renderUpcomingEvents();

    applyAvatar();

}


/* -----------------------------
   START APP
----------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateEverything();

        renderCalendar();

        renderResources();

        renderRoomBrowser();

        setTimerMode("stopwatch");

    }
);

console.log("Study Nook app.js is working!");
