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
    isEmptyArray,
    id,
    increment,
    dropLast,
    not,
    diffPoints,
    tap,
} from './utils.js';
import { eat } from './sounds.js';


const eatEvent = new CustomEvent('eat');
const crashEvent = new CustomEvent('crash');
let $zone;

export function listeners(zone) {
    $zone = zone
}

const emit = (event) => branch(
    () => !!($zone),
    tap(() => $zone.emit(event))
);

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
const score = prop('score');
const backToBoard = modPoint(BOARD_DIMENSIONS[0], BOARD_DIMENSIONS[1]);

function spawnApple(state) {
    let newApple = randomInBoard();
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

const willCrash = gather(
    includesPoint,
    snake,
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

const emptySnake = constant([]);

const nextSnake = branch(
    willCrash,
    emptySnake,
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
    compose(
        branch(
            id,
            emit(eat),
        ),
        willEat,
    ),
    compose(
        increment,
        score,
    ),
    score,
);

export const isGameOver = compose(
    isEmptyArray,
    snake,
);

export const next = branch(
    isGameOver,
    id,
    applySpec({
        snake: nextSnake,
        apples: nextApple,
        score: nextScore,
        move,
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
    }),
);
