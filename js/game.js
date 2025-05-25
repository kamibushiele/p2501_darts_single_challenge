
/** @typedef {20| 19| 18| 17| 16| 15| 14| 13| 12| 11| 10| 9| 8| 7| 6| 5| 4| 3| 2| 1| "B"} Target_t */

class ThrowButton {
    constructor(status, text) {
        /** @type {number} */
        this.status = status; // 0: ハズレ, 1: おしい, 2: 命中
        /** @type {string} */
        this.text = text;
    }
    classText(status) {
        if (status == this.status) {
            switch (this.status) {
                case 0: return "btn-danger"; // ハズレ
                case 1: return "btn-warning"; // おしい
                case 2: return "btn-success"; // 命中
            }
        }else{
            return "btn-secondary";
        }
    }
}
class ThrowItem {
    /**
     *
     * @param {Target_t} target
     */
    constructor(target) {
        /** @type {Target_t} */
        this.target = target; // ターゲット
        this.status = null; // null: 未投, 0: ハズレ, 1: おしい, 2: 命中
        this.pointsMap = [0, 1, 2]; // ハズレ: 0点, おしい: 1点, 命中: 2点
        if (this.target === "B") {
            this.pointsMap = [0, 2, 3]; // BULLの場合は0: 外れ, 2: アウター, 3: インナー
        }

        this.buttons = [];
        for (let i = 0; i < this.pointsMap.length; i++) {
            this.buttons.push(new ThrowButton(i, "+" + this.pointsMap[i]));
        }
    }
    get points() {
        if (this.status === null) return 0; // 未投の場合は0点
        return this.pointsMap[this.status]
    }
    toString() {
        return String(this.target)
    }
    classText() {
        if (this.status != null) {
            return "btn-custom-green";
        }else{
        }
    }
    updateStatus(status) {
        if (status < 0 || status >= this.pointsMap.length) {
            throw new Error("Invalid status: " + status);
        }
        if (this.status === status) {
            this.status = null; // 既に同じステータスの場合は未投に戻す
        }else{
            this.status = status; // ステータスを更新
        }
        console.log(`Target: ${this.target}, Status: ${this.status}, Points: ${this.points}, Buttons: ${this.buttons.map(btn => btn.text).join(", ")}`);
    }
}

// ゲームクラス
export class Game {
    constructor() {
        /** @type {Target_t[]} */
        const targets = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "B"];
        /** @type {ThrowItem[]} */
        this.throws = targets.map(target => new ThrowItem(target));
        this.gameFinished = false;
    }
    get totalScore() {
        return this.throws.reduce((acc, throwItem) => acc + throwItem.points, 0);
    }
}
class AllGame {
    constructor() {
        /** @type {Game[]} */
        this.games = [];
        /** @type {number} */
        this.currentIndex = -1;
        this.newGame();
        this.buttonUpdated = false; // ボタン更新フラグ
        this.historyUpdated = false; // 履歴更新フラグ
    }
    currentGame() {
        return this.games[this.currentIndex];
    }
    drawCtrlButton(x, y) {
        if (this.buttonUpdated == true) {
            return;
        }
        this.buttonUpdated = true;
        const buttonWidth = BUTTON_GRID * 4;
        button(x - (buttonWidth / 2), y, buttonWidth, BUTTON_GRID, "新しいゲームを開始", "#4CAF50").mousePressed(() => {
            this.newGame();
        });
        button(x + (buttonWidth / 2), y, buttonWidth, BUTTON_GRID, "このゲームを戻す", "#883333").mousePressed(() => {
            this.removeCurrentGame();
        });
    }
    drawHistoryBox(x, y, w, h) {
        if (this.historyUpdated == true) {
            return;
        }
        this.historyUpdated = true;
        const finishedGames = this.games.filter(game => game.gameFinished);
        let historyText = ""
        if (finishedGames.length === 0) {
            historyText = "履歴がありません";
        } else {
            historyText += finishedGames.map((game) => game.totalScore).join(", ");
            historyText += `<br><br>ゲーム数: ${finishedGames.length}`;
            historyText += `<br>最高スコア: ${Math.max(...finishedGames.map(game => game.totalScore))}`;
            historyText += `<br>最低スコア: ${Math.min(...finishedGames.map(game => game.totalScore))}`;
            const averageScore = finishedGames.reduce((acc, game) => acc + game.totalScore, 0) / finishedGames.length;
            historyText += `<br>平均スコア: ${averageScore.toFixed(2)}`;
        }
        historyBox(x, y, w, h, historyText);
    }
    newGame() {
        const currentGame = this.currentGame();
        if (currentGame && !currentGame.gameFinished) {
            this.currentGame().gameFinished = true; // 現在のゲームを終了
        }
        this.games.push(new Game());
        this.currentIndex = this.games.length - 1;
        this.historyUpdated = false;
    }
    removeCurrentGame() {
        this.games.pop(); // 最後のゲームを削除
        if (this.games.length === 0) {
            this.currentIndex = -1; // ゲームがなくなった場合はインデックスをリセット
            this.newGame(); // 新しいゲームを開始
            return;
        } else {
            this.currentIndex = this.games.length - 1; // 現在のインデックスを更新
            this.currentGame().gameFinished = false; // 現在のゲームを未完了に設定
        }
        this.currentGame().throws.forEach(throwItem => throwItem.reDraw()); // すべての投擲アイテムを再描画
        this.historyUpdated = false;
    }

}
// let allGame = new AllGame();

// const windowWidth = 412;
// const windowHeight = 915;
// function setup() {
//     createCanvas(windowWidth, windowHeight);
//     textAlign(CENTER, CENTER);
// }

// function draw() {
//     const x14 = windowWidth / 4;
//     const x12 = windowWidth / 2;
//     const x34 = windowWidth / 4 * 3;
//     background(50);
//     textSize(TEXT_SIZE * 1.5);
//     fill(255);
//     const currentGame = allGame.currentGame();
//     const titleY = BUTTON_GRID/2;
//     text("合計スコア: " + currentGame.totalScore, windowWidth / 2, titleY);
//     const offsetX = BUTTON_GRID/2;
//     const offset_y = BUTTON_GRID*1.5;

//     const throws = currentGame.throws;
//     for (let i = 0; i < 2; i++) {
//         for (let j = 0; j < 11; j++) {
//             const index = i * 11 + j;
//             const x = offsetX + i * BUTTON_GRID * 4;
//             const y = offset_y + j * BUTTON_GRID;
//             if (index < throws.length) {
//                 const throwitem = throws[index];
//                 throwitem.drawInputUi(x, y);
//             } else {
//                 break
//             };
//         }
//     }
//     const ctrlButtony = offset_y + BUTTON_GRID * 11;
//     allGame.drawCtrlButton(x12, ctrlButtony);
//     const historyBoxY = ctrlButtony + BUTTON_GRID*0.5;
//     allGame.drawHistoryBox(0, historyBoxY, windowWidth, windowHeight - historyBoxY);
// }
