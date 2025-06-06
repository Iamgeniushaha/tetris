class Tetris {
    constructor() {
        this.socket = io();
        this.blockQueue = this.shuffleBlocks(); // 초기 블록 큐 생성
        this.stageWidth = 10;
        this.stageHeight = 20;
        this.stageCanvas = document.getElementById("stage");
        this.nextCanvas = document.getElementById("next");
        let cellWidth = this.stageCanvas.width / this.stageWidth;
        let cellHeight = this.stageCanvas.height / this.stageHeight;
        this.cellSize = cellWidth < cellHeight ? cellWidth : cellHeight;
        this.stageLeftPadding = (this.stageCanvas.width - this.cellSize * this.stageWidth) / 2;
        this.stageTopPadding = (this.stageCanvas.height - this.cellSize * this.stageHeight) / 2;
        this.blocks = this.createBlocks();
        this.deletedLines = 0;
        this.blockQueue = this.shuffleBlocks(); // 초기 블록 큐 생성

        window.onkeydown = (e) => {
            if (e.keyCode === 37) {
                this.moveLeft();
            } else if (e.keyCode === 38) {
                this.rotate();
            } else if (e.keyCode === 39) {
                this.moveRight();
            } else if (e.keyCode === 40) {
                this.fall();
            } else if(e.keyCode === 32){
                this.fall();
            }
        }
    }

    createBlocks() {
        let blocks = [
            {
                shape: [[[-1, 0], [0, 0], [1, 0], [2, 0]],
                    [[0, -1], [0, 0], [0, 1], [0, 2]],
                    [[-1, 0], [0, 0], [1, 0], [2, 0]],
                    [[0, -1], [0, 0], [0, 1], [0, 2]]],
                color: "rgb(0, 255, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 128)"
            },
            {
                shape: [[[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]],
                    [[0, 0], [1, 0], [0, 1], [1, 1]]],
                color: "rgb(255, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 128, 0)"
            },
            {
                shape: [[[0, 0], [1, 0], [-1, 1], [0, 1]],
                    [[-1, -1], [-1, 0], [0, 0], [0, 1]],
                    [[0, 0], [1, 0], [-1, 1], [0, 1]],
                    [[-1, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(0, 255, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 128, 0)"
            },
            {
                shape: [[[-1, 0], [0, 0], [0, 1], [1, 1]],
                    [[0, -1], [-1, 0], [0, 0], [-1, 1]],
                    [[-1, 0], [0, 0], [0, 1], [1, 1]],
                    [[0, -1], [-1, 0], [0, 0], [-1, 1]]],
                color: "rgb(255, 0, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 0)"
            },
            {
                shape: [[[-1, -1], [-1, 0], [0, 0], [1, 0]],
                    [[0, -1], [1, -1], [0, 0], [0, 1]],
                    [[-1, 0], [0, 0], [1, 0], [1, 1]],
                    [[0, -1], [0, 0], [-1, 1], [0, 1]]],
                color: "rgb(0, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(0, 0, 128)"
            },
            {
                shape: [[[1, -1], [-1, 0], [0, 0], [1, 0]],
                    [[0, -1], [0, 0], [0, 1], [1, 1]],
                    [[-1, 0], [0, 0], [1, 0], [-1, 1]],
                    [[-1, -1], [0, -1], [0, 0], [0, 1]]],
                color: "rgb(255, 165, 0)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 82, 0)"
            },
            {
                shape: [[[0, -1], [-1, 0], [0, 0], [1, 0]],
                    [[0, -1], [0, 0], [1, 0], [0, 1]],
                    [[-1, 0], [0, 0], [1, 0], [0, 1]],
                    [[0, -1], [-1, 0], [0, 0], [0, 1]]],
                color: "rgb(255, 0, 255)",
                highlight: "rgb(255, 255, 255)",
                shadow: "rgb(128, 0, 128)"
            }
        ];
        return blocks;
    }

    drawBlock(x, y, type, angle, canvas) {
        let context = canvas.getContext("2d");
        let block = this.blocks[type];
        for (let i = 0; i < block.shape[angle].length; i++) {
            this.drawCell(context,
                x + (block.shape[angle][i][0] * this.cellSize),
                y + (block.shape[angle][i][1] * this.cellSize),
                this.cellSize,
                type);
        }
    }

    drawCell(context, cellX, cellY, cellSize, type) {
        let block = this.blocks[type];
        let adjustedX = cellX + 0.5;
        let adjustedY = cellY + 0.5;
        let adjustedSize = cellSize - 1;
        context.fillStyle = block.color;
        context.fillRect(adjustedX, adjustedY, adjustedSize, adjustedSize);
        context.strokeStyle = block.highlight;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX, adjustedY);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
        context.strokeStyle = block.shadow;
        context.beginPath();
        context.moveTo(adjustedX, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY + adjustedSize);
        context.lineTo(adjustedX + adjustedSize, adjustedY);
        context.stroke();
    }

    startGame() {
        let virtualStage = new Array(this.stageWidth);
        for (let i = 0; i < this.stageWidth; i++) {
            virtualStage[i] = new Array(this.stageHeight).fill(null);
        }
        this.virtualStage = virtualStage;
        this.currentBlock = null;
        this.nextBlock = this.getRandomBlock();
        this.mainLoop();
    }

    mainLoop() {
        if (this.currentBlock == null) {
            if (!this.createNewBlock()) {
                return;
            }
        } else {
            this.fallBlock();
        }
        this.drawStage();
        if (this.currentBlock != null) {
            this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
                this.stageTopPadding + this.blockY * this.cellSize,
                this.currentBlock, this.blockAngle, this.stageCanvas);
        }
        setTimeout(this.mainLoop.bind(this), 500);
    }

    createNewBlock() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = this.getRandomBlock();
        this.blockX = Math.floor(this.stageWidth / 2 - 2);
        this.blockY = 0;
        this.blockAngle = 0;
        this.drawNextBlock();
        if (!this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, this.blockAngle)) {
            let messageElem = document.getElementById("message");
            messageElem.innerText = "GAME OVER";
            return false;
        }
        return true;
    }

    drawNextBlock() {
        this.clear(this.nextCanvas);
        this.drawBlock(this.cellSize * 2, this.cellSize, this.nextBlock,
            0, this.nextCanvas);
    }


    shuffleBlocks() {
        let blocks = [0, 1, 2, 3, 4, 5, 6];
        for (let i = blocks.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // Fisher-Yates Shuffle
        }
        return blocks;
    }

    getRandomBlock() {
        if (this.blockQueue.length === 0) {
            this.blockQueue = this.shuffleBlocks(); // 모든 블록을 사용하면 다시 섞음
        }
        return this.blockQueue.pop(); // 순서대로 하나씩 반환
    }

    fallBlock() {
        if (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle)) {
            this.blockY++;
        } else {
            this.fixBlock(this.blockX, this.blockY, this.currentBlock, this.blockAngle);
            this.currentBlock = null;
        }
    }

    checkBlockMove(x, y, type, angle) {
        for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
            let cellX = x + this.blocks[type].shape[angle][i][0];
            let cellY = y + this.blocks[type].shape[angle][i][1];
            if (cellX < 0 || cellX > this.stageWidth - 1) {
                return false;
            }
            if (cellY > this.stageHeight - 1) {
                return false;
            }
            if (this.virtualStage[cellX][cellY] != null) {
                return false;
            }
        }
        return true;
    }

    // fixBlock(x, y, type, angle) {
    //     for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
    //         let cellX = x + this.blocks[type].shape[angle][i][0];
    //         let cellY = y + this.blocks[type].shape[angle][i][1];
    //         if (cellY >= 0) {
    //             this.virtualStage[cellX][cellY] = type;
    //         }
    //     }
    //     for (let y = this.stageHeight - 1; y >= 0; ) {
    //         let filled = true;
    //         for (let x = 0; x < this.stageWidth; x++) {
    //             if (this.virtualStage[x][y] == null) {
    //                 filled = false;
    //                 break;
    //             }
    //         }
    //         if (filled) {
    //             for (let y2 = y; y2 > 0; y2--) {
    //                 for (let x = 0; x < this.stageWidth; x++) {
    //                     this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
    //                 }
    //             }
    //             for (let x = 0; x < this.stageWidth; x++) {
    //                 this.virtualStage[x][0] = null;
    //             }
    //             let linesElem = document.getElementById("lines");
    //             this.deletedLines++;
    //             linesElem.innerText = "" + this.deletedLines;
    //         } else {
    //             y--;
    //         }
    //     }
    // }

    fixBlock(x, y, type, angle) {
        for (let i = 0; i < this.blocks[type].shape[angle].length; i++) {
            let cellX = x + this.blocks[type].shape[angle][i][0];
            let cellY = y + this.blocks[type].shape[angle][i][1];
            if (cellY >= 0) {
                this.virtualStage[cellX][cellY] = type; // 블록을 가상 스테이지에 고정
            }
        }

        let deletedThisTurn = 0; // 이번 턴에서 지운 줄 개수

        for (let y = this.stageHeight - 1; y >= 0; ) {  // 바닥부터 검사
            let filled = true;
            for (let x = 0; x < this.stageWidth; x++) {
                if (this.virtualStage[x][y] == null) { // 한 줄에 빈 공간이 있으면 삭제하지 않음
                    filled = false;
                    break;
                }
            }
            if (filled) { // 가득 찬 줄이 있다면 삭제 처리
                deletedThisTurn++; // 이번 턴에서 삭제된 줄 증가

                for (let y2 = y; y2 > 0; y2--) { // 한 줄씩 아래로 내림
                    for (let x = 0; x < this.stageWidth; x++) {
                        this.virtualStage[x][y2] = this.virtualStage[x][y2 - 1];
                    }
                }
                for (let x = 0; x < this.stageWidth; x++) { // 최상단은 빈 칸으로 초기화
                    this.virtualStage[x][0] = null;
                }
                let linesElem = document.getElementById("lines"); // UI 업데이트
                this.deletedLines += 1; // 총 삭제된 줄 개수 증가
                linesElem.innerText = "" + this.deletedLines;
            } else {
                y--; // 다음 줄 검사
            }
        }

        if (deletedThisTurn > 0) {
            const deleteMapping = { 1: 2, 2: 5, 3: 8 };
            socket.emit('line_deleted', deleteMapping[deletedThisTurn] || 12);
            console.log(`이번 턴에서 ${deletedThisTurn}줄 삭제됨!`);
        }
    }


    drawStage() {
        this.clear(this.stageCanvas);

        let context = this.stageCanvas.getContext("2d");
        for (let x = 0; x < this.virtualStage.length; x++) {
            for (let y = 0; y < this.virtualStage[x].length; y++) {
                if (this.virtualStage[x][y] != null) {
                    this.drawCell(context,
                        this.stageLeftPadding + (x * this.cellSize),
                        this.stageTopPadding + (y * this.cellSize),
                        this.cellSize,
                        this.virtualStage[x][y]);
                }
            }
        }
    }

    moveLeft() {
        if (this.checkBlockMove(this.blockX - 1, this.blockY, this.currentBlock, this.blockAngle)) {
            this.blockX--;
            this.refreshStage();
        }
    }

    moveRight() {
        if (this.checkBlockMove(this.blockX + 1, this.blockY, this.currentBlock, this.blockAngle)) {
            this.blockX++;
            this.refreshStage();
        }
    }

    rotate() {
        let newAngle;
        if (this.blockAngle < 3) {
            newAngle = this.blockAngle + 1;
        } else {
            newAngle = 0;
        }
        if (this.checkBlockMove(this.blockX, this.blockY, this.currentBlock, newAngle)) {
            this.blockAngle = newAngle;
            this.refreshStage();
        }
    }

    fall() {
        while (this.checkBlockMove(this.blockX, this.blockY + 1, this.currentBlock, this.blockAngle)) {
            this.blockY++;
            this.refreshStage();
        }
    }

    refreshStage() {
        this.clear(this.stageCanvas);
        this.drawStage();
        this.drawBlock(this.stageLeftPadding + this.blockX * this.cellSize,
            this.stageTopPadding + this.blockY * this.cellSize,
            this.currentBlock, this.blockAngle, this.stageCanvas);
    }

    clear(canvas) {
        let context = canvas.getContext("2d");
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}