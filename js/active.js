document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    document.querySelectorAll('#menu .nav-link').forEach(link => {
      link.classList.toggle('active', link.href === currentUrl);
    });
  });
