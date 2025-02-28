import { isNonNegativeNumber } from '../utils';
import type { Move, Player } from './game.types';

const winningCombos = [
	// Horizontal rows (all share the same y)
	[
		{ y: 0, x: 0 },
		{ y: 0, x: 1 },
		{ y: 0, x: 2 },
	], // Top row
	[
		{ y: 1, x: 0 },
		{ y: 1, x: 1 },
		{ y: 1, x: 2 },
	], // Middle row
	[
		{ y: 2, x: 0 },
		{ y: 2, x: 1 },
		{ y: 2, x: 2 },
	], // Bottom row

	// Vertical columns (all share the same x)
	[
		{ y: 0, x: 0 },
		{ y: 1, x: 0 },
		{ y: 2, x: 0 },
	], // Left column
	[
		{ y: 0, x: 1 },
		{ y: 1, x: 1 },
		{ y: 2, x: 1 },
	], // Middle column
	[
		{ y: 0, x: 2 },
		{ y: 1, x: 2 },
		{ y: 2, x: 2 },
	], // Right column

	// Diagonals
	[
		{ y: 0, x: 0 },
		{ y: 1, x: 1 },
		{ y: 2, x: 2 },
	], // Top-left to bottom-right
	[
		{ y: 0, x: 2 },
		{ y: 1, x: 1 },
		{ y: 2, x: 0 },
	], // Top-right to bottom-left
];

export function updatePlayers(existingArray: Player[], updateArray: Player[], id: keyof Player): Player[] {
	// Create a map for quick lookup of updated entities
	const updateMap = new Map(updateArray.map((item) => [item[id], item]));

	// Create a new array based on the existing array
	const updatedPlayers = existingArray.map((existingItem) => {
		// Check if there is an update for this item in the updateMap
		const updatedItem = updateMap.get(existingItem[id]);
		// Merge existing item with updated item if found; else keep the existing item
		return updatedItem ? { ...existingItem, ...updatedItem } : existingItem;
	});

	// Add any new players from updateArray that are not already in existingArray
	const newPlayers = updateArray.filter(
		(newPlayer) => !existingArray.some((existingPlayer) => existingPlayer[id] === newPlayer[id]),
	);

	// Return the updated array by combining updated existing players with any new players
	return [...updatedPlayers, ...newPlayers];
}

export function update2DArray(originalArray: (Move | null)[][], move: Move): Array<Array<Move | null>> {
	const newArray = originalArray.map((row, index) => {
		if (index === move.row) {
			return [...row.slice(0, move.column), { ...move }, ...row.slice(move.column + 1)];
		}
		return [...row];
	});
	return newArray;
}

export function checkForWinner(board: Array<Array<Move | null>>): string | null {
	for (const combo of winningCombos) {
		const [a, b, c] = combo;

		const valA = board[a.y][a.x];
		const valB = board[b.y][b.x];
		const valC = board[c.y][c.x];

		// Check if all values exist and have the same player_id
		if (valA && valB && valC && valA.player_id === valB.player_id && valA.player_id === valC.player_id) {
			return valA.player_id; // Return the winning player's ID
		}
	}

	// No winning combo found
	return null;
}

export function loadGameBoard(moves: Move[], gameboard: (Move | null)[][]): (Move | null)[][] {
	if (moves?.length) {
		let nextGameState = gameboard; // Get the current gameboard state

		for (const move of moves) {
			// Check whether the move is valid (non-negative row/column)
			if (isNonNegativeNumber(move.column) && isNonNegativeNumber(move.row)) {
				// Update the gameboard with the new move
				nextGameState = update2DArray(nextGameState, move);
			}
		}

		// After processing all moves, update the gameboard in the store
		return nextGameState;
	}
	return gameboard;
}
