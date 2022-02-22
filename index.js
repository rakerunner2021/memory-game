class AudioController {
    constructor() {
        this.backgroundMusic = new Audio('./assets/audio/background-music.mp3');
        this.moveSound = new Audio('./assets/audio/move.mp3');
        this.matchSound = new Audio('./assets/audio/match.mp3');
        this.victorySound = new Audio('./assets/audio/victory.mp3');
        this.defeatSound = new Audio('./assets/audio/defeat.mp3');
        this.backgroundMusic.volume = 0.2;
        this.victorySound.volume = 0.3;
        this.backgroundMusic.loop = true;
    }
    startMusic() {
        this.backgroundMusic.play();
    }
    stopMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
    move() {
        this.moveSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    defeat() {
        this.stopMusic();
        this.defeatSound.play();
    }
}

class MemoryGame {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.querySelector('.timer');
        this.counter = document.querySelector('.moves-counter');
        this.audioController = new AudioController();
        this.movesQuantity = document.querySelector('.moves-quantity');
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout (() => {
            this.audioController.startMusic();
            this.countdown = this.startCountDown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.counter.innerText = this.totalClicks;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.move();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            card.classList.add('visible'); 
            this.movesQuantity.innerText = this.totalClicks;
            if(this.cardToCheck)
                this.checkMatchCard(card);
            else
                this.cardToCheck = card;
        }
    }
    
    checkMatchCard(card) {
        if (this.checkTypeCard(card) === this.checkTypeCard(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.missCard(card, this.cardToCheck);

        this.cardToCheck = null;    
    }

    cardMatch(firstCard, secondCard) {
        this.matchedCards.push(firstCard);
        this.matchedCards.push(secondCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.winGame();
    }

    missCard(firstCard, secondCard) {
        this.busy = true;
        setTimeout(() => {
            firstCard.classList.remove('visible');
            secondCard.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    checkTypeCard (card) {
        return card.querySelectorAll('.card-value')[0].src;
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) 
                this.defeatGame();
            
        }, 1000);
    }

    defeatGame() {
        clearInterval(this.countdown);
        this.audioController.defeat();
        document.querySelector('.game-over-text').classList.add('visible');
    }

    winGame() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.querySelector('.victory-text').classList.add('visible');
    }

    canFlipCard(card) {
       return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

function ready () {
    let overlays = Array.from(document.querySelectorAll('.overlay-text'));
    let cards = Array.from(document.querySelectorAll('.card'));
    let game = new MemoryGame (120, cards);
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame ();
            
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}


(function shuffleCards() {
    let cards = Array.from(document.querySelectorAll('.card'));
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
})();


