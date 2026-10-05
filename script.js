// Get all DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect"); 
const totalCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const winnersLabel = document.getElementById("winnersLabel");
const storageKey = "intelEventCheckIn";

// Track attendance
let count = 0;
const maxCount = 5;
let attendanceData = {
  count: 0,
  teams: {
    water: { count: 0, attendees: [] },
    zero: { count: 0, attendees: [] },
    power: { count: 0, attendees: [] }
  },
  message: "",
  isCelebration: false,
  winningTeams: []
};

function saveAttendance() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(attendanceData));
  } catch (error) {
    console.error("Unable to save attendance data.", error);
  }
}

function getWinningTeams() {
  const teamCards = document.querySelectorAll(".team-card");
  let highestTeamCount = 0;
  let winningTeams = [];

  for (let i = 0; i < teamCards.length; i++) {
    const teamName = teamCards[i].querySelector(".team-name").textContent;
    const teamKey = teamCards[i].classList[1];
    const teamCount = attendanceData.teams[teamKey].count;

    if (teamCount > highestTeamCount) {
      highestTeamCount = teamCount;
      winningTeams = [teamName];
    } else if (teamCount === highestTeamCount) {
      winningTeams.push(teamName);
    }
  }

  return winningTeams;
}

function showGreeting() {
  greeting.classList.remove("celebration-message");
  greeting.style.display = "block";

  if (attendanceData.isCelebration) {
    greeting.textContent = attendanceData.winningTeams.length > 1
      ? "🎉 Congratulations! The winning teams are "
      : "🎉 Congratulations! The winning team is ";
    const winners = document.createElement("strong");
    winners.textContent = attendanceData.winningTeams.join(" and ");
    greeting.appendChild(winners);
    greeting.appendChild(document.createTextNode("!"));
    greeting.classList.add("celebration-message");
    return;
  }

  greeting.textContent = attendanceData.message;
}

function renderAttendance() {
  count = attendanceData.count;
  totalCount.textContent = count;
  progressBar.style.width = `${Math.round((count/maxCount) * 100)}%`;

  const teamKeys = ["water", "zero", "power"];
  for (let i = 0; i < teamKeys.length; i++) {
    const teamKey = teamKeys[i];
    const team = attendanceData.teams[teamKey];
    const teamCard = document.querySelector(`.team-card.${teamKey}`);
    const teamName = teamCard.querySelector(".team-name").textContent;
    document.getElementById(`${teamKey}Count`).textContent = team.count;
    const attendeeList = document.getElementById(`${teamKey}Attendees`);
    attendeeList.textContent = "";
    teamCard.classList.remove("winning-team");

    if (attendanceData.winningTeams.includes(teamName)) {
      teamCard.classList.add("winning-team");
    }

    for (let j = 0; j < team.attendees.length; j++) {
      const attendee = document.createElement("li");
      attendee.textContent = team.attendees[j];
      attendeeList.appendChild(attendee);
    }
  }

  winnersLabel.style.display = attendanceData.winningTeams.length > 0 ? "block" : "none";

  if (attendanceData.message || attendanceData.isCelebration) {
    showGreeting();
  }
}

function loadAttendance() {
  try {
    const savedAttendance = localStorage.getItem(storageKey);

    if (savedAttendance) {
      attendanceData = JSON.parse(savedAttendance);
      attendanceData.isCelebration = false;
    }
  } catch (error) {
    console.error("Unable to load saved attendance data.", error);
  }

  renderAttendance();
}

// Restore saved attendance when the page opens
loadAttendance();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  attendanceData.count++;
  attendanceData.teams[team].count++;
  attendanceData.teams[team].attendees.push(name);
  attendanceData.message = `🎉 Welcome, ${name} from ${teamName}!`;
  attendanceData.isCelebration = false;

  if (attendanceData.count === maxCount) {
    attendanceData.winningTeams = getWinningTeams();
    attendanceData.isCelebration = true;
    console.log(`Winning team(s): ${attendanceData.winningTeams.join(" and ")}`);
  } else {
    attendanceData.isCelebration = false;
  }

  saveAttendance();
  renderAttendance();
  console.log(`Total check-ins: ${attendanceData.count}`);
  console.log(`${name} added to ${teamName} list.`);

  form.reset();
});