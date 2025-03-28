// utils/timeUtils.js

function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    const pad = (n) => String(n).padStart(2, '0');
  
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  
  module.exports = { formatDuration };