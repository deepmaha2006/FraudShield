// server.js (Corrected and Complete for SQLite)

// Import required packages
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Use sqlite3
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const fsp = fs.promises; // Using fs.promises for async operations
const crypto = require('crypto');
const os = require('os');
const { createWorker } = require('tesseract.js');
const { getThreatScore, calculateLinkAuthenticity } = require('./analysisEngine');
const { sendHighRiskAlert } = require('./mailer');

// --- Environment Variable Check ---
// UPDATED LIST for SQLite
const requiredEnvVars = [
    'DB_FILE', // Changed from DB_HOST, DB_USER, etc.
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_APP_PASSWORD'
];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`\x1b[31mFATAL ERROR: Environment variable ${varName} is not defined. Please check your .env file.\x1b[0m`);
        process.exit(1);
    }
}
if(process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(`\x1b[33mWARNING: Your JWT_SECRET is less than 32 characters long. This is insecure for production environments.\x1b[0m`);
}

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const HIGH_RISK_THRESHOLD = 70;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// --- DATABASE CONNECTION (SQLite) ---
const db = new sqlite3.Database(process.env.DB_FILE, (err) => {
    if (err) {
        console.error('\x1b[31m--- DATABASE CONNECTION FAILED --- \x1b[0m');
        console.error(`\x1b[31mError: ${err.message}\x1b[0m`);
        console.error('\x1b[33mPlease check your .env file and ensure the database file path is correct.\x1b[0m');
        process.exit(1);
    } else {
        console.log('\x1b[32mDatabase connected successfully!\x1b[0m');
        // Enable foreign key support in SQLite
        db.run('PRAGMA foreign_keys = ON;');
    }
});


// --- AUTHENTICATION MIDDLEWARE for JWT-protected API routes ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('\x1b[31m[JWT Error]:\x1b[0m', err.name, '-', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please log in again.' });
            }
            return res.status(403).json({ message: 'Forbidden: Invalid Token.' });
        }
        req.user = user;
        next();
    });
};

// --- MULTER FILE UPLOAD CONFIGURATION ---
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads/avatars');
        fs.mkdir(uploadPath, { recursive: true }, (err) => cb(err, uploadPath));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `user-${req.user.id}-${Date.now()}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const screenshotStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads/screenshots');
        fs.mkdir(uploadPath, { recursive: true }, (err) => cb(err, uploadPath));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `analysis-${req.user.id}-${Date.now()}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadAvatarInstance = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: imageFileFilter });
const uploadScreenshotInstance = multer({ storage: screenshotStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFileFilter });

// =================================================================
// --- API ROUTES ---
// =================================================================

