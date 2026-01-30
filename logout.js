
const logoutButton = document.getElementById('logoutButton');
const relocateButton = document.getElementById('relocateButton');

const logout = () => {
  localStorage.clear();
  window.location.href = 'index.html';
}

const relocate = () => {
  window.location.href = 'location.html';
}

logoutButton.addEventListener('click', logout);
relocateButton.addEventListener('click', relocate);
