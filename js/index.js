import { compose, tap, prop, last, toArray, dropLast, id, branch } from './utils.js';
import { initialState, next, BOARD_DIMENSIONS, changeMove, MOVES, isGameOver } from './snake.js';
import { startTouchEvents, SWIPE, SWIPE_UP, SWIPE_DOWN, SWIPE_RIGHT, SWIPE_LEFT } from './swipe.js';

const FRAME_TIME = 150;
const SLOT = [20, 20];
const CANVAS_SIZE = [BOARD_DIMENSIONS[0] * SLOT[0], BOARD_DIMENSIONS[1] * SLOT[1]];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
[ canvas.width, canvas.height ] = CANVAS_SIZE;

const headColor = '#2B9E38';
const bodyColor = '#45B528';
const appleColor = 'red';

const $body = document.querySelector('body');
const $footer = document.querySelector('.footer');
$footer.style.width = CANVAS_SIZE[0] + 'px';
const $controls = document.querySelector('.controls');
const $buttons = document.querySelectorAll('.controls .button');
const $score = document.querySelector('.score');


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

function startGame() {
    let _state = initialState();
    return {
        get state () {
            return _state;
        },
        set state(newState) {
            if(newState.score !== _state.score) {
                updateScoreHandler(newState.score);
            }
            _state = newState;
        }
    }
}

function updateScoreHandler(score) {
    $score.innerHTML = score;
}

let game = startGame();
let paused = false;
const frame = (t1) => (t2) => {
    if (!paused && t2 - t1 > FRAME_TIME) {
        game.state = next(game.state);
        drawFrame(game.state);
        if (isGameOver(game.state)) {
            paused = true;
            setTimeout(() => paused = false, 2000)
            game.state = initialState();
        }
        window.requestAnimationFrame(frame(t2));
    } else {
        window.requestAnimationFrame(frame(t1));
    }
}

function playPause(wrapper) {
    return function playPauseHandler() {
        paused = !paused;
        if (paused) {
            wrapper.classList.add('paused');
        } else {
            wrapper.classList.remove('paused');
        }
    }
}

function eventListener(event) {
    if (paused && !['KeyP', 'Space'].includes(event.code)) return;

    let fn;
    const key = event.type === 'swipe'
        ? event.detail
        : event.code;
    switch (key) {
        case 'ArrowUp':
        case SWIPE_UP:
            fn = changeMove(MOVES.UP);
            break;
        case 'ArrowDown':
        case SWIPE_DOWN:
            fn = changeMove(MOVES.DOWN);
            break;
        case 'ArrowRight':
        case SWIPE_RIGHT:
            fn = changeMove(MOVES.RIGHT);
            break;
        case 'ArrowLeft':
        case SWIPE_LEFT:
            fn = changeMove(MOVES.LEFT);
            break;
        case 'KeyP':
        case 'Space':
            fn = id;
            playPause($controls)();
            break;
        default:
            fn = id;
            break;
    }
    game.state = fn(game.state)
}

window.addEventListener('keydown', eventListener);

startTouchEvents($body);
$body.addEventListener(SWIPE, eventListener);

window.requestAnimationFrame(frame(0));
$buttons.forEach(button => button.addEventListener('click', playPause($controls)));
