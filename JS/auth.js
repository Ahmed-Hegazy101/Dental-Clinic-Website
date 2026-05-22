
// ===== state =====
let currentUser = JSON.parse(localStorage.getItem('dentacare_user') || 'null');

// ===== init =====
window.addEventListener('DOMContentLoaded', () => {
  updateNavState();
});

function updateNavState() {
  const loginBtn = document.getElementById('loginBtn');
  const navAvatar = document.getElementById('navAvatar');
  if (!loginBtn || !navAvatar) return;
  if (currentUser) {
    loginBtn.style.display = 'none';
    navAvatar.style.display = 'flex';
    document.getElementById('avatarInitial').textContent = currentUser.firstName[0].toUpperCase();
  } else {
    loginBtn.style.display = 'flex';
    navAvatar.style.display = 'none';
  }
}


function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  switchTab('signup');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
function switchTab(tab) {
  const signin = document.getElementById('signinForm');
  const signup = document.getElementById('signupForm');
  const siTab = document.getElementById('signinTab');
  const suTab = document.getElementById('signupTab');
  if (tab === 'signin') {
    signin.style.display = 'block';
    signup.style.display = 'none';
    siTab.classList.add('active');
    suTab.classList.remove('active');
  } else {
    signin.style.display = 'none';
    signup.style.display = 'block';
    suTab.classList.add('active');
    siTab.classList.remove('active');
  }
}

// ===== Auth =====
function handleSignUp() {
  const first = document.getElementById('suFirst').value.trim();
  const last = document.getElementById('suLast').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const pass = document.getElementById('suPassword').value;
  const confirm = document.getElementById('suConfirm').value;
  const err = document.getElementById('suError');

  if (!first || !last || !email || !pass) { err.textContent = 'Please fill all required fields.'; return; }
  if (pass.length < 8) { err.textContent = 'Password must be at least 8 characters.'; return; }
  if (pass !== confirm) { err.textContent = 'Passwords do not match.'; return; }

  currentUser = { firstName: first, lastName: last, email, phone, password: pass };
  localStorage.setItem('dentacare_user', JSON.stringify(currentUser));
  err.textContent = '';
  closeModal();
  updateNavState();
}

function handleSignIn() {
  const email = document.getElementById('siEmail').value.trim();
  const pass = document.getElementById('siPassword').value;
  const err = document.getElementById('siError');
  const saved = JSON.parse(localStorage.getItem('dentacare_user') || 'null');

  if (!saved) { err.textContent = 'No account found. Please create one.'; return; }
  if (saved.email !== email || saved.password !== pass) { err.textContent = 'Incorrect email or password.'; return; }

  currentUser = saved;
  err.textContent = '';
  closeModal();
  updateNavState();
}

function signOut() {
  currentUser = null;
  hideProfilePage();
  updateNavState();
}

// ===== Profile page =====
function goToProfile() {
  document.getElementById('profilePage').style.display = 'block';
  document.body.classList.add('profile-active');
  
  document.getElementById('profileAvatar').textContent = currentUser.firstName[0].toUpperCase();
  document.getElementById('profileName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
  document.getElementById('profileEmail').textContent = currentUser.email;
 
  document.getElementById('editFirst').value = currentUser.firstName;
  document.getElementById('editLast').value = currentUser.lastName;
  document.getElementById('editEmail').value = currentUser.email;
  document.getElementById('editPhone').value = currentUser.phone || '';
  switchSection('appointments');
  window.scrollTo(0, 0);
}

function hideProfilePage() {
  document.getElementById('profilePage').style.display = 'none';
  document.body.classList.remove('profile-active');
}

function switchSection(name) {
  ['appointments', 'prescriptions', 'editprofile'].forEach(s => {
    document.getElementById('section-' + s).style.display = (s === name) ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-item:not(.signout-item)').forEach((el, i) => {
    el.classList.remove('active');
    if (['appointments','prescriptions','editprofile'][i] === name) el.classList.add('active');
  });
}

function saveProfile() {
  const first = document.getElementById('editFirst').value.trim();
  const last = document.getElementById('editLast').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  if (!first || !last || !email) { return; }
  currentUser = { ...currentUser, firstName: first, lastName: last, email, phone };
  localStorage.setItem('dentacare_user', JSON.stringify(currentUser));
  document.getElementById('profileAvatar').textContent = first[0].toUpperCase();
  document.getElementById('avatarInitial').textContent = first[0].toUpperCase();
  document.getElementById('profileName').textContent = first + ' ' + last;
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('editSuccess').textContent = 'Profile updated successfully!';
  setTimeout(() => document.getElementById('editSuccess').textContent = '', 3000);
}
