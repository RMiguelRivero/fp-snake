import { compose, tap, prop } from './utils.js';
import { initialState, next, BOARD_DIMENSIONS, changeMove, MOVES } from './snake.js';

const FRAME_TIME = 150;
const SLOT = [20, 20];
const CANVAS_SIZE = [BOARD_DIMENSIONS[0] * SLOT[0], BOARD_DIMENSIONS[1] * SLOT[1]];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
[ canvas.width, canvas.height ] = CANVAS_SIZE;



function draw(color) {
    return function squares(positions) {
        for( const p of positions) {
            ctx.fillStyle = color;
            ctx.fillRect(p[0]*SLOT[0], p[1]*SLOT[1], SLOT[0], SLOT[1])
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.width);
}

const drawFrame = compose(
    tap(compose(
        draw('red'),
        prop('apples')
    )),
    tap(compose(
        draw('green'),
        prop('snake')
    )),
    tap(clearCanvas)
);



let state = initialState();
const frame = (t1) => (t2) => {
    if (t2 - t1 > FRAME_TIME) {
        // console.log('different frame')
        state = next(state);
        drawFrame(state);
        window.requestAnimationFrame(frame(t2));
    } else {
        // console.log('same frame')
        window.requestAnimationFrame(frame(t1));
    }
}

function keyUpEventListener(event) {
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
        default:
            fn = compose(
                changeMove,
                prop('move')
            )(state);
            break;
    }
    state = fn(state)
}

window.addEventListener('keydown', keyUpEventListener);
window.requestAnimationFrame(frame(0));
