import { compose, prop, branch, dropLast, toArray, last, tap } from './utils.js';
import { BOARD_DIMENSIONS, isGameOver } from './snake.js';

const SLOT = [20, 20];
export const CANVAS_SIZE = [BOARD_DIMENSIONS[0] * SLOT[0], BOARD_DIMENSIONS[1] * SLOT[1]];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
[ canvas.width, canvas.height ] = CANVAS_SIZE;

const headColor = '#2B9E38';
const bodyColor = '#45B528';
const appleColor = 'red';

function draw(color) {
    return function squares(positions) {
        for( const p of positions) {
            ctx.fillStyle = color;
            ctx.fillRect(p[0]*SLOT[0], p[1]*SLOT[1], SLOT[0], SLOT[1])
        }
    }
}

const drawApple = compose(
    draw(appleColor),
    prop('apples')
);

const drawSnakeHead = compose(
    draw(headColor),
    toArray,
    last,
    prop('snake')
);

const drawSnakeBody = compose(
    draw(bodyColor),
    dropLast,
    prop('snake')
);

const drawGameState = compose(
    tap(drawApple),
    tap(drawSnakeHead),
    tap(drawSnakeBody),
    tap(clearCanvas)
);

function drawCrash() {
    clearCanvas();
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.width);

    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2);
}

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.width);
}

export const drawFrame = branch(
    isGameOver,
    drawCrash,
    drawGameState
);
