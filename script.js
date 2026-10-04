// Get all DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect"); 

// Track attendance
let count = 0;
const maxCount = 5;


// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  let greeting = document.getElementById("greeting");
  let totalCount = document.getElementById("attendeeCount");
  let progressBar = document.getElementById("progressBar");

  console.log(name, teamName);

  // Increment attendance count
  count++;
  totalCount.textContent = count;
  console.log("Total check-ins: " + count);

  // Update progress bar
  const percentage = Math.round((count/maxCount) * 100) + "%";
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  console.log(`${teamName} count: ${teamCounter.textContent}`);

  // Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.remove("celebration-message");
  greeting.style.display = "block";
  console.log(message);

  // Celebrate the winning team when the maximum is reached
  if (count === maxCount) {
    const teamCards = document.querySelectorAll(".team-card");
    let highestTeamCount = 0;
    let winningTeams = [];

    for (let i = 0; i < teamCards.length; i++) {
      const teamCount = parseInt(teamCards[i].querySelector(".team-count").textContent);

      if (teamCount > highestTeamCount) {
        highestTeamCount = teamCount;
        winningTeams = [teamCards[i].querySelector(".team-name").textContent];
      } else if (teamCount === highestTeamCount) {
        winningTeams.push(teamCards[i].querySelector(".team-name").textContent);
      }
    }

    greeting.textContent = winningTeams.length > 1
      ? "🎉 Congratulations! The winning teams are "
      : "🎉 Congratulations! The winning team is ";

    const winners = document.createElement("strong");
    winners.textContent = winningTeams.join(" and ");
    greeting.appendChild(winners);
    greeting.appendChild(document.createTextNode("!"));
    greeting.classList.add("celebration-message");
  }

  form.reset();
})