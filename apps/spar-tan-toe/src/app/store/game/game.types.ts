export type Move = {
	player_id: string;
	playerId: string;
	row: number;
	column: number;
	symbol: number;
};

export type GameState = {
	loading: boolean;
	error: any;
	id: string;
	status: GAME_STATUS;
	playerTurn: string;
	players: Player[];
	gameboard: Array<Array<Move | null>>;
	playerOneReady: boolean; // Initialize player one ready state
	playerTwoReady: boolean;
};

export type GAME_STATUS = 'queued' | 'in-progress' | 'complete' | 'paused';
export type Player = {
	id?: string | null;
	symbol?: string;
	displayName?: string;
	avatar?: string;
	host?: boolean;
};
