document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('dark-mode');
        themeIcon.classList.replace('bi-brightness-high', 'bi-moon-fill');
    }

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark-mode');
        if (htmlElement.classList.contains('dark-mode')) {
            themeIcon.classList.replace('bi-brightness-high', 'bi-moon-fill');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('bi-moon-fill', 'bi-brightness-high');
            localStorage.setItem('theme', 'light');
        }
    });
});