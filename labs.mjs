/*********************************************************************************************************************************
 *                                                                                                                               *
 *                                                  LAB 1                                                                        *              
 *                                                                                                                               *
 *********************************************************************************************************************************/

"use strict"; 

//constructor objects

function Picture(picture_Id, picture_Desc, picture_Path) {
    this.picture_Id = picture_Id;
    this.picture_Desc = picture_Desc;
    this.picture_Path = picture_Path;
}

function Caption(caption_Id, caption_Text, score_Value = 0) {
    this.caption_Id = caption_Id;
    this.caption_Text = caption_Text;
    this.score_Value = score_Value;
}

function Round(round_Id, round_Date, round_Pictures) {
    this.round_Id = round_Id;
    this.round_Date = round_Date;
    this.round_Pictures = round_Pictures;
}

function Score(caption_Id, picture_Id, score_Value) {
    this.caption_Id = caption_Id;
    this.picture_Id = picture_Id;
    this.score_Value = score_Value;
}


//wrapper objects

function PictureWrapper() {
    let arrayPictures = [];

    this.add = (picture) => {
        arrayPictures.push(picture);
    }

    this.filter = (picture_Id) => {
        return arrayPictures.filter((picture) => picture.picture_Id === picture_Id);
    }

    this.remove = (picture_Id) => {
        arrayPictures = arrayPictures.filter((picture) => picture.picture_Id !== picture_Id);
    }

    this.getAll = () => arrayPictures;

    this.getRandom = () => {
        return arrayPictures[Math.floor(Math.random() * arrayPictures.length)];
    }
}

function CaptionWrapper() {
    let arrayCaptions = [];

    this.add = (caption) => {
        arrayCaptions.push(caption);
    }

    this.filter = (caption_Id) => {
        return arrayCaptions.filter((caption) => caption.caption_Id === caption_Id);
    }

    this.remove = (caption_Id) => {
        arrayCaptions = arrayCaptions.filter((caption) => caption.caption_Id !== caption_Id);
    }

    this.sort = () => {
        arrayCaptions.sort((a, b) => a.caption_Id - b.caption_Id);
    }

    this.getAll = () => arrayCaptions;

    this.getRandom = (n) => {
        return arrayCaptions
            .sort(() => Math.random() - 0.5)
            .slice(0, n);
    }
}

function RoundWrapper() {
    let arrayRounds = [];

    this.add = (round) => {
        arrayRounds.push(round);
    }

    this.filter = (round_Id) => {
        return arrayRounds.filter((round) => round.round_Id === round_Id);
    }

    this.remove = (round_Id) => {
        arrayRounds = arrayRounds.filter((round) => round.round_Id !== round_Id);
    }

    this.getAll = () => arrayRounds;
}

//populating collections

//Memes
const memes = new PictureWrapper();
memes.add(new Picture(1, "Divertente", "meme1.jpg"));
memes.add(new Picture(2, "Ironico", "meme2.jpg"));
memes.add(new Picture(3, "Simpatico", "meme3.jpg"));
memes.add(new Picture(4, "Assurdo", "meme4.jpg"));
memes.add(new Picture(5, "Classico", "meme5.jpg"));

//Captions
const captions = new CaptionWrapper();
captions.add(new Caption(1, "Questa caption fa ridere"));
captions.add(new Caption(2, "Ironia a palate"));
captions.add(new Caption(3, "Didascalia geniale"));
captions.add(new Caption(4, "Che battuta triste..."));
captions.add(new Caption(5, "Serietà assoluta"));
captions.add(new Caption(6, "🤯 boom"));
captions.add(new Caption(7, "Ma cosa sto guardando?"));

//Test
console.log("Tutti i meme:", memes);
console.log("Tutte le caption:", captions);


/*********************************************************************************************************************************
 *                                                                                                                               *
 *                                                 LAB 2                                                                         * 
 *                                                                                                                               *
 *********************************************************************************************************************************/

import sqlite3 from "sqlite3";

//db connection
const db = new sqlite3.Database("Meme.sqlite", (err) => {
    if (err) {
        console.error("Errore nella creazione del database:", err.message);
    } else {
        console.log("Database connesso con successo.");
    }
});

//tables creation

//Player
db.run(`CREATE TABLE IF NOT EXISTS Player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    isRegistered BOOLEAN DEFAULT 0,
    totalScore INTEGER DEFAULT 0
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'Player':", err.message);
    else console.log("Tabella 'Player' pronta.");
});

//Meme
db.run(`CREATE TABLE IF NOT EXISTS Meme (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imageUrl TEXT NOT NULL
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'Meme':", err.message);
    else console.log("Tabella 'Meme' pronta.");
});

//Caption
db.run(`CREATE TABLE IF NOT EXISTS Caption (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    points INTEGER DEFAULT 0
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'Caption':", err.message);
    else console.log("Tabella 'Caption' pronta.");
});

//Game
db.run(`CREATE TABLE IF NOT EXISTS Game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerId INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (playerId) REFERENCES Player(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'Game':", err.message);
    else console.log("Tabella 'Game' pronta.");
});

//Round
db.run(`CREATE TABLE IF NOT EXISTS Round (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gameId INTEGER NOT NULL,
    roundNumber INTEGER NOT NULL,
    memeId INTEGER NOT NULL,
    FOREIGN KEY (gameId) REFERENCES Game(id) ON DELETE CASCADE,
    FOREIGN KEY (memeId) REFERENCES Meme(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'Round':", err.message);
    else console.log("Tabella 'Round' pronta.");
});

//GameHistory
db.run(`CREATE TABLE IF NOT EXISTS GameHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roundId INTEGER NOT NULL,
    captionId INTEGER NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    pointsEarned INTEGER NOT NULL,
    FOREIGN KEY (roundId) REFERENCES Round(id) ON DELETE CASCADE,
    FOREIGN KEY (captionId) REFERENCES Caption(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error("Errore nella creazione della tabella 'GameHistory':", err.message);
    else console.log("Tabella 'GameHistory' pronta.");
});