// --- STANDARD AUTHENTICATION ROUTES ---
app.post('/api/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Using db.serialize to run queries in sequence
    db.serialize(async () => {
        db.run('BEGIN TRANSACTION;');
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                db.run('ROLLBACK;');
                console.error('\x1b[31m[Registration Error]:\x1b[0m', err.message);
                return res.status(500).json({ message: 'Server error during registration.' });
            }
            if (existingUser) {
                db.run('ROLLBACK;');
                return res.status(409).json({ message: 'Email address is already registered.' });
            }

            try {
                const passwordHash = await bcrypt.hash(password, 10);
                const userSql = 'INSERT INTO users (full_name, email) VALUES (?, ?)';

                db.run(userSql, [fullName, email], function(err) {
                    if (err) {
                        db.run('ROLLBACK;');
                        console.error('\x1b[31m[Registration Error]:\x1b[0m', err.message);
                        return res.status(500).json({ message: 'Server error during user creation.' });
                    }

                    const newUserId = this.lastID;
                    const credSql = 'INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)';

                    db.run(credSql, [newUserId, passwordHash], (err) => {
                        if (err) {
                            db.run('ROLLBACK;');
                            console.error('\x1b[31m[Registration Error]:\x1b[0m', err.message);
                            return res.status(500).json({ message: 'Server error during credentials creation.' });
                        }
                        db.run('COMMIT;');
                        res.status(201).json({ message: 'User registered successfully! Please log in.' });
                    });
                });
            } catch (error) {
                db.run('ROLLBACK;');
                console.error('\x1b[31m[Registration Error]:\x1b[0m', error.message);
                res.status(500).json({ message: 'Server error during registration.' });
            }
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = `
        SELECT u.id, u.full_name, u.email, uc.password_hash
        FROM users u
        JOIN user_credentials uc ON u.id = uc.user_id
        WHERE u.email = ?
    `;

    db.get(query, [email], async (err, user) => {
        if (err) {
            console.error('\x1b[31m[Login Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error during login.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, name: user.full_name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token: token, user: { name: user.full_name } });
    });
});

// --- USER PROFILE & MANAGEMENT ROUTES (JWT PROTECTED) ---

app.get('/api/user/stats', authenticateToken, (req, res) => {
    db.get('SELECT total_scans, threats_neutralized, community_reports FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) {
            console.error('\x1b[31m[Get Stats Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: "Server error fetching user stats." });
        }
        if (!row) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(row);
    });
});

app.get('/api/user/profile', authenticateToken, (req, res) => {
    const userQuery = 'SELECT id, full_name, email, phone_number, created_at, avatar_url, email_high_risk_enabled, email_weekly_summary_enabled FROM users WHERE id = ?';
    const verificationQuery = 'SELECT verification_status FROM identity_verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';

    db.get(userQuery, [req.user.id], (err, userProfile) => {
        if (err) {
            console.error('\x1b[31m[Error fetching profile]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error fetching profile.' });
        }
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found.' });
        }

        db.get(verificationQuery, [req.user.id], (err, verificationRow) => {
            if (err) {
                console.error('\x1b[31m[Error fetching profile]:\x1b[0m', err.message);
                // Still return user data even if verification check fails
                userProfile.verification_status = 'Unknown';
                return res.json(userProfile);
            }
            userProfile.verification_status = verificationRow ? verificationRow.verification_status : 'Not Submitted';
            res.json(userProfile);
        });
    });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const { fullName, phone } = req.body;
    if (!fullName) {
        return res.status(400).json({ message: 'Full name is required.' });
    }
    db.run('UPDATE users SET full_name = ?, phone_number = ? WHERE id = ?', [fullName, phone || null, req.user.id], function(err) {
        if (err) {
            console.error('\x1b[31m[Error updating profile]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error updating profile.' });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
});

app.put('/api/user/preferences', authenticateToken, (req, res) => {
    const { emailHighRisk, emailWeeklySummary } = req.body;
    const userId = req.user.id;

    if (typeof emailHighRisk !== 'boolean' || typeof emailWeeklySummary !== 'boolean') {
        return res.status(400).json({ message: 'Invalid preference values provided.' });
    }
    const sql = 'UPDATE users SET email_high_risk_enabled = ?, email_weekly_summary_enabled = ? WHERE id = ?';
    db.run(sql, [emailHighRisk, emailWeeklySummary, userId], function(err) {
        if (err) {
            console.error('\x1b[31m[Error updating notification preferences]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error updating preferences.' });
        }
        res.json({ message: 'Notification preferences updated successfully!' });
    });
});

app.post('/api/user/change-password', authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All password fields are required.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    db.get('SELECT password_hash FROM user_credentials WHERE user_id = ?', [req.user.id], async (err, row) => {
        if (err) {
            console.error('\x1b[31m[Password change error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error changing password.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Credentials not found.' });
        }
        const isMatch = await bcrypt.compare(currentPassword, row.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE user_credentials SET password_hash = ? WHERE user_id = ?', [newPasswordHash, req.user.id], function(err) {
            if (err) {
                console.error('\x1b[31m[Password change error]:\x1b[0m', err.message);
                return res.status(500).json({ message: 'Server error changing password.' });
            }
            res.json({ message: 'Password changed successfully!' });
        });
    });
});

app.delete('/api/user/remove-picture', authenticateToken, (req, res) => {
    const userId = req.user.id;
    db.get('SELECT avatar_url FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error('\x1b[31m[Remove Picture Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error while removing profile picture.' });
        }
        if (!row) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentAvatarUrl = row.avatar_url;
        db.run('UPDATE users SET avatar_url = NULL WHERE id = ?', [userId], async function(err) {
            if (err) {
                console.error('\x1b[31m[Remove Picture Error]:\x1b[0m', err.message);
                return res.status(500).json({ message: 'Server error while removing profile picture.' });
            }

            if (currentAvatarUrl && currentAvatarUrl.startsWith('/uploads/avatars/')) {
                const filePath = path.join(__dirname, 'public', currentAvatarUrl);
                await fsp.unlink(filePath).catch(err => console.error(`Failed to delete old avatar file: ${filePath}`, err));
            }
            res.json({ message: 'Profile picture removed successfully.' });
        });
    });
});


