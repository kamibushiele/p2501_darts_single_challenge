import Alpine from 'https://esm.sh/alpinejs@3.14.9';
import { GameApp } from './game.js';

const appGame = {
    game: new GameApp(),
}

Alpine.data("app", () => appGame);
Alpine.start();
