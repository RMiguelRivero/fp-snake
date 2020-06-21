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
const SQUARED_STYLE = 'squared';
const ROUNDED_STYLE = 'rounded';

let style = ROUNDED_STYLE;

function drawSquare(p) {
    ctx.fillRect(p[0]*SLOT[0], p[1]*SLOT[1], SLOT[0], SLOT[1])
}

function drawCircle(p) {
    ctx.beginPath();
    ctx.arc(
        p[0] * SLOT[0] + SLOT[0] / 2,
        p[1] * SLOT[1] + SLOT[1] / 2,
        SLOT[0] / 2,
        0,
        2 * Math.PI,
        false
    );
    ctx.fill();
}

function draw(color) {
    return function squares(positions) {
        for( const p of positions) {
            ctx.fillStyle = color;
            if (style === SQUARED_STYLE) {
                drawSquare(p);
            } else {
                drawCircle(p);
            }
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
    // clearCanvas();
    ctx.fillStyle = '#fff7';
    ctx.fillRect(0,0, canvas.width, canvas.width);

    ctx.fillStyle = 'black';
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

export function setStyle(st = ROUNDED_STYLE) {
    style = st;
};
