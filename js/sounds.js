function createSound(file) {
    const snd = new Audio(file);
    snd.src = file;
    return snd;
}

export const eat = createSound('./assets/audio/eat.mp3');
