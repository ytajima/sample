create table if not exists playerLog (
	playerId CHAR(34),
	apiPath TEXT,
	apiParam TEXT,
	logDateTime DATETIME
);

create table if not exists itemLog (
	itemId CHAR(34),
	apiPath TEXT,
	apiParam TEXT,
	logDateTime DATETIME
);
