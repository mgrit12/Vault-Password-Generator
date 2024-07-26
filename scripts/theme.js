// theme.js
document.getElementById('customSwitch1').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked); // Add or remove dark-mode based on checkbox

    // Save the current theme to localStorage
    localStorage.setItem('theme', this.checked ? 'dark' : 'light');
});

// Check local storage for theme and update the checkbox and body class accordingly
document.addEventListener('DOMContentLoaded', (event) => {
    const currentTheme = localStorage.getItem('theme');
    const themeCheckbox = document.getElementById('customSwitch1');
    themeCheckbox.checked = currentTheme === 'dark';
    document.body.classList.toggle('dark-mode', themeCheckbox.checked);
});