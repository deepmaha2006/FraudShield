-- Drop tables if they exist to start with a clean slate
DROP TABLE IF EXISTS analysis_history;
DROP TABLE IF EXISTS identity_verifications;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS user_credentials;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar_url VARCHAR(255),
    email_high_risk_enabled BOOLEAN NOT NULL DEFAULT true,
    email_weekly_summary_enabled BOOLEAN NOT NULL DEFAULT true,
    total_scans INTEGER NOT NULL DEFAULT 0,
    threats_neutralized INTEGER NOT NULL DEFAULT 0,
    community_reports INTEGER NOT NULL DEFAULT 0
);

-- Create the user_credentials table
CREATE TABLE user_credentials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the analysis_history table
CREATE TABLE analysis_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    analysis_type TEXT CHECK(analysis_type IN ('Content', 'Link', 'Screenshot')) NOT NULL,
    threat_score INTEGER NOT NULL,
    is_threat BOOLEAN NOT NULL,
    result_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the identity_verifications table
CREATE TABLE identity_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    document_type TEXT CHECK(document_type IN ('Aadhaar', 'PAN', 'DL', 'Passport')) NOT NULL,
    document_number_hash VARCHAR(255) NOT NULL,
    full_name_on_doc VARCHAR(255) NOT NULL,
    dob_on_doc DATE NOT NULL,
    verification_status TEXT CHECK(verification_status IN ('Pending', 'Approved', 'Rejected')) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the support_tickets table
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    issue_description TEXT NOT NULL,
    ticket_status TEXT CHECK(ticket_status IN ('Open', 'In Progress', 'Closed')) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);