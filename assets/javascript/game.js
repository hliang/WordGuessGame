// var maxTries = 99; // max tries each game
var wins = 0;
var answerPool = {
    "apple": "assets/images/apple.jpg",
    "orange": "assets/images/orange.jpg",
    "banana": "assets/images/banana.jpg",
    "peach": "assets/images/peach.jpg",
    "lemon": "assets/images/lemon.jpg",
    "avocado": "assets/images/avocado.jpg",
    "pear": "assets/images/pear.jpg"
};

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
        this.randIndx = Math.floor(Math.random() * Object.keys(answerPool).length);
        this.answer0 = Object.keys(answerPool)[this.randIndx]; // original answer, case sensitive
        this.answer = this.answer0.toUpperCase(); // answer in upper case.
        this.imgUrl = answerPool[this.answer0];
        this.triesLeft = Math.ceil(this.answer.length * 1.8);
        this.keysTried = [];
        this.revealed = "_".repeat(this.answer.length);
        this.gameover = false;
        this.updatePage();
        console.log(this.answer0);
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

            // test if user input letter is in answer, and update revealed answer
            this.revealed = this.updateRevealed(chr);

            // update count of wins
            if (this.revealed === this.answer) { // win
                wins++;
                this.gameover = true;
                // remove element from pool, so that it won't reappear in the next games
                delete answerPool[this.answer0]
            } else if (this.revealed != this.answer && this.triesLeft <= 0) { // lose
                this.gameover = true;
            }
        }

    },

    // test if user input letter is in answer,
    // and update revealed characters.
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
        document.querySelector("#keysTried").textContent = "[" + this.keysTried + "]";
        document.querySelector("#gameover-msg").style.background = "none";

        if (this.gameover == false) {
            document.querySelector("#gameover-win").style.display = "none";
            document.querySelector("#gameover-lose").style.display = "none";
            // document.querySelector("#answerImg").style.display = "none";
        } else if (this.revealed === this.answer) { // end of game, win
            console.log("win!");
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
