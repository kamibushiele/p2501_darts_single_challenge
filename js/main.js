import Alpine from 'https://unpkg.com/alpinejs@3.x.x/dist/module.esm.js'
import { GameApp } from './game.js';

const appGame = {
    game: new GameApp(),
}

Alpine.data("app", () => appGame);
Alpine.start();
