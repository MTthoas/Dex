export function formatTimeRemaining(timeRemaining) {
    const totalSeconds = Number(timeRemaining);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return { hours, minutes, seconds };
  }