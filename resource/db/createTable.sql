create table if not exists player (
	playerId CHAR(34) UNIQUE KEY,
	playerName TEXT,
	playerHp INT,
	playerMp INT,
	playerExp INT,
	playerAtk INT,
	playerDef INT,
	playerInt INT,
	playerAgi INT,
	playerItems TEXT,
	playerMap CHAR(34)
);

create table if not exists map (
	mapId CHAR(34) UNIQUE KEY,
	mapName TEXT,
	mapType TEXT,
	mapNext TEXT,
	mapItems TEXT
);

create table if not exists item (
	itemId CHAR(34) UNIQUE KEY,
	itemName TEXT,
	itemType TEXT,
	itemValue INT,
	itemEffectTarget VARCHAR(255),
	itemEffectValue INT
);
