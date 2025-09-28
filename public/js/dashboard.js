document.addEventListener('DOMContentLoaded', () => {
    // --- YOUR EXISTING CODE (PRESERVED) ---
    // --- AUTHENTICATION & REDIRECT HANDLING ---
    const handleAuthRedirect = () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userStr = params.get('user');
        if (token && userStr) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', decodeURIComponent(userStr));
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    };
    handleAuthRedirect();

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    // --- DOM ELEMENTS ---
    const userNameSpan = document.getElementById('userName');

    // --- PERSONALIZE THE DASHBOARD ---
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name && userNameSpan) {
            userNameSpan.textContent = user.name.split(' ')[0];
        }
    } catch (e) {
        console.error("Could not parse user data from localStorage", e);
    }
    
    // --- DYNAMIC RECENT ALERTS LOGIC ---
    const loadRecentAlerts = () => {
        const listContainer = document.getElementById('recent-alerts-list');
        const noAlertsMessage = document.getElementById('no-alerts-message');
        const history = JSON.parse(localStorage.getItem('alertHistory')) || [];

        if (history.length === 0) {
            noAlertsMessage.classList.remove('hidden');
            listContainer.classList.add('hidden');
            return;
        }
        
        noAlertsMessage.classList.add('hidden');
        listContainer.classList.remove('hidden');

        const recentAlerts = history.slice(-5).reverse();
        listContainer.innerHTML = recentAlerts.map(alert => {
            let colorClass = 'text-green-400';
            if (alert.verdict === 'High Risk') colorClass = 'text-red-400';
            else if (alert.verdict === 'Suspicious') colorClass = 'text-yellow-400';

            const formattedDate = new Date(alert.timestamp).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            return `
                <li class="p-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors">
                    <div>
                        <p class="font-semibold text-white">Analyzed ${alert.type}</p>
                        <p class="text-sm text-gray-400">${formattedDate}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-lg ${colorClass}">${alert.verdict}</p>
                        <p class="text-sm text-gray-500">Score: ${alert.score}</p>
                    </div>
                </li>
            `;
        }).join('');
    };

    // --- DYNAMIC CHART LOGIC ---
    const createChart = () => {
        const history = JSON.parse(localStorage.getItem('alertHistory')) || [];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const chartData = {
            labels: [],
            threats: [],
            legit: []
        };
        
        const dailyCounts = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            chartData.labels.push(label);
            dailyCounts[label] = { threats: 0, legit: 0 };
        }

        history.forEach(item => {
            const itemDate = new Date(item.timestamp);
            if (itemDate >= sevenDaysAgo) {
                const label = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
                if (dailyCounts[label]) {
                    if (item.verdict === 'High Risk' || item.verdict === 'Suspicious') {
                        dailyCounts[label].threats++;
                    } else {
                        dailyCounts[label].legit++;
                    }
                }
            }
        });

        for (const label of chartData.labels) {
            chartData.threats.push(dailyCounts[label].threats);
            chartData.legit.push(dailyCounts[label].legit);
        }

        const createMergedChart = (canvasId, threatsData, legitData) => {
            const ctx = document.getElementById(canvasId).getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Threats',
                            data: threatsData,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#ef4444',
                            pointRadius: 4,
                        },
                        {
                            label: 'Legitimate',
                            data: legitData,
                            borderColor: '#06b6d4',
                            backgroundColor: 'rgba(6, 182, 212, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#06b6d4',
                            pointRadius: 4,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { 
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#9ca3af',
                                boxWidth: 12,
                                padding: 20
                            }
                        } 
                    },
                    scales: {
                        x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                        y: { 
                            ticks: { color: '#6b7280', stepSize: 1 }, 
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }, 
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        createMergedChart('activityChart', chartData.threats, chartData.legit);
    }
    
    // --- INITIAL DATA LOAD ---
    loadRecentAlerts();
    createChart();
    // --- END OF YOUR EXISTING CODE ---


    // *** ADDED: "Coming Soon" Modal Logic ***
    const comingSoonModal = document.getElementById('comingSoonModal');
    const modalContent = comingSoonModal.querySelector('div');
    const protectBtn = document.getElementById('protectEmailSmsBtn'); // Using the new div ID
    const closeModalBtn = comingSoonModal.querySelector('.close-modal');

    const openModal = () => {
        comingSoonModal.classList.remove('invisible', 'opacity-0');
        setTimeout(() => {
             modalContent.classList.remove('scale-95', 'opacity-0');
        }, 20);
    };

    const closeModal = () => {
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            comingSoonModal.classList.add('invisible', 'opacity-0');
        }, 300);
    };
    
    protectBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    comingSoonModal.addEventListener('click', (e) => {
        if (e.target === comingSoonModal) {
            closeModal();
        }
    });
    // *** END OF ADDED SECTION ***
});