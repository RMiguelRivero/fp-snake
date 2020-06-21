import { compose, id, tap, chain } from './utils.js';
import { MOVES } from './snake.js';
import { setUpSwipe, SWIPE, SWIPE_UP, SWIPE_DOWN, SWIPE_RIGHT, SWIPE_LEFT } from './swipe.js';
import { drawFrame,  CANVAS_SIZE } from './canvas-renderer.js';
import { initStore, paused, snakeState, pause, next, changeSnakeMove, gameScore } from './store.js';

const FRAME_TIME = 200;

const $body = document.querySelector('body');
const $footer = document.querySelector('.footer');
$footer.style.width = CANVAS_SIZE[0] + 'px';
const $controls = document.querySelector('.controls');
const $buttons = document.querySelectorAll('.controls .button');
const $score = document.querySelector('.score');

function updateScore(score) {
    $score.innerHTML = score;
}
function updateControls(pause) {
    pause
        ? $controls.classList.add('paused')
        : $controls.classList.remove('paused');
}

const drawGame = compose(
    drawFrame,
    snakeState
);

let game = initStore();
drawGame(game);


const nextGame = chain(
    watcher,
    compose(
        tap(drawGame),
        next,
    )
);

function watcher(newGame) {
    return function (oldGame) {
        const newPaused = paused(newGame);
        if (!oldGame || newPaused !== paused(oldGame)) {
            updateControls(newPaused);
        }
        const newScore = gameScore(newGame);
        if (!oldGame || newScore !== gameScore(oldGame)) {
            updateScore(newScore)
        }
        return newGame;
    }
}

const frame = (t1) => (t2) => {
    if (!game.paused && t2 - t1 > FRAME_TIME) {
        game = nextGame(game);
        window.requestAnimationFrame(frame(t2));
    } else {
        window.requestAnimationFrame(frame(t1));
    }
}

function togglePause() {
    game = compose(
        tap(compose(
            updateControls,
            paused,
        )),
        pause
    )(game);
}

function eventListener(event) {
    if (paused(game) && !['KeyP', 'Space'].includes(event.code)) return;

    let fn;
    const key = event.type === 'swipe'
        ? event.detail
        : event.code;
    switch (key) {
        case 'ArrowUp':
        case SWIPE_UP:
            fn = changeSnakeMove(MOVES.UP);
            break;
        case 'ArrowDown':
        case SWIPE_DOWN:
            fn = changeSnakeMove(MOVES.DOWN);
            break;
        case 'ArrowRight':
        case SWIPE_RIGHT:
            fn = changeSnakeMove(MOVES.RIGHT);
            break;
        case 'ArrowLeft':
        case SWIPE_LEFT:
            fn = changeSnakeMove(MOVES.LEFT);
            break;
        case 'KeyP':
        case 'Space':
            fn = id;
            togglePause()
            break;
        default:
            fn = id;
            break;
    }
    game = fn(game)
}

window.addEventListener('keydown', eventListener);

setUpSwipe($body);
$body.addEventListener(SWIPE, eventListener);
$buttons.forEach(button => button.addEventListener('click', togglePause));

window.requestAnimationFrame(frame(0));
