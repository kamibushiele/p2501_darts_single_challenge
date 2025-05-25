
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
            return "throw-block throwed";
        }else{
            return "throw-block unthrowed";
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
