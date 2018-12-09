// var maxTries = 99; // max tries each game
var wins = 0;
var answerPool = ["apple", "orange", "banana", "peach", "lemon", "avocado", "pear"];
var imgPool = ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Honeycrisp.jpg/330px-Honeycrisp.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Orange-Whole-%26-Split.jpg/330px-Orange-Whole-%26-Split.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Banana_and_cross_section.jpg/1280px-Banana_and_cross_section.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/White_nectarine_and_cross_section02_edit.jpg/1280px-White_nectarine_and_cross_section02_edit.jpg"];

// declare variables
var guessgame = {
    randIndx: 0,
    answer: "",
    imgUrl: "#",
    triesLeft: -1,
    keysTried: [],
    revealed: "",
    gameover: true,
    // initialize the word to display. unreveaded letters are "*"
    newgame: function () {
        this.randIndx = Math.floor(Math.random() * answerPool.length);
        this.answer = answerPool[this.randIndx].toUpperCase(); // remove one element from array, assign it to answer  
        this.imgUrl = imgPool[this.randIndx];
        this.triesLeft = Math.ceil(this.answer.length * 1.8);
        this.keysTried = [];
        this.revealed = "_".repeat(this.answer.length);
        this.gameover = false;
        this.updatePage();
    },

    // update game based on user input
    betOn: function (chr) {
        if (this.gameover) {
            // won't accept user input if game is already ended.
            return;
        } else {
            // letters already tried
            if (!this.keysTried.includes(chr)) {
                this.keysTried.push(chr);
                // decrease tries left
                this.triesLeft--;
            }

            // update revealed answer
            this.revealed = this.updateRevealed(chr);

            // update count of wins
            if (this.revealed === this.answer) { // win
                wins++;
                this.gameover = true;
                // remove element from pool, so that it won't reappear in the next games
                answerPool.splice(this.randIndx, 1);
                imgPool.splice(this.randIndx, 1);
            } else if (this.revealed != this.answer && this.triesLeft <= 0) { // lose
                this.gameover = true;
            }
        }

    },

    // update revealed characters
    updateRevealed: function (chr) {
        ret = this.revealed;
        for (var i = 0; i < this.answer.length; i++) {
            if (chr === this.answer[i]) {
                ret = ret.substr(0, i) + chr + ret.substr(i + 1);
            }
        }
        return ret;
    },

    // update webpage scores, styles, etc.
    updatePage: function () {
        document.querySelector("#wins").textContent = wins;
        document.querySelector("#revealed").textContent = this.revealed;
        document.querySelector("#triesLeft").textContent = this.triesLeft;
        document.querySelector("#keysTried").textContent = "[ " + this.keysTried + " ]";
        document.querySelector("#gameover-msg").style.background = "none";

        if (this.gameover == false) {
            document.querySelector("#gameover-win").style.display = "none";
            document.querySelector("#gameover-lose").style.display = "none";
            // document.querySelector("#answerImg").style.display = "none";
        } else if (this.revealed === this.answer) { // end of game, win
            document.querySelector("#gameover-msg").style.background = "yellow";
            document.querySelector("#gameover-win").style.display = "block";
            document.querySelector("#gameover-lose").style.display = "none";
            document.querySelector("#answerImg").style.display = "inline-block";
            document.querySelector("#answerImg").src = this.imgUrl;

        } else if (this.revealed != this.answer && this.triesLeft <= 0) { // end of game, lose
            document.querySelector("#gameover-msg").style.background = "lightblue";
            document.querySelector("#gameover-win").style.display = "none";
            document.querySelector("#gameover-lose").style.display = "block";
        }
    }
}

// always start a new game when page is loaded
guessgame.newgame();
guessgame.updatePage();

// This function is run whenever the user presses a key.
document.onkeyup = function (event) {
    chr = event.key.toUpperCase();
    keycode = event.keyCode;
    console.log(" keycode: " + keycode + " pressed: " + chr);

    if (keycode == 13) { // press Enter to start new game
        guessgame.newgame();
    } else if (chr.match(/^[a-z]$/gi)) {
        guessgame.betOn(chr);
        guessgame.updatePage();
    }
}
