import { compose, tap, prop, first, last, toArray, dropLast, id, branch, log } from './utils.js';
import { initialState, next, BOARD_DIMENSIONS, changeMove, MOVES, isGameOver } from './snake.js';
import { startTouchEvents, SWIPE, SWIPE_UP, SWIPE_DOWN, SWIPE_RIGHT, SWIPE_LEFT } from './swipe.js';
import { Gru, Banana, getRandomMinion } from './images.js';

const FRAME_TIME = 150;
const SLOT = [20, 20];
const CANVAS_SIZE = [BOARD_DIMENSIONS[0] * SLOT[0], BOARD_DIMENSIONS[1] * SLOT[1]];

const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');
[ $canvas.width, $canvas.height ] = CANVAS_SIZE;

const headColor = '#2B9E38';
const bodyColor = '#45B528';
const appleColor = 'red';

const $body = document.querySelector('body');
const $footer = document.querySelector('.footer');
$footer.style.width = CANVAS_SIZE[0] + 'px';
const $resume = document.querySelector('.resume');
const $buttons = document.querySelectorAll('.button');
const $score = document.querySelector('.score');


function draw(color) {
    return function squares(positions) {
        for( const p of positions) {
            ctx.fillStyle = color;
            ctx.fillRect(p[0]*SLOT[0], p[1]*SLOT[1], SLOT[0], SLOT[1])
        }
    }
}

function playSound(snd) {
    return function() {
        snd.play();
    }
}

function drawCharacter(character){
    return function drawImage(p) {
        ctx.drawImage(character, p[0]*SLOT[0], p[1]*SLOT[1], SLOT[0], SLOT[1]);
    }
}

// function drawMinion()
function enclosedMinions() {
    const minionsQueue = [];
    return function minions(positions) {
        while (positions.length != minionsQueue.length) {
            minionsQueue.unshift(getRandomMinion());
        }
        for (let i = 0; i < positions.length; i++) {
            drawCharacter(minionsQueue[i])(positions[i]);
        }
    }
}
const drawMinions = enclosedMinions();
const drawGru = drawCharacter(Gru);
const drawBanana = drawCharacter(Banana);

function drawCrash() {
    clearCanvas();
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, $canvas.width, $canvas.width);

    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2);
}

function clearCanvas() {
    ctx.clearRect(0,0, $canvas.width, $canvas.width);
}

const drawFrame = branch(
    isGameOver,
    drawCrash,
    compose(
        tap(compose(
            // draw(appleColor),
            drawBanana,
            first,
            prop('apples')
        )),
        tap(compose(
            // draw(headColor),
            // toArray,
            drawGru,
            last,
            prop('snake')
        )),
        tap(compose(
            drawMinions,
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
    paused = !paused;
    if (paused) {
        wrapper.classList.add('paused');
    } else {
        wrapper.classList.remove('paused');
    }
}

function eventListener(event) {
    const { type } = event
    const key = type === 'click'
        ? event.target.attributes['data-action'].value
        : type === 'swipe'
            ? event.detail
            : event.code;
    if (paused && !['KeyP', 'Space', 'play'].includes(key)) return;
    let fn;
    switch (key) {
        case 'ArrowUp':
        case 'up':
        case SWIPE_UP:
            fn = changeMove(MOVES.UP);
            break;
        case 'ArrowDown':
        case 'down':
        case SWIPE_DOWN:
            fn = changeMove(MOVES.DOWN);
            break;
        case 'ArrowRight':
        case 'right':
        case SWIPE_RIGHT:
            fn = changeMove(MOVES.RIGHT);
            break;
        case 'ArrowLeft':
        case 'left':
        case SWIPE_LEFT:
            fn = changeMove(MOVES.LEFT);
            break;
        case 'KeyP':
        case 'Space':
        case 'play':
        case 'pause':
            fn = id;
            playPause($resume);
            break;
        default:
            fn = id;
            break;
    }
    game.state = fn(game.state)
}


window.addEventListener('keydown', eventListener);
startTouchEvents($body);
$canvas.addEventListener(SWIPE, eventListener);
$buttons.forEach((button) => button.addEventListener('click', eventListener));
window.requestAnimationFrame(frame(0));