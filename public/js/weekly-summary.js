document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    // DOM Elements
    const dateRangeEl = document.getElementById('summary-date-range');
    const totalScansEl = document.getElementById('summaryTotalScans');
    const threatsEl = document.getElementById('summaryThreats');
    const legitEl = document.getElementById('summaryLegit');
    const breakdownContainerEl = document.getElementById('breakdown-container');
    const noSummaryMessageEl = document.getElementById('no-summary-message');
    const summaryContentEl = document.getElementById('summary-content');
    const insightsContentEl = document.getElementById('insights-content');
    const adviceListEl = document.getElementById('advice-list');
    const chartCanvas = document.getElementById('threatDonutChart');

    const generateInsightAndAdvice = (stats) => {
        let insights = { p1: '', p2: '' };
        let advice = [];
        const threatRatio = stats.totalScans > 0 ? stats.threats / stats.totalScans : 0;

        if (stats.totalScans === 0) {
            insights.p1 = "You haven't scanned any items this week. Your report is currently empty.";
            insights.p2 = "To get started, find a suspicious SMS, email, or link and use the Analyzer tool. Your activity not only protects you but also strengthens our community's defense.";
            advice.push('Make it a habit to analyze any message that asks for personal information or creates a sense of urgency.');
            advice.push('Start by checking links in old promotional emails you were unsure about.');
        } else if (stats.threats === 0) {
            insights.p1 = `Excellent work! This week, you analyzed ${stats.totalScans} items, and none were flagged as potential threats. This is a strong indicator of your high level of digital safety awareness.`;
            insights.p2 = 'Your vigilance is your best defense. Continue to be cautious and scan anything that seems even slightly suspicious. Your proactive approach is a model for security.';
            advice.push('Double-check sender email addresses to ensure they match the official domain of the company.');
            advice.push('Continue to use the FraudShield analyzer for any message that feels "off" to maintain your excellent security record.');
        } else if (threatRatio <= 0.3) {
            insights.p1 = `Good job this week. You analyzed ${stats.totalScans} items, and only ${stats.threats} were flagged as a potential threat. The majority of your activity was safe, suggesting you are effectively avoiding common phishing attempts.`;
            insights.p2 = 'Your proactive scanning is paying off by helping you filter out suspicious content. The threats you did encounter were mostly low to moderate risk, which is a positive sign.';
            advice.push('Review the flagged items to understand the common patterns of scams you are being targeted with.');
            advice.push('Be extra cautious with messages demanding urgent action, as this is a common tactic you encountered.');
        } else {
            insights.p1 = `This week reflects a high level of exposure to potential threats. Of the ${stats.totalScans} items you analyzed, ${stats.threats} were flagged as suspicious or high-risk. This indicates you are a frequent target for scammers.`;
            insights.p2 = 'It is crucial to remain on high alert. The threats detected included patterns common in financial fraud and phishing campaigns. Your use of the analyzer is critical in preventing potential losses.';
            advice.push('NEVER share OTPs or personal financial details in response to an unsolicited message or link.');
            advice.push('Report any high-risk messages to the authorities using the link on your profile page.');
            advice.push('Inform your friends and family about the types of scams you are receiving to help protect them as well.');
        }

        return { insights, advice };
    };
    
    const renderDonutChart = (threats, legit) => {
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Threats Found', 'Legitimate Items'],
                datasets: [{
                    data: [threats, legit],
                    backgroundColor: ['rgba(220, 38, 38, 0.7)', 'rgba(6, 182, 212, 0.7)'], // Red-600, Cyan-500
                    borderColor: ['#010411', '#010411'], // Match body background
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: '#e5e7eb', 
                            font: { size: 14 },
                            padding: 20
                        }
                    },
                    tooltip: {
                        bodyFont: { size: 14 },
                        titleFont: { size: 16 }
                    }
                },
                cutout: '65%'
            }
        });
    };

    const calculateAndDisplaySummary = () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        const options = { month: 'short', day: 'numeric' };
        if(dateRangeEl) {
            dateRangeEl.textContent = `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${endDate.getFullYear()}`;
        }

        const history = JSON.parse(localStorage.getItem('alertHistory')) || [];
        const weeklyAlerts = history.filter(alert => new Date(alert.timestamp) >= startDate);

        if (weeklyAlerts.length === 0) {
            if(noSummaryMessageEl) noSummaryMessageEl.classList.remove('hidden');
            if(summaryContentEl) summaryContentEl.classList.add('hidden');
            return;
        }

        let stats = {
            totalScans: weeklyAlerts.length,
            threats: 0,
            legit: 0,
            types: { Link: 0, Content: 0, Screenshot: 0 }
        };

        weeklyAlerts.forEach(alert => {
            if (alert.verdict === 'High Risk' || alert.verdict === 'Suspicious') stats.threats++;
            else stats.legit++;
            if (stats.types[alert.type] !== undefined) stats.types[alert.type]++;
        });

        // Populate UI
        if(totalScansEl) totalScansEl.textContent = stats.totalScans;
        if(threatsEl) threatsEl.textContent = stats.threats;
        if(legitEl) legitEl.textContent = stats.legit;

        if(breakdownContainerEl) {
            breakdownContainerEl.innerHTML = `
                <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div class="flex items-center gap-3"><svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg><span class="font-medium">Links Analyzed</span></div><span class="font-bold text-xl">${stats.types.Link}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div class="flex items-center gap-3"><svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg><span class="font-medium">Messages Analyzed</span></div><span class="font-bold text-xl">${stats.types.Content}</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div class="flex items-center gap-3"><svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="font-medium">Screenshots Analyzed</span></div><span class="font-bold text-xl">${stats.types.Screenshot}</span>
                </div>
            `;
        }
        
        const { insights, advice } = generateInsightAndAdvice(stats);
        if (insightsContentEl) {
            insightsContentEl.innerHTML = `<p>${insights.p1}</p><p>${insights.p2}</p>`;
        }
        if (adviceListEl) {
            adviceListEl.innerHTML = advice.map(item => `<li class="flex items-start gap-3"><svg class="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>${item}</span></li>`).join('');
        }
        
        renderDonutChart(stats.threats, stats.legit);
    };

    calculateAndDisplaySummary();
});