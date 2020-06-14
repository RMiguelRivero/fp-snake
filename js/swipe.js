let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
let $zone;

export const SWIPE = 'swipe';
export const SWIPE_UP = 'swipe:up';
export const SWIPE_DOWN = 'swipe:down';
export const SWIPE_RIGHT = 'swipe:right';
export const SWIPE_LEFT = 'swipe:left';

const SwipeUp = new CustomEvent(SWIPE, { detail: SWIPE_UP });
const SwipeDown = new CustomEvent(SWIPE, { detail: SWIPE_DOWN });
const SwipeLeft = new CustomEvent(SWIPE, { detail: SWIPE_LEFT });
const SwipeRight = new CustomEvent(SWIPE, { detail: SWIPE_RIGHT });

function handleGesure() {
    const horizontal = { direction: 'horizontal', value: touchendX - touchstartX };
    const vertical =  { direction: 'vertical', value: touchendY - touchstartY };
    const orientation = Math.abs(horizontal.value) > Math.abs(vertical.value)
        ? horizontal
        : vertical;
    const sign = Math.sign(orientation.value);

    switch (orientation.direction) {
        case 'horizontal':
            if (sign === 1) {
                $zone.dispatchEvent(SwipeRight);
            } else {
                $zone.dispatchEvent(SwipeLeft);
            }
            break;
        case 'vertical':
            if (sign === 1) {
                $zone.dispatchEvent(SwipeDown);
            } else {
                $zone.dispatchEvent(SwipeUp);
            }
            break;
        default:
            break;
    }
}

function touchStartHandler(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}
function touchEndHandler(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesure();
}




export function startTouchEvents(node = document.querySelector('body')) {
    $zone = node;
    $zone.addEventListener('touchstart', touchStartHandler, false);
    $zone.addEventListener('touchend', touchEndHandler, false);
}

export function endTouchEvents() {
    if (!$zone) return;
    $zone.removeEventListener(touchStartHandler);
    $zone.removeEventListener(touchEndHandler);
}
