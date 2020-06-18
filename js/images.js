function createImage(file) {
    const img = new Image(20, 20);
    img.src = file;
    return img;
}

export const Gru = createImage('./assets/images/gru.png');
export const Banana = createImage('./assets/images/banana.png');
export const M1 = createImage('./assets/images/minion-1.png');
export const M2 = createImage('./assets/images/minion-2.png');
export const M3 = createImage('./assets/images/minion-3.png');
export const M4 = createImage('./assets/images/minion-4.png');
export const M5 = createImage('./assets/images/minion-5.png');

const MINIONS = [M1, M2, M3, M4, M5];

export function getRandomMinion() {
    return MINIONS[Math.floor(Math.random() * MINIONS.length)];
}
