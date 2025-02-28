export type GAME_STATUS = 'queued' | 'in-progress' | 'complete' | 'paused';

export type GAME = {
	id: string;
	created_at: string;
	player_1: string | null;
	player_2: string | null;
	player1Symbol: string | null;
	player2Symbol: string | null;
	game_status: GAME_STATUS;
	winner: string | null;
	player1Ready: Date | null;
	player2Ready: Date | null;
};
