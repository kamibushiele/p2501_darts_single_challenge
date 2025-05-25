import Alpine from 'https://unpkg.com/alpinejs@3.x.x/dist/module.esm.js'
import { Game } from './game.js';

const appGame = {
    /** @type {Game[]} */
    games: [],
    get currentGame() {
        if (this.games.length === 0) {
            return null; // ゲームがない場合はnullを返す
        }
        return this.games[this.games.length - 1]; // 最後のゲームを返す
    },
    init() {
        this.newGame(); // 初期化時に新しいゲームを開始
    },
    newGame() {
        const currentGame = this.currentGame;
        if (currentGame && !currentGame.gameFinished) {
            this.currentGame.gameFinished = true; // 現在のゲームを終了
        }
        this.games.push(new Game());
    },
    clearGame() {
        this.games.pop(); // 最後のゲームを削除
        if (this.games.length === 0) {
            this.newGame(); // 新しいゲームを開始
            return;
        } else {
            this.currentGame.gameFinished = false; // 現在のゲームを未完了に設定
        }
    }

}

Alpine.data("app", () => appGame);
Alpine.start();
