-- Create USER Table with enhancements
CREATE TABLE USER (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,  -- Store hashed password
    email VARCHAR(255) NOT NULL UNIQUE,
    r10flop INT DEFAULT 0,
    r10turn INT DEFAULT 0,
    r10river INT DEFAULT 0,
    bombPot INT DEFAULT 0,
    bombPotMega INT DEFAULT 0,
    bombPotUltra INT DEFAULT 0,
    highCardWins INT DEFAULT 0,
    PairWins INT DEFAULT 0,
    TwoPairWins INT DEFAULT 0,
    TripWins INT DEFAULT 0,
    StraightWins INT DEFAULT 0,
    FlushWins INT DEFAULT 0,
    FullHouseWins INT DEFAULT 0,
    QuadWins INT DEFAULT 0,
    StraightFlushWins INT DEFAULT 0,
    RoyalFlushWins INT DEFAULT 0,
    totalChips INT DEFAULT 0,
    allTimeBestHand VARCHAR(255),
    profilePicture VARCHAR(255),
    `group` VARCHAR(255),
    tableColor VARCHAR(7) DEFAULT '#FFFFFF',
    backgroundColor VARCHAR(7) DEFAULT '#FFFFFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create PLAYER Table with foreign key
CREATE TABLE PLAYER (
    username VARCHAR(255) PRIMARY KEY,
    gameId VARCHAR(255),
    socketId VARCHAR(255),
    FOREIGN KEY (username) REFERENCES USER(username) ON DELETE CASCADE,
    INDEX (gameId)  -- Index for faster lookups by gameId
);

-- Create GAME Table with timestamp
CREATE TABLE GAME (
    gameObject TEXT,
    gameId VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
);
