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
    first,
    log,
    push,
    branch,
} from './utils.js';

export const BOARD_DIMENSIONS = [40, 20];

const snake = prop('snake');
const apples = prop('apples');
const move = prop('move');
const backToBoard = modPoint(BOARD_DIMENSIONS[0], BOARD_DIMENSIONS[1])

export const MOVES = {
    UP: [0, -1],
    RIGHT: [1, 0],
    DOWN: [0, 1],
    LEFT: [-1, 0],
}


const randomInBoard = () => [
    randomInt(BOARD_DIMENSIONS[0]),
    randomInt(BOARD_DIMENSIONS[1])
];


export const initialState = () => ({
    snake: [[0,0]],
    apples: [randomInBoard()],
    move: MOVES.RIGHT,
});

export const nextHead = compose(
    backToBoard,
    gather(
        addPoints,
        compose(
            first,
            snake
        ),
        move,
    )
);

const willEat = compose(
    log('will eat', Boolean),
    gather(
        includesPoint,
        prop('apples'),
        nextHead,
    ),
);

export const growSnake = gather(
    push,
    snake,
    nextHead,
);

const moveSnake = compose(
    dropFirst,
    growSnake,
);

const nextSnake = branch(
    willEat,
    growSnake,
    moveSnake,
);

const nextApple = branch(
    willEat,
    compose(
        () => [randomInBoard()],
        log('nextApple random'),
    ),
    compose(
        apples,
        log('nextApple repeat'),
    ),
);

export const next = applySpec({
    snake: nextSnake,
    apples: nextApple,
    move,
});

export const changeMove = (direction = move.left) => applySpec({
    snake,
    apples,
    move: constant(direction),
});
