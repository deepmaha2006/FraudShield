// analysisEngine.js

// CORRECTED: Importing from BOTH database files now
const threatDb = require('./threat-database.js');
const linkDb = require('./weblinks.js');

// --- ANALYSIS FUNCTIONS ---

/**
 * NEW & IMPROVED: This function now uses the comprehensive link database for much higher accuracy.
 */
function calculateLinkAuthenticity(urlString) {
    const details = [];
    try {
        if (!urlString.startsWith('http')) {
            urlString = 'https://' + urlString;
        }
        const url = new URL(urlString);
        const hostname = url.hostname.startsWith('www.') ? url.hostname.substring(4) : url.hostname;
        
        // Start with a perfect authenticity score. Points are deducted for red flags.
        let score = 100;

        // 1. Check against known malicious domains for an instant failure
        if (linkDb.knownMaliciousDomains.includes(hostname)) {
            score = 0;
            details.push({
                text: `High-Risk Domain: This domain (${hostname}) is on a known blacklist of malicious sites.`,
                type: 'danger',
                isCritical: true
            });
            return { score, details };
        }

        // 2. Check if it's a direct IP Address
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
            score = 0;
            details.push({
                text: 'Direct IP Address Link: Highly suspicious, legitimate sites rarely use direct IPs.',
                type: 'danger',
                isCritical: true
            });
            return { score, details };
        }

        // 3. Check for legitimate domains (whitelist)
        if (linkDb.officialDomains.includes(hostname)) {
            details.push({ text: `Trusted Domain: Verified as an official domain (${hostname}).`, type: 'safe' });
        } else {
             // 4. Check for Typosquatting (impersonating official domains)
            const domainRoot = hostname.split('.')[0].replace(/-/g, '');
            for (const officialDomain of linkDb.officialDomains) {
                const officialRoot = officialDomain.split('.')[0];
                const similarity = Math.abs(domainRoot.length - officialRoot.length);
                
                // If it looks very similar to a known good domain, it's a huge red flag.
                if (similarity <= 2 && domainRoot.includes(officialRoot.substring(0, Math.min(4, officialRoot.length)))) {
                    score -= 60; // Heavy penalty
                    details.push({
                        text: `Potential Typosquatting: This domain looks suspiciously similar to the official "${officialDomain}".`,
                        type: 'danger',
                        isCritical: true
                    });
                    break;
                }
            }
        }

        // 5. Check for suspicious keywords within the domain name itself
        const foundKeywords = linkDb.suspiciousDomainKeywords.filter(keyword => hostname.includes(keyword));
        if (foundKeywords.length > 0) {
            score -= (15 * foundKeywords.length);
            details.push({
                text: `Suspicious Keywords in Domain: Contains words like "${foundKeywords.join(', ')}".`,
                type: 'warning'
            });
        }
        
        // 6. Check for insecure connection (HTTP)
        if (url.protocol !== 'https:') {
            score -= 25;
            details.push({ text: 'Insecure Connection (No HTTPS): Data sent to this site is not encrypted.', type: 'danger' });
        }

        // Final score calculation
        score = Math.max(0, Math.min(score, 100));
        return { score, details };

    } catch (e) {
        return { score: 0, details: [{ text: 'Invalid or Malformed URL', type: 'danger' }] };
    }
}


function getThreatScore(text) {
    let score = 0;
    let details = { message: [], link: [] };
    const normalizedText = text.toLowerCase().trim();
    if (!normalizedText) return { score: 0, details };
    
    // Check for exact match to known spam messages
    if (threatDb.knownSpamMessages.includes(normalizedText)) {
        return {
            score: 100,
            details: {
                message: [{ text: 'This is an exact match to a known spam message in our database.', type: 'danger', isCritical: true }],
                link: []
            }
        };
    }

    let foundEntities = new Set();
    let foundThreats = new Set();

    // Scan for threatening keywords with weights
    for (const lang in threatDb.threatIntel) {
        const db = threatDb.threatIntel[lang];
        for (const category in db) {
            const { weight, keywords } = db[category];
            for (const keyword of keywords) {
                if (normalizedText.includes(keyword)) {
                    score += weight;
                    foundThreats.add(category);
                    break;
                }
            }
        }
    }

    // Add details for found threats
    foundThreats.forEach(threat => {
        const threatName = threat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        details.message.push({ text: `${threatName} Detected`, type: 'danger' });
    });

    // Scan for known entities
    for (const category in threatDb.entities) {
        for (const entity of threatDb.entities[category]) {
            if (normalizedText.includes(entity) && !foundEntities.has(entity)) {
                foundEntities.add(entity);
            }
        }
    }
    
    if (foundEntities.size > 0) {
        const entityList = Array.from(foundEntities).slice(0, 2).join(', ');
        details.message.push({ text: `Known Entities Mentioned: ${entityList}`, type: 'warning' });
        if (foundThreats.has('financialScam') || foundThreats.has('phishing')) {
            score += 25;
            details.message.push({ text: 'Critical Tactic: Known Entity + Financial Threat', type: 'danger', isCritical: true });
        }
    }

    // Analyze links within the text
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s]*)?)/g;
    const urls = text.match(urlRegex) || [];
    if (urls.length > 0) {
        // Use the new, more powerful link authenticity function
        const linkResult = calculateLinkAuthenticity(urls[0]);
        details.link = linkResult.details;
        
        // The risk from the link is (100 - authenticity_score)
        const linkRiskScore = 100 - linkResult.score;
        score += linkRiskScore; // Add link risk to overall score
        
        if (linkRiskScore > 50) {
             details.message.push({ text: `High-Risk Link Included (${Math.round(linkRiskScore)}% Risk)`, type: 'danger', isCritical: true });
        }
    }
    
    // Cap the score at 100
    score = Math.min(score, 100);
    return { score, details };
};


module.exports = {
    getThreatScore,
    calculateLinkAuthenticity
};