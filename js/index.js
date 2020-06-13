import { compose, tap, prop, last, toArray, dropLast, id, branch } from './utils.js';
import { initialState, next, BOARD_DIMENSIONS, changeMove, MOVES, isGameOver } from './snake.js';

const FRAME_TIME = 150;
const SLOT = [20, 20];
const CANVAS_SIZE = [BOARD_DIMENSIONS[0] * SLOT[0], BOARD_DIMENSIONS[1] * SLOT[1]];

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

function drawCrash() {
    clearCanvas();
    ctx.fillStyle = 'red';
    ctx.fillRect(0,0, canvas.width, canvas.width);
}

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.width);
}

const drawFrame = branch(
    isGameOver,
    drawCrash,
    compose(
        tap(compose(
            draw(appleColor),
            prop('apples')
        )),
        tap(compose(
            draw(headColor),
            toArray,
            last,
            prop('snake')
        )),
        tap(compose(
            draw(bodyColor),
            dropLast,
            prop('snake')
        )),
        tap(clearCanvas)
    )
);

let state = initialState();
let paused = false;
const frame = (t1) => (t2) => {
    if (!paused && t2 - t1 > FRAME_TIME) {
        state = next(state);
        drawFrame(state);
        if (isGameOver(state)) {
            paused = true;
            setTimeout(() => paused = false, 2000)
            state = initialState();
        }
        window.requestAnimationFrame(frame(t2));
    } else {
        window.requestAnimationFrame(frame(t1));
    }
}

function keyUpEventListener(event) {
    if (paused) return;

    let fn;
    switch (event.key) {
        case 'ArrowUp':
            fn = changeMove(MOVES.UP);
            break;
        case 'ArrowDown':
            fn = changeMove(MOVES.DOWN);
            break;
        case 'ArrowRight':
            fn = changeMove(MOVES.RIGHT);
            break;
        case 'ArrowLeft':
            fn = changeMove(MOVES.LEFT);
            break;
        case 'p':
            fn = id;
            paused = !paused;
            break;
        default:
            fn = id;
            break;
    }
    state = fn(state)
}

window.addEventListener('keydown', keyUpEventListener);
window.requestAnimationFrame(frame(0));
