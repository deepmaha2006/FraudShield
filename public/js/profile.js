document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTICATION & GLOBAL VARS ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html?error=session_expired';
        return;
    }
    const DEFAULT_AVATAR = 'https://via.placeholder.com/128';

    // --- ELEMENT SELECTORS ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Profile Details
    const avatarImg = document.getElementById('avatarImg');
    const avatarInput = document.getElementById('avatarInput');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileJoined = document.getElementById('profileJoined');
    const updateProfileForm = document.getElementById('updateProfileForm');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');

    // Security
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    // Verification
    const docTypeSelect = document.getElementById('docTypeSelect');
    const docInputContainer = document.getElementById('docInputContainer');
    const verificationForm = document.getElementById('verificationForm');
    const verificationBadge = document.getElementById('verificationStatusBadge');
    const verificationStatusText = document.getElementById('verificationStatusText');
    const verificationFormContainer = document.getElementById('verification-form-container');
    const verificationStatusContainer = document.getElementById('verification-status-container');
    
    // Modals
    const avatarButton = document.getElementById('avatar-button');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModal');
    const removeAvatarBtn = document.getElementById('removeAvatarBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogoutBtn = document.getElementById('cancelLogout');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    
    // Generic Notification Modal
    const notificationModal = document.getElementById('notificationModal');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationMessage = document.getElementById('notificationMessage');
    const closeNotificationModal = document.getElementById('closeNotificationModal');

    // Notification Preferences Elements
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    const emailHighRiskToggle = document.getElementById('emailHighRiskToggle');
    const emailWeeklySummaryToggle = document.getElementById('emailWeeklySummaryToggle');

    // --- HELPER FUNCTIONS ---
    const showNotification = (title, message, type = 'info') => {
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        notificationIcon.innerHTML = '';
        notificationIcon.className = 'mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl';
        
        if (type === 'success') {
            notificationIcon.classList.add('bg-green-500/20', 'text-green-400');
            notificationIcon.innerHTML = '&#10003;'; // Checkmark
        } else if (type === 'error') {
            notificationIcon.classList.add('bg-red-500/20', 'text-red-400');
            notificationIcon.innerHTML = '&#10005;'; // X mark
        } else {
            notificationIcon.classList.add('bg-cyan-500/20', 'text-cyan-400');
            notificationIcon.innerHTML = '&#8505;'; // Info i
        }
        
        notificationModal.classList.remove('invisible', 'opacity-0');
    };
    if(closeNotificationModal) {
        closeNotificationModal.addEventListener('click', () => notificationModal.classList.add('invisible', 'opacity-0'));
    }


    // --- CORE LOGIC ---
    const loadUserProfile = async () => {
        try {
            const response = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/index.html?error=session_expired';
                }
                throw new Error('Could not fetch profile');
            }
            const user = await response.json();

            if(profileName) profileName.textContent = user.full_name;
            if(profileEmail) profileEmail.textContent = user.email;
            if(profileJoined) profileJoined.textContent = `Joined on: ${new Date(user.created_at).toLocaleDateString()}`;
            if(avatarImg) avatarImg.src = user.avatar_url || DEFAULT_AVATAR;
            
            if(fullNameInput) fullNameInput.value = user.full_name;
            if(phoneInput) phoneInput.value = user.phone_number || '';

            updateVerificationStatusUI(user.verification_status);

            if(emailHighRiskToggle) emailHighRiskToggle.checked = user.email_high_risk_enabled;
            if(emailWeeklySummaryToggle) emailWeeklySummaryToggle.checked = user.email_weekly_summary_enabled;

        } catch (error) {
            console.error('Error loading profile:', error);
            showNotification('Error', 'Could not load your profile data. Please refresh the page.', 'error');
        }
    };

    // --- CORRECTED TAB SWITCHING LOGIC ---
    const switchTab = (targetTabId) => {
        // Update button active states
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === targetTabId);
        });
        
        // Show/hide content panes
        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== `${targetTabId}-content`);
            content.classList.toggle('active', content.id === `${targetTabId}-content`);
        });
    };

    tabButtons.forEach(button => {
        // Exclude logout button from tab logic
        if (button.id === 'logoutBtn') return;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.dataset.tab;
            switchTab(tabId);
            // Update URL hash for deep-linking without causing a page jump
            history.pushState(null, '', `#${tabId}`);
        });
    });

    // Handle page load with a hash in the URL or default to 'profile'
    const currentHash = window.location.hash.substring(1) || 'profile';
    const targetButton = document.querySelector(`.tab-button[data-tab="${currentHash}"]`);
    if (targetButton) {
        switchTab(currentHash);
    } else {
        switchTab('profile'); // Default to profile if hash is invalid
    }


    // --- FORM SUBMISSIONS ---
    if(updateProfileForm) {
        updateProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                fullName: fullNameInput.value,
                phone: phoneInput.value
            };
            try {
                const response = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                showNotification('Success', result.message, 'success');
                if(profileName) profileName.textContent = data.fullName;
            } catch (error) {
                showNotification('Error', error.message, 'error');
            }
        });
    }

    if(changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            if (data.newPassword.length < 6) {
                showNotification('Error', 'New password must be at least 6 characters long.', 'error');
                return;
            }
            try {
                const response = await fetch('/api/user/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                showNotification('Success', result.message, 'success');
                e.target.reset();
            } catch (error) {
                showNotification('Error', error.message, 'error');
            }
        });
    }

    if(savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', async () => {
            const data = {
                emailHighRisk: emailHighRiskToggle.checked,
                emailWeeklySummary: emailWeeklySummaryToggle.checked,
            };
            try {
                const response = await fetch('/api/user/preferences', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message);
                showNotification('Success', result.message, 'success');
            } catch (error) {
                showNotification('Error', error.message, 'error');
                loadUserProfile(); // Revert toggles to saved state on error
            }
        });
    }

    // --- AVATAR MODAL & ACTIONS ---
    const openModal = (modal) => modal && modal.classList.remove('invisible', 'opacity-0');
    const closeModal = (modal) => modal && modal.classList.add('invisible', 'opacity-0');

    if(avatarButton) avatarButton.addEventListener('click', () => openModal(avatarModal));
    if(closeAvatarModalBtn) closeAvatarModalBtn.addEventListener('click', () => closeModal(avatarModal));
    if(removeAvatarBtn) removeAvatarBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/user/remove-picture', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            if(avatarImg) avatarImg.src = DEFAULT_AVATAR;
            showNotification('Success', result.message, 'success');
            closeModal(avatarModal);
        } catch (error) {
            showNotification('Error', error.message, 'error');
        }
    });

    if(avatarInput) avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { // 2MB
            showNotification('Error', 'File is too large. Maximum size is 2MB.', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const response = await fetch('/api/user/upload-picture', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Upload failed');
            if(avatarImg) avatarImg.src = result.avatarUrl;
            showNotification('Success', result.message, 'success');
            closeModal(avatarModal);
        } catch (error) {
            showNotification('Error', error.message, 'error');
        }
    });

    // --- IDENTITY VERIFICATION ---
    const docInputs = {
        Aadhaar: `<input name="docNumber" type="text" placeholder="Aadhaar Number (12 digits)" pattern="\\d{12}" title="Enter 12-digit Aadhaar number" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
        PAN: `<input name="docNumber" type="text" placeholder="PAN Number" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Enter valid PAN number" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
        DL: `<input name="docNumber" type="text" placeholder="Driving License Number" required class="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">`,
    };
    if(docTypeSelect) docTypeSelect.addEventListener('change', e => {
        if(docInputContainer) docInputContainer.innerHTML = docInputs[e.target.value] || '';
    });
    if(docInputContainer) docInputContainer.innerHTML = docInputs['Aadhaar']; // Set initial input

    if(verificationForm) verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        try {
            const response = await fetch('/api/user/verify-identity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            showNotification('Success', result.message, 'success');
            updateVerificationStatusUI('Pending');
        } catch (error) {
            showNotification('Error', error.message, 'error');
        }
    });

    const updateVerificationStatusUI = (status) => {
        if (!verificationBadge) return;
        verificationBadge.textContent = status;
        verificationBadge.className = 'px-3 py-1 rounded-full text-sm font-semibold'; // Reset
        
        if (status === 'Approved' || status === 'Pending') {
            if(verificationFormContainer) verificationFormContainer.classList.add('hidden');
            if(verificationStatusContainer) verificationStatusContainer.classList.remove('hidden');
            if(verificationStatusText) verificationStatusText.textContent = status.toLowerCase();
        } else { // Rejected or Not Submitted
            if(verificationFormContainer) verificationFormContainer.classList.remove('hidden');
            if(verificationStatusContainer) verificationStatusContainer.classList.add('hidden');
        }

        if (status === 'Approved') verificationBadge.classList.add('bg-green-500/20', 'text-green-400');
        else if (status === 'Pending') verificationBadge.classList.add('bg-yellow-500/20', 'text-yellow-400');
        else if (status === 'Rejected') verificationBadge.classList.add('bg-red-500/20', 'text-red-400');
        else verificationBadge.classList.add('bg-gray-600', 'text-gray-300');
    };

    // --- LOGOUT MODAL ---
    if(logoutBtn) logoutBtn.addEventListener('click', () => openModal(logoutModal));
    if(cancelLogoutBtn) cancelLogoutBtn.addEventListener('click', () => closeModal(logoutModal));
    if(confirmLogoutBtn) confirmLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('alertHistory');
        localStorage.removeItem('userStats');
        localStorage.removeItem('chartData');
        window.location.href = '/index.html';
    });

    // --- INITIAL LOAD ---
    loadUserProfile();
});