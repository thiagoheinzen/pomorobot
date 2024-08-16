// Waits for the DOM to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Selects DOM elements
  const html = document.querySelector("html");
  const focusButton = document.querySelector(".app__card-button--focus");
  const focusDurationInput = document.querySelector("#focus-duration");
  const shortBreakButton = document.querySelector(".app__card-button--short");
  const longBreakButton = document.querySelector(".app__card-button--long");
  const banner = document.querySelector(".app__image");
  const title = document.querySelector(".app__title");
  const buttons = document.querySelectorAll(".app__card-button");
  const startPauseButton = document.querySelector("#start-pause span");
  const startPauseButtonIcon = document.querySelector(
    "#start-pause img.app__card-primary-button-icon"
  );
  const displayTime = document.querySelector("#timer");
  const playIcon = "/images/play_arrow.png";
  const pauseIcon = "/images/pause.png";
  const focusMusicInput = document.querySelector("#toggle-music");
  const music = new Audio(
    "/sounds/healing-meditation-ringing-background-music-for-meditation-200223.mp3"
  );
  const audioPlay = new Audio("/sounds/play.mp3");
  const audioPause = new Audio("/sounds/pause.mp3");
  const audioBeep = new Audio("/sounds/beep.mp3");

  // Variables to control time and interval
  let elapsedTimeInSeconds = 1500; // Initial time in seconds (25 minutes)
  let intervalId = null; // Interval ID to pause and resume

  // Background audio setup
  music.loop = true;

  // Event for changing the background music input
  focusMusicInput.addEventListener("change", () => {
    if (music.paused) {
      music.play();
    } else {
      music.pause();
    }
  });

  // Function to reset the timer
  function reset() {
    clearInterval(intervalId);
    startPauseButton.textContent = "Começar";
    intervalId = null;
    startPauseButtonIcon.src = playIcon;
  }

  // Function to display formatted time
  function showTime() {
    const time = new Date(elapsedTimeInSeconds * 1000);
    const formattedTime = time.toLocaleString("pt-Br", {
      minute: "2-digit",
      second: "2-digit",
    });
    displayTime.innerHTML = `${formattedTime}`;
  }

  // Function to change context based on interval type (focus, short break, long break)
  function changeContext(context) {
    showTime();
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    html.setAttribute("data-context", context);
    banner.setAttribute("src", `/images/${context}.png`);
    switch (context) {
      case "focus":
        title.innerHTML = `
                Concentre-se nas tarefas.<br>
                Elimine as distrações.<br>
                    <strong class="app__title-strong">Mantenha o fluxo.</strong>
                    `;
        break;
      case "short-break":
        title.innerHTML = `
                Levante-se e movimente-se.<br>
                Relaxe a mente.<br>
                    <strong class="app__title-strong">Recarregue as energias.</strong>
                `;
        break;
      case "long-break":
        title.innerHTML = `
                Faça algo que você goste.<br>
                Desconecte-se do trabalho.<br>
                    <strong class="app__title-strong">Volte revigorado.</strong>
                `;
        break;
      default:
        break;
    }
  }

  // Function for countdown
  function countdown() {
    if (elapsedTimeInSeconds <= 0) {
      audioBeep.play();
      const isFocused = html.getAttribute("data-context") == "focus";
      if (isFocused) {
        const event = new CustomEvent("FocusFinished");
        document.dispatchEvent(event);
      }
      reset();
      return;
    }
    elapsedTimeInSeconds -= 1;
    showTime();
  }

  // Function to start or pause the timer
  function startOrPause() {
    if (intervalId) {
      audioPause.play();
      reset();
      return;
    }
    audioPlay.play();
    intervalId = setInterval(countdown, 1000);
    startPauseButton.textContent = "Pausar";
    startPauseButtonIcon.src = pauseIcon;
  }

  // Click event for focus button
  focusButton.addEventListener("click", () => {
    // Convert the input value to seconds
    const focusDurationMinutes = parseInt(focusDurationInput.value, 10);
    elapsedTimeInSeconds = focusDurationMinutes * 60; // Convert minutes to seconds
    changeContext("focus"); // Change context to focus
    focusButton.classList.add("active"); // Add active class to focus button
  });
  

  // Click event for short break button
  shortBreakButton.addEventListener("click", () => {
    elapsedTimeInSeconds = 300; // Set time to 5 minutes
    changeContext("short-break"); // Change context to short break
    shortBreakButton.classList.add("active"); // Add active class to short break button
  });

  // Click event for long break button
  longBreakButton.addEventListener("click", () => {
    elapsedTimeInSeconds = 900; // Set time to 15 minutes
    changeContext("long-break"); // Change context to long break
    longBreakButton.classList.add("active"); // Add active class to long break button
  });

  // Click event for start/pause button
  startPauseButton.addEventListener("click", startOrPause);

  // Display initial time
  showTime();
});
