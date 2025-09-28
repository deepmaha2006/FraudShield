document.addEventListener('DOMContentLoaded', () => {
    // AUTH GUARD
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = '/index.html'; return; }

    // ELEMENT SELECTORS
    const analyzeTextBtn = document.getElementById('analyzeTextBtn');
    const textContent = document.getElementById('textContent');
    const analyzeLinkBtn = document.getElementById('analyzeLinkBtn');
    const linkInput = document.getElementById('linkInput');
    const screenshotInput = document.getElementById('screenshotInput');
    const screenshotPreview = document.getElementById('screenshot-preview');
    const uploadLabel = document.getElementById('uploadLabel');
    const uploadIconContainer = document.getElementById('upload-icon-container');
    const analyzeScreenshotBtn = document.getElementById('analyzeScreenshotBtn');
    const analysisReportContainer = document.getElementById('analysis-report');
    const loader = document.getElementById('loader');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    let uploadedFile = null;

    // TAB SWITCHING LOGIC
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
            tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
            
            // Hide the old report when switching tabs
            analysisReportContainer.classList.add('hidden', 'opacity-0', 'transform', 'translate-y-4');
        });
    });

    // MODIFIED: resetUI function updated for new workflow
    const resetUI = () => {
        analysisReportContainer.classList.add('hidden', 'opacity-0', 'transform', 'translate-y-4');
        analysisReportContainer.innerHTML = ''; // Clear the old report content
        
        // Clear all input fields
        uploadedFile = null;
        if(screenshotPreview) screenshotPreview.classList.add('hidden');
        if(uploadIconContainer) uploadIconContainer.style.display = 'flex';
        if(uploadLabel) uploadLabel.textContent = 'Click to upload or drag & drop';
        if(analyzeScreenshotBtn) analyzeScreenshotBtn.classList.add('hidden');
        if(textContent) textContent.value = '';
        if(linkInput) linkInput.value = '';
        if(screenshotInput) screenshotInput.value = '';

        // Smoothly scroll to the top of the analyzer section
        const analyzerSection = document.getElementById('analyzer-section');
        if(analyzerSection) {
            analyzerSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const saveAnalysisResult = (content, verdict, score, type) => {
        // Save to recent alerts history
        let history = JSON.parse(localStorage.getItem('alertHistory')) || [];
        const newAlert = {
            content: content.substring(0, 60) + (content.length > 60 ? '...' : ''),
            verdict: verdict,
            score: Math.round(score),
            type: type,
            timestamp: new Date().toISOString()
        };
        history.unshift(newAlert);
        history = history.slice(0, 5);
        localStorage.setItem('alertHistory', JSON.stringify(history));

        // Update data for dashboard charts
        let chartData = JSON.parse(localStorage.getItem('chartData'));
        if (!chartData || !chartData.threats || !chartData.legit) {
             chartData = { threats: [0, 0, 0, 0, 0, 0, 0], legit: [0, 0, 0, 0, 0, 0, 0] };
        }
        chartData.threats.shift();
        chartData.legit.shift();
        if (score > 40) {
            chartData.threats.push((chartData.threats[5] || 0) + 1);
            chartData.legit.push(chartData.legit[5] || 0);
        } else {
            chartData.legit.push((chartData.legit[5] || 0) + 1);
            chartData.threats.push(chartData.threats[5] || 0);
        }
        localStorage.setItem('chartData', JSON.stringify(chartData));

        // Update user stats
        let userStats = JSON.parse(localStorage.getItem('userStats'));
        if (!userStats || typeof userStats.totalScans !== 'number') {
            userStats = { totalScans: 0, threatsNeutralized: 0, communityReports: 0 };
        }
        userStats.totalScans += 1;
        if (score > 30) {
            userStats.threatsNeutralized += 1;
        } else {
            userStats.communityReports += 1;
        }
        localStorage.setItem('userStats', JSON.stringify(userStats));
    };
    
    // MODIFIED: updateUIWithReport function corrected
    const updateUIWithReport = (score, details, analysisType, originalContent) => {
        analysisReportContainer.innerHTML = '';
        let verdictText, colorClass, recommendationText;

        if (score > 70) {
            verdictText = 'High Risk'; colorClass = 'border-red-500 text-red-500';
            recommendationText = 'This is likely a scam or phishing attempt. DELETE this message and BLOCK the sender. Do not click any links.';
        } else if (score > 40) {
            verdictText = 'Suspicious'; colorClass = 'border-yellow-500 text-yellow-500';
            recommendationText = 'This content shows several signs of a phishing attempt. Proceed with extreme caution.';
        } else if (score > 15) {
             verdictText = 'Likely Safe'; colorClass = 'border-sky-400 text-sky-400';
            recommendationText = 'While no major threats were found, some elements warrant caution. Always verify the sender.';
        } else {
            verdictText = 'Safe'; colorClass = 'border-green-500 text-green-500';
            recommendationText = 'This content appears to be safe. However, always remain vigilant.';
        }

        saveAnalysisResult(originalContent, verdictText, score, analysisType);

        const renderDetailsList = (items) => items.map(item => {
            const icon = item.type === 'danger' ? '❗️' : item.type === 'warning' ? '⚠️' : item.type === 'info' ? 'ℹ️' : '✔️';
            return `<li class="flex items-start gap-3"><span class="text-lg mt-1">${icon}</span> <span>${item.text}</span></li>`;
        }).join('');

        const reportHTML = `
            <div class="glass-effect p-8 rounded-2xl">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white">Security Report Card</h2>
                    <button id="new-scan-btn" class="text-sm bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium">New Scan</button>
                </div>
                <div class="flex flex-col md:flex-row items-center gap-8">
                    <div class="w-full md:w-1/3 text-center">
                        <div class="w-40 h-40 rounded-full mx-auto flex flex-col items-center justify-center border-8 ${colorClass} bg-gray-900/50">
                            <span class="text-3xl font-bold">${verdictText}</span>
                            <span class="text-sm text-gray-400">Risk Level</span>
                            <span class="text-xl font-semibold mt-1 text-white">${Math.round(score)}% Risk</span>
                        </div>
                    </div>
                    <div class="w-full md:w-2/3">
                        <h3 class="text-xl font-bold text-white">Recommendation:</h3>
                        <p class="mt-1 mb-6 text-cyan-300">${recommendationText}</p>
                        ${details.message && details.message.length > 0 ? `<h4 class="font-semibold text-white mt-4">Content Flags:</h4><ul class="list-none mt-2 text-gray-300 space-y-2 text-sm">${renderDetailsList(details.message)}</ul>` : ''}
                        ${details.link && details.link.length > 0 ? `<h4 class="font-semibold text-white mt-4">Link Analysis:</h4><ul class="list-none mt-2 text-gray-300 space-y-2 text-sm">${renderDetailsList(details.link)}</ul>` : ''}
                    </div>
                </div>
            </div>`;
        
        analysisReportContainer.innerHTML = reportHTML;
        
        // THIS LINE IS REMOVED: analyzerContainer.classList.add('opacity-0');
        
        analysisReportContainer.classList.remove('hidden', 'opacity-0', 'transform', 'translate-y-4');
        
        // Scroll to the report card smoothly
        analysisReportContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        document.getElementById('new-scan-btn').addEventListener('click', resetUI);
    };

    const performAnalysis = async (type, data) => {
        loader.classList.remove('hidden');
        loader.classList.add('flex');
        let endpoint, body, originalContent;
        let headers = { 'Authorization': `Bearer ${token}` };

        if (type === 'link') {
            endpoint = '/api/analyze/link';
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({ link: data });
            originalContent = data;
        } else if (type === 'content') {
            endpoint = '/api/analyze/content';
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({ textContent: data });
            originalContent = data;
        } else if (type === 'screenshot') {
            endpoint = '/api/analyze/screenshot';
            body = new FormData();
            body.append('screenshot', data);
            originalContent = data.name;
        }

        try {
            const response = await fetch(endpoint, { method: 'POST', headers, body });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `Server error: ${response.status}`);
            }
            const result = await response.json();
            
            setTimeout(() => {
                loader.classList.add('hidden');
                loader.classList.remove('flex');
                updateUIWithReport(result.score, result.details, type.charAt(0).toUpperCase() + type.slice(1), originalContent);
            }, 1500);

        } catch (error) {
            loader.classList.add('hidden');
            loader.classList.remove('flex');
            alert(`An error occurred: ${error.message}`);
            if (error.message.includes('Token expired')) {
                localStorage.removeItem('authToken');
                window.location.href = '/index.html?error=session_expired';
            }
        }
    };
    
    analyzeTextBtn.addEventListener('click', () => {
        const text = textContent.value.trim();
        if (text) performAnalysis('content', text);
    });
    
    analyzeLinkBtn.addEventListener('click', () => {
        const link = linkInput.value.trim();
        if (link) performAnalysis('link', link);
    });

    analyzeScreenshotBtn.addEventListener('click', () => {
        if (uploadedFile) performAnalysis('screenshot', uploadedFile);
    });

    screenshotInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert('File is too large (Max 5MB).');
                return;
            }
            uploadedFile = file;
            uploadLabel.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                screenshotPreview.src = event.target.result;
                screenshotPreview.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
            uploadIconContainer.style.display = 'none';
            analyzeScreenshotBtn.classList.remove('hidden');
        }
    });
});