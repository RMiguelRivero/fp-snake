import { compose, not, prop, branch, applySpec } from './utils.js';
import { initialState, next as nextSnake, changeMove, willCrash, score } from './snake.js';

export const paused = prop('paused');
export const snakeState = prop('snakeState');

export const initStore = () => ({
	paused: true,
	snakeState: initialState(),
});

const togglePaused = compose(
    not,
    paused
);

export const pause = applySpec({
    paused: togglePaused,
    snakeState,
});

const nextPause = compose(
    willCrash,
    snakeState,
);

const nextSnakeState = compose(
    nextSnake,
    snakeState,
);

export const gameScore = compose(
    score,
    snakeState
);

export const next = applySpec({
	paused: nextPause,
	snakeState: nextSnakeState,
});

export const changeSnakeMove = (direction) => applySpec({
    paused,
    snakeState: compose(
        changeMove(direction),
        snakeState,
    ),
});
