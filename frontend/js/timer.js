let startTime, timerInterval;

export function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function() {
      let totalSeconds = Math.floor((Date.now() - startTime) / 1000);
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      let timeDisplay = document.getElementById('timeDisplay');
      let timerDisplay = document.getElementById('timerDisplay');
      let timeText = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timeDisplay.textContent = timeText;
      timerDisplay.textContent = timeText;
    }, 1000);
  }
  
  export function stopTimer() {
    clearInterval(timerInterval);
    let timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = ''; // clear the timer
  }