app.post('/api/user/upload-picture', authenticateToken, uploadAvatarInstance.single('avatar'), (req, res) => {
    if (!req.file) { return res.status(400).json({ message: 'Please upload a file.' }); }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    db.get('SELECT avatar_url FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) {
            console.error('\x1b[31m[File upload DB error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Error updating profile picture in database.' });
        }
        const oldAvatarUrl = row?.avatar_url;

        db.run('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id], async function(err) {
            if (err) {
                console.error('\x1b[31m[File upload DB error]:\x1b[0m', err.message);
                return res.status(500).json({ message: 'Error updating profile picture in database.' });
            }

            if (oldAvatarUrl && oldAvatarUrl.startsWith('/uploads/avatars/')) {
                const oldFilePath = path.join(__dirname, 'public', oldAvatarUrl);
                await fsp.unlink(oldFilePath).catch(err => console.error(`Failed to delete old avatar: ${oldFilePath}`, err));
            }
            res.json({ message: 'Profile picture updated!', avatarUrl: avatarUrl });
        });
    });
});

app.post('/api/user/verify-identity', authenticateToken, (req, res) => {
    const { fullNameOnDoc, dob, docType, docNumber } = req.body;
    const userId = req.user.id;
    if (!fullNameOnDoc || !dob || !docType || !docNumber) {
        return res.status(400).json({ message: 'All verification fields are required.' });
    }

    const checkSql = "SELECT id FROM identity_verifications WHERE user_id = ? AND verification_status IN ('Pending', 'Approved')";
    db.get(checkSql, [userId], async (err, existing) => {
        if (err) {
            console.error('\x1b[31m[Verification Submission DB Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error while submitting verification.' });
        }
        if (existing) {
            return res.status(409).json({ message: 'You already have an active verification request.' });
        }

        const docNumberHash = await bcrypt.hash(docNumber, 10);
        const insertSql = `INSERT INTO identity_verifications (user_id, document_type, document_number_hash, full_name_on_doc, dob_on_doc, verification_status) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, [userId, docType, docNumberHash, fullNameOnDoc, dob, 'Pending'], function(err) {
            if (err) {
                console.error('\x1b[31m[Verification Submission DB Error]:\x1b[0m', err.message);
                return res.status(500).json({ message: 'Server error while submitting verification.' });
            }
            res.status(200).json({ message: 'Verification details submitted successfully. Please allow time for review.' });
        });
    });
});


// --- SUPPORT TICKET ROUTE ---
app.post('/api/support', (req, res) => {
    const { name, email, phone, problem } = req.body;
    if (!name || !email || !problem) {
        return res.status(400).json({ message: 'Name, email, and problem description are required.' });
    }
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (e) { /* Invalid token, proceed as anonymous */ }
        }
    }
    const query = `INSERT INTO support_tickets (user_id, name, email, phone_number, issue_description) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [userId, name, email, phone || null, problem], function(err) {
        if (err) {
            console.error('\x1b[31m[Support Ticket DB Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: 'Server error while submitting the ticket.' });
        }
        res.status(200).json({ message: 'Support ticket submitted successfully!' });
    });
});


// --- WEEKLY SUMMARY ROUTE ---
app.get('/api/user/summary', authenticateToken, (req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const query = `SELECT analysis_type, is_threat FROM analysis_history WHERE user_id = ? AND created_at >= ?`;

    db.all(query, [req.user.id, sevenDaysAgo], (err, rows) => {
        if (err) {
            console.error('\x1b[31m[Get Summary Error]:\x1b[0m', err.message);
            return res.status(500).json({ message: "Server error fetching summary data." });
        }

        const summary = {
            totalScans: rows.length,
            threats: 0,
            legit: 0,
            types: { Content: 0, Link: 0, Screenshot: 0 }
        };

        rows.forEach(row => {
            if (row.is_threat) {
                summary.threats++;
            } else {
                summary.legit++;
            }
            if (summary.types[row.analysis_type] !== undefined) {
                summary.types[row.analysis_type]++;
            }
        });
        res.json(summary);
    });
});


// --- ANALYSIS LOGIC & ROUTES ---

// Helper function to log analysis and update user stats in a single transaction
const logAnalysisAndUpdateStats = (userId, analysisType, score, isThreat) => {
    db.serialize(() => {
        db.run('BEGIN TRANSACTION;', (err) => {
            if (err) return console.error(`\x1b[31m[Stat/Log Begin Tran Error for user ${userId}]:\x1b[0m`, err.message);
        });

        const logQuery = 'INSERT INTO analysis_history (user_id, analysis_type, score, is_threat) VALUES (?, ?, ?, ?)';
        db.run(logQuery, [userId, analysisType, score, isThreat], function(err) {
            if (err) {
                console.error(`\x1b[31m[Stat/Log History Error for user ${userId}]:\x1b[0m`, err.message);
                return db.run('ROLLBACK;');
            }
            
            const statsUpdateQuery = isThreat
                ? 'UPDATE users SET total_scans = total_scans + 1, threats_neutralized = threats_neutralized + 1 WHERE id = ?'
                : 'UPDATE users SET total_scans = total_scans + 1, community_reports = community_reports + 1 WHERE id = ?';

            db.run(statsUpdateQuery, [userId], function(err) {
                if (err) {
                    console.error(`\x1b[31m[Stat/Log Update Error for user ${userId}]:\x1b[0m`, err.message);
                    return db.run('ROLLBACK;');
                }
                db.run('COMMIT;');
            });
        });
    });
};

// Helper function to trigger high-risk alert email
const triggerHighRiskAlert = (userId, analysisResult, analysisType) => {
    if (analysisResult.score > HIGH_RISK_THRESHOLD) {
        db.get('SELECT full_name, email, email_high_risk_enabled FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                return console.error(`\x1b[31m[High Risk Alert Trigger Error for user ${userId}]:\x1b[0m`, err.message);
            }
            if (user && user.email_high_risk_enabled) {
                sendHighRiskAlert(user, analysisResult, analysisType);
            }
        });
    }
};

