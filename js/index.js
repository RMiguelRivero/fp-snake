import { id } from './utils.js';
import { initialState, next, changeMove, MOVES } from './snake.js';
import { setUpSwipe, SWIPE, SWIPE_UP, SWIPE_DOWN, SWIPE_RIGHT, SWIPE_LEFT } from './swipe.js';
import { drawFrame,  CANVAS_SIZE } from './canvas-renderer.js';

const FRAME_TIME = 200;

const $body = document.querySelector('body');
const $footer = document.querySelector('.footer');
$footer.style.width = CANVAS_SIZE[0] + 'px';
const $controls = document.querySelector('.controls');
const $buttons = document.querySelectorAll('.controls .button');
const $score = document.querySelector('.score');

function startGame() {
    let _state = initialState();
    let _paused = false;
    return {
        get state() {
            return _state;
        },
        set state(newState) {
            if(newState.score !== _state.score) {
                updateScoreHandler(newState.score);
            }
            _state = newState;
            if(_state.gameOver) {
                this.paused = true;
            }
        },
        get paused() {
            return _paused;
        },
        set paused(value) {
            _paused = value;
            if (_paused) {
                $controls.classList.add('paused');
            } else {
                $controls.classList.remove('paused');
            }
        },
    }
}

function updateScoreHandler(score) {
    $score.innerHTML = score;
}

let game = startGame();
drawFrame(game.state);

function drawNext() {
    game.state = next(game.state);
    drawFrame(game.state);
}

const frame = (t1) => (t2) => {
    if (!game.paused && t2 - t1 > FRAME_TIME) {
        drawNext();
        window.requestAnimationFrame(frame(t2));
    } else {
        window.requestAnimationFrame(frame(t1));
    }
}

function togglePause() {
    game.paused = !game.paused;
}

function eventListener(event) {
    if (game.paused && !['KeyP', 'Space'].includes(event.code)) return;

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
            togglePause();
            break;
        default:
            fn = id;
            break;
    }
    game.state = fn(game.state)
}

window.addEventListener('keydown', eventListener);

setUpSwipe($body);
$body.addEventListener(SWIPE, eventListener);
$buttons.forEach(button => button.addEventListener('click', togglePause));

window.requestAnimationFrame(frame(0));
