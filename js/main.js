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
    },
    log(){
        const finishedGames = this.games.filter(game => game.gameFinished);
        let historyText = ""
        if (finishedGames.length === 0) {
            historyText = "履歴がありません";
        } else {
            historyText += finishedGames.map((game) => game.totalScore).join(", ");
            historyText += `\n\nゲーム数: ${finishedGames.length}`;
            historyText += `\n最高スコア: ${Math.max(...finishedGames.map(game => game.totalScore))}`;
            historyText += `\n最低スコア: ${Math.min(...finishedGames.map(game => game.totalScore))}`;
            const averageScore = finishedGames.reduce((acc, game) => acc + game.totalScore, 0) / finishedGames.length;
            historyText += `\n平均スコア: ${averageScore.toFixed(2)}`;
        }
        return historyText;
    }
}

Alpine.data("app", () => appGame);
Alpine.start();