// MODIFIED: Analysis routes now use the new `logAnalysisAndUpdateStats` function
app.post('/api/analyze/content', authenticateToken, (req, res) => {
    const { textContent } = req.body;
    if (!textContent) { return res.status(400).json({ message: 'textContent is required.' }); }
    
    const result = getThreatScore(textContent);
    res.json(result);

    // Run post-analysis tasks without holding up the response
    const isThreat = result.score > 30;
    logAnalysisAndUpdateStats(req.user.id, 'Content', Math.round(result.score), isThreat);
    triggerHighRiskAlert(req.user.id, result, 'Message/Text');
});

app.post('/api/analyze/link', authenticateToken, (req, res) => {
    const { link } = req.body;
    if (!link) { return res.status(400).json({ message: 'link is required.' }); }

    const result = calculateLinkAuthenticity(link);
    const apiResponse = { score: 100 - result.score, details: { message: [], link: result.details } };
    res.json(apiResponse);

    // Run post-analysis tasks
    const isThreat = apiResponse.score > 30;
    logAnalysisAndUpdateStats(req.user.id, 'Link', Math.round(apiResponse.score), isThreat);
    triggerHighRiskAlert(req.user.id, apiResponse, 'Link/URL');
});

app.post('/api/analyze/screenshot', authenticateToken, uploadScreenshotInstance.single('screenshot'), async (req, res) => {
    if (!req.file) { return res.status(400).json({ message: 'Screenshot file is required.' }); }
    
    let worker;
    try {
        worker = await createWorker('eng+hin');
        const { data: { text } } = await worker.recognize(req.file.path);
        
        let analysisResult;
        if (!text || text.trim() === '') {
            analysisResult = { score: 0, details: { message: [{ text: 'Could not read any text from the image.', type: 'warning' }], link: [] } };
        } else {
            analysisResult = getThreatScore(text);
        }

        res.json(analysisResult);

        // Run post-analysis tasks
        const isThreat = analysisResult.score > 30;
        logAnalysisAndUpdateStats(req.user.id, 'Screenshot', Math.round(analysisResult.score), isThreat);
        triggerHighRiskAlert(req.user.id, analysisResult, 'Screenshot');

    } catch (error) {
        console.error('\x1b[31m[Screenshot Analysis Error]:\x1b[0m', error.message);
        res.status(500).json({ message: 'Error processing the screenshot.' });
    } finally {
        if (worker) { await worker.terminate(); }
        // Clean up uploaded file
        if (req.file && req.file.path) {
            await fsp.unlink(req.file.path).catch(err => console.error("Error deleting temp screenshot:", err.message));
        }
    }
});


// --- FILE SERVING & SERVER START ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:page.html', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'public', `${page}.html`);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            const notFoundPath = path.join(__dirname, 'public', '404.html');
            fs.access(notFoundPath, fs.constants.F_OK, (e) => {
                if (e) return res.status(404).send('404 Not Found');
                res.status(404).sendFile(notFoundPath);
            });
            return;
        }
        res.sendFile(filePath);
    });
});

const getLocalIpAddresses = () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push(net.address);
            }
        }
    }
    return addresses;
};

const startServer = () => {
    const HOST = '0.0.0.0';
    const localIps = getLocalIpAddresses();

    app.listen(PORT, HOST, () => {
        console.log(`\n\x1b[36mFraudShield Server is running!\x1b[0m`);
        console.log(`- \x1b[1mAccess for you (on this computer):\x1b[0m \x1b[34mhttp://localhost:${PORT}\x1b[0m`);
        
        if (localIps.length > 0) {
            console.log(`- \x1b[1mAccess for others on the network:\x1b[0m`);
            localIps.forEach(ip => {
                console.log(`  \x1b[34mhttp://${ip}:${PORT}\x1b[0m`);
            });
        }
        console.log('\n');
    });
}

startServer();