//populating tables

//Player
db.run(`INSERT INTO Player (name, isRegistered, totalScore) VALUES 
    ('Mario Rossi', 1, 10),
    ('Luigi Bianchi', 1, 20),
    ('Anonimo', 0, 0)`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'Player':", err.message);
    else console.log("Dati inseriti nella tabella 'Player'.");
});

//Meme
db.run(`INSERT INTO Meme (imageUrl) VALUES 
    ('meme1.jpg'),
    ('meme2.jpg'),
    ('meme3.jpg'),
    ('meme4.jpg'),
    ('meme5.jpg')`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'Meme':", err.message);
    else console.log("Dati inseriti nella tabella 'Meme'.");
});

//Caption
db.run(`INSERT INTO Caption (text, points) VALUES 
    ('Funny caption 1', 1),
    ('Funny caption 2', 2),
    ('Funny caption 3', 3),
    ('Random caption 1', 0),
    ('Random caption 2', 0),
    ('Random caption 3', 0),
    ('Random caption 4', 0)`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'Caption':", err.message);
    else console.log("Dati inseriti nella tabella 'Caption'.");
});

//Game
db.run(`INSERT INTO Game (playerId, score, completed) VALUES 
    (1, 5, 1),
    (2, 8, 1)`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'Game':", err.message);
    else console.log("Dati inseriti nella tabella 'Game'.");
});

//Round
db.run(`INSERT INTO Round (gameId, roundNumber, memeId) VALUES 
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 3),
    (2, 1, 2),
    (2, 2, 3),
    (2, 3, 4)`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'Round':", err.message);
    else console.log("Dati inseriti nella tabella 'Round'.");
});

//GameHistory
db.run(`INSERT INTO GameHistory (roundId, captionId, isCorrect, pointsEarned) VALUES 
    (1, 2, 1, 2),
    (2, 3, 1, 3),
    (3, 4, 0, 0),
    (4, 1, 1, 1),
    (5, 3, 1, 3),
    (6, 2, 1, 2)`, (err) => {
    if (err) console.error("Errore nel popolamento della tabella 'GameHistory':", err.message);
    else console.log("Dati inseriti nella tabella 'GameHistory'.");
});

//functions

export function getAllPlayers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Player', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function getPlayerByTotalScore(totalScore) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Player WHERE totalScore = ?', [totalScore], (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
        });
    });
}

export function addPlayer(name, isRegistered, totalScore) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Player (name, isRegistered, totalScore) VALUES (?, ?, ?)`;
        db.run(sql, [name, isRegistered, totalScore], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

export function deletePlayerById(playerId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Player WHERE id = ?`;
        db.run(sql, [playerId], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
}

export function updatePlayerScore(playerId, newScore) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Player SET totalScore = ? WHERE id = ?`;
        db.run(sql, [newScore, playerId], function (err) {
            if (err) reject(err);
            else resolve(this.changes > 0);
        });
    });
}


/*********************************************************************************************************************************
 *                                                                                                                               *
 *                                                 LAB 3                                                                         * 
 *                                                                                                                               *
 *********************************************************************************************************************************/

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


const app = express();
const port = 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

 //routes

 //Retrieve all players
 
app.get('/players', (req, res) => {
    const query = 'SELECT * FROM Player';
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

 //Retrieve a player by ID

app.get('/players/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM Player WHERE id = ?';
    db.get(query, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Player not found' });
        res.json(row);
    });
});


 //Retrieve all players with a specific totalScore
 
app.get('/players/score/:totalScore', (req, res) => {
    const score = req.params.totalScore;
    const query = 'SELECT * FROM Player WHERE totalScore = ?';
    db.all(query, [score], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (rows.length === 0) return res.status(404).json({ error: 'No players found with that score' });
        res.json(rows);
    });
});


//Create a new player

app.post('/players', (req, res) => {
    const { name, isRegistered = false, totalScore = 0 } = req.body;
    const query = 'INSERT INTO Player (name, isRegistered, totalScore) VALUES (?, ?, ?)';
    db.run(query, [name, isRegistered, totalScore], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, isRegistered, totalScore });
    });
});

 //Full update of a player (name, isRegistered, totalScore)
 
app.put('/players/:id', (req, res) => {
    const id = req.params.id;
    const { name, isRegistered, totalScore } = req.body;
    const query = 'UPDATE Player SET name = ?, isRegistered = ?, totalScore = ? WHERE id = ?';
    db.run(query, [name, isRegistered, totalScore, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Player not found' });
        res.json({ message: 'Player updated successfully' });
    });
});


 //Partial update of a player (e.g. only score or isRegistered)

app.patch('/players/:id', (req, res) => {
    const id = req.params.id;
    const fields = req.body;

    if (!fields || Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    const setClause = Object.keys(fields).map(field => `${field} = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);

    const query = `UPDATE Player SET ${setClause} WHERE id = ?`;
    db.run(query, values, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Player not found' });
        res.json({ message: 'Player updated successfully' });
    });
});

 //Delete a player by ID
 
app.delete('/players/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM Player WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Player not found' });
        res.json({ message: 'Player deleted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});
