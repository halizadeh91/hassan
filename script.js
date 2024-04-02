const toggleBtn = document.getElementById('mobile-btn');
const naviList = document.getElementById('navi-list');
toggleBtn.addEventListener('click', () => { naviList.classList.toggle("active"); });