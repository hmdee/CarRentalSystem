const themeIcon = document.getElementById("themeIcon");
export default function ToggleTheme()
{
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    if (themeIcon.classList.contains("bi-brightness-high")) {
        themeIcon.classList.remove("bi-brightness-high");
        themeIcon.classList.add("bi-moon");
    } else if (themeIcon.classList.contains("bi-moon")) {
        themeIcon.classList.remove("bi-moon");
        themeIcon.classList.add("bi-brightness-high");
    }
    const newTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
}