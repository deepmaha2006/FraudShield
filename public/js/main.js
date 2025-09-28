// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins for use
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- GLOBAL ELEMENTS ---
    const modals = {
        login: document.getElementById('loginModal'),
        signup: document.getElementById('signupModal'),
        verification: document.getElementById('verificationModal'),
    };
    const authButtons = document.getElementById('auth-buttons');
    const userProfileDiv = document.getElementById('user-profile');
    const notificationModal = document.getElementById('notificationModal');
    const notificationContent = document.getElementById('notificationContent');
    let notificationTimeout;

    // --- STATE MANAGEMENT ---
    function checkLoginState() {
        const token = localStorage.getItem('authToken');
        const getProtectedBtn = document.getElementById('getProtectedBtn');
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (token) {
            authButtons.classList.add('hidden');
            userProfileDiv.classList.remove('hidden');
            getProtectedBtn && getProtectedBtn.classList.add('hidden');
            dashboardBtn && dashboardBtn.classList.remove('hidden');
        } else {
            authButtons.classList.remove('hidden');
            userProfileDiv.classList.add('hidden');
            getProtectedBtn && getProtectedBtn.classList.remove('hidden');
            dashboardBtn && dashboardBtn.classList.add('hidden');
        }
    }
    checkLoginState();

    // --- MODAL, FORM, AND NOTIFICATION LOGIC ---
    const openButtons = {
        login: document.getElementById('loginBtn'),
        signup: document.getElementById('signupBtn'),
        getProtected: document.getElementById('getProtectedBtn'),
        verify: document.getElementById('verifyBtn'),
    };
    const allCloseButtons = document.querySelectorAll('.close-modal');

    function openModal(modal) {
        if (modal) modal.classList.remove('invisible', 'opacity-0');
    }
    function closeModal(modal) {
        if (modal) modal.classList.add('invisible', 'opacity-0');
    }
    openButtons.login && openButtons.login.addEventListener('click', () => openModal(modals.login));
    openButtons.signup && openButtons.signup.addEventListener('click', () => openModal(modals.signup));
    openButtons.getProtected && openButtons.getProtected.addEventListener('click', () => openModal(modals.signup));
    openButtons.verify && openButtons.verify.addEventListener('click', () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            openModal(modals.verification);
        } else {
            showNotification('Please log in or sign up to verify your identity.', 'bg-blue-500');
            openModal(modals.login);
        }
    });

    allCloseButtons.forEach(button => button.addEventListener('click', e => closeModal(e.target.closest('.modal'))));
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) closeModal(e.target);
    });

    function showNotification(message, bgColor) {
        clearTimeout(notificationTimeout);
        notificationContent.textContent = message;
        notificationContent.className = `p-4 rounded-lg text-white font-semibold ${bgColor}`;
        notificationModal.classList.remove('invisible', 'opacity-0');
        notificationTimeout = setTimeout(() => notificationModal.classList.add('invisible', 'opacity-0'), 5000);
    }

    // --- SIGNUP FORM LOGIC ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const data = Object.fromEntries(new FormData(signupForm).entries());
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            showNotification('Creating your account...', 'bg-blue-500');
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    showNotification(result.message, 'bg-green-500');
                    signupForm.reset();
                    setTimeout(() => {
                        closeModal(modals.signup);
                        openModal(modals.login);
                    }, 2000);
                } else {
                    showNotification(result.message, 'bg-red-500');
                }
            } catch (error) {
                showNotification('Could not connect to the server.', 'bg-red-500');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        });
    }

    // --- LOGIN FORM LOGIC ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const data = Object.fromEntries(new FormData(loginForm).entries());
            submitButton.disabled = true;
            submitButton.textContent = 'Logging In...';
            showNotification('Logging you in...', 'bg-blue-500');
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    showNotification(result.message, 'bg-green-500');
                    loginForm.reset();
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showNotification(result.message, 'bg-red-500');
                }
            } catch (error) {
                showNotification('Could not connect to the server.', 'bg-red-500');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Log In';
            }
        });
    }

    // --- NEW VERIFICATION FORM LOGIC FOR INDEX PAGE MODAL ---
    const verificationForm = document.getElementById('verificationForm');
    const docTypeSelect = document.getElementById('docTypeSelect');
    const docInputContainer = document.getElementById('docInputContainer');

    if (verificationForm && docTypeSelect && docInputContainer) {
        const docInputs = {
            Aadhaar: `<input name="docNumber" type="text" placeholder="Aadhaar Number (12 digits)" pattern="\\d{12}" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
            PAN: `<input name="docNumber" type="text" placeholder="PAN Number e.g., ABCDE1234F" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
            DL: `<input name="docNumber" type="text" placeholder="Driving License Number" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
            Passport: `<input name="docNumber" type="text" placeholder="Passport Number" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
        };
        docTypeSelect.addEventListener('change', e => {
            docInputContainer.innerHTML = docInputs[e.target.value] || '';
        });
        verificationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('authToken');
            if (!token) {
                showNotification('You must be logged in to submit.', 'bg-red-500');
                return;
            }
            const data = Object.fromEntries(new FormData(verificationForm).entries());
            showNotification('Submitting for verification...', 'bg-blue-500');
            try {
                const response = await fetch('/api/user/verify-identity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    showNotification(result.message, 'bg-green-500');
                    verificationForm.reset();
                    docInputContainer.innerHTML = '';
                    setTimeout(() => {
                        closeModal(modals.verification);
                        window.location.href = 'profile.html#verification';
                    }, 2000);
                } else {
                    showNotification(result.message, 'bg-red-500');
                }
            } catch (error) {
                showNotification('Server error. Could not submit for verification.', 'bg-red-500');
            }
        });
    }

    // --- SUPPORT FORM LOGIC ---
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = supportForm.querySelector('button[type="submit"]');
            showNotification('Submitting your ticket...', 'bg-blue-500');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            const data = Object.fromEntries(new FormData(supportForm).entries());
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) headers['Authorization'] = `Bearer ${token}`;
            try {
                const response = await fetch('/api/support', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    showNotification('Support ticket submitted!', 'bg-green-500');
                    supportForm.reset();
                } else {
                    const result = await response.json();
                    showNotification(`Error: ${result.message}`, 'bg-red-500');
                }
            } catch (error) {
                showNotification('Could not connect to the server.', 'bg-red-500');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Ticket';
            }
        });
    }

    // --- SCROLL AND HEADER ANIMATIONS ---
    if (window.gsap && window.ScrollTrigger) {
        // Animate content sections fading in as they enter the viewport
        gsap.set('.fade-in-section', { opacity: 0, y: 50 });
        ScrollTrigger.batch(".fade-in-section", {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.2, ease: "power2.out" }),
            onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 50, stagger: 0.1 }),
            start: "top 85%",
            end: "bottom 15%",
        });
    }

    // Pro Header Animation
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('py-2', 'bg-gray-900/80');
                header.classList.remove('py-4');
            } else {
                header.classList.add('py-4');
                header.classList.remove('py-2', 'bg-gray-900/80');
            }
        });
    }
});