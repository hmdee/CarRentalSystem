export default function adminLogOut() {
    localStorage.removeItem('admin')
    window.location.href = "../index.html";
  }