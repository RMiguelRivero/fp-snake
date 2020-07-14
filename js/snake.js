import {
    addPoints,
    applySpec,
    compose,
    constant,
    dropFirst,
    includesPoint,
    gather,
    modPoint,
    prop,
    randomInt,
    last,
    push,
    branch,
    increment,
    dropLast,
    not,
    diffPoints,
} from './utils.js';

const randomInBoard = () => [
    randomInt(0, BOARD_DIMENSIONS[0] - 1),
    randomInt(0, BOARD_DIMENSIONS[1] - 1)
];
export const BOARD_DIMENSIONS = [30, 20];
export const MOVES = {
    UP: [0, -1],
    RIGHT: [1, 0],
    DOWN: [0, 1],
    LEFT: [-1, 0],
};

export const initialState = () => ({
    snake: [[0,0]],
    apples: [randomInBoard()],
    score: 0,
    move: MOVES.RIGHT,
    gameOver: false,
});

const snake = prop('snake');
const snakeHead = compose(last, snake);
const snakeNeck = compose(
    branch(
        not,
        () => [NaN, NaN],
    ),
    last,
    dropLast,
    snake,
);
const apples = prop('apples');
const move = prop('move');
export const score = prop('score');
const gameOver = prop('gameOver');
const backToBoard = modPoint(BOARD_DIMENSIONS[0], BOARD_DIMENSIONS[1]);

const spawnApple = (state) => {
    const newApple = randomInBoard();
    return includesPoint(state.snake)(newApple)
        ? spawnApple(state)
        : [newApple];
};

const nextHead = compose(
    backToBoard,
    gather(
        addPoints,
        compose(
            last,
            snake
        ),
        move,
    )
);

const snakePortionToCheck = compose(
    dropLast,  // do not check neck
    dropLast,  // do not check head
    dropFirst, // do not check tail
    snake,
);

export const willCrash = gather(
    includesPoint,
    snakePortionToCheck,
    nextHead,
);

const willEat = gather(
    includesPoint,
    apples,
    nextHead,
);

const growSnake = gather(
    push,
    snake,
    nextHead,
);

const moveSnake = compose(
    dropFirst,
    growSnake,
);

const nextSnake = branch(
    willCrash,
    snake,
    branch(
        willEat,
        growSnake,
        moveSnake,
    ),
);

const nextApple = branch(
    willEat,
    spawnApple,
    apples,
);

const nextScore = branch(
    willEat,
    compose(
        increment,
        score,
    ),
    score,
);

const nextGameOver = willCrash;

export const isGameOver = gameOver;

export const next = branch(
    isGameOver,
    initialState,
    applySpec({
        snake: nextSnake,
        apples: nextApple,
        score: nextScore,
        move,
        gameOver: nextGameOver,
    }),
);

const isValidMove = (direction) => gather(
    diffPoints,
    gather(
        addPoints,
        snakeHead,
        constant(direction),
    ),
    snakeNeck,
);

export const changeMove = (direction) => branch(
    isValidMove(direction),
    applySpec({
        snake,
        apples,
        score,
        move: constant(direction),
        gameOver,
    }),
);
