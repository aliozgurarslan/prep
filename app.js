new Vue({
    el: '#app',
    data: {
        items: ["Buldozer", "Amerikan", "Fransız", "Sanayi", "Odak", "Diyfram", "Objektif", "ISO", "Balalayka", "Üçgen", "Tulum", "Rebap", "Balaklava", "Kulaklık", "Bot", "Polar"],
        shuffledItems: [],
        correctGroups: [
            ["Buldozer", "Amerikan", "Fransız", "Sanayi"], // Devrimler
            ["Odak", "Diyfram", "Objektif", "ISO"], // Fotoğrafçılık terimleri
            ["Balalayka", "Üçgen", "Tulum", "Rebap"], // Sazlar
            ["Balaklava", "Kulaklık", "Bot", "Polar"] // Soğuktan korurlar
        ],
        correctGroupMessages: [
            "Devrimler",
            "Fotoğrafçılık terimleri",
            "Sazlar",
            "Soğuktan korurlar"
        ],
        correctItems: [],
        selectedItems: [],
        previousGuesses: [],
        attemptsLeft: 4,
        wrongGuessMessage: "",
        nearMissMessage: "",
        successMessage: "",
        gameOverMessage: "",
        isWrong: false,
        wrongGuessItems: [],
        showCookieConsent: true
    },
    created() {
        this.checkIfPlayedToday();
        if (this.shuffledItems.length === 0) {
            this.shuffleItems();
        }
        if (localStorage.getItem('cookieConsent')) {
            this.showCookieConsent = false;
        }
    },
    computed: {
        remainingItems() {
            return this.shuffledItems.filter(item => !this.correctItems.includes(item));
        },
        correctGroupsWithMessages() {
            return this.correctGroups.map((group, index) => ({
                items: group,
                message: this.correctGroupMessages[index]
            })).filter(group => group.items.every(item => this.correctItems.includes(item)));
        }
    },
    methods: {
        toggleSelection(item) {
            if (this.selectedItems.includes(item)) {
                this.selectedItems = this.selectedItems.filter(i => i !== item);
            } else {
                if (this.selectedItems.length < 4) {
                    this.selectedItems.push(item);
                }
            }
        },
        checkResults() {
            if (this.selectedItems.length !== 4) {
                this.wrongGuessMessage = 'Lütfen dört öğe seçin.';
                return;
            }

            let currentGuess = [...this.selectedItems].sort().toString();
            if (this.previousGuesses.includes(currentGuess)) {
                this.wrongGuessMessage = 'Bu tahmini zaten yaptınız.';
                this.selectedItems = [];
                return;
            }

            this.previousGuesses.push(currentGuess);

            let isCorrect = this.correctGroups.some(group => {
                return this.arraysEqual(group.sort(), this.selectedItems.sort());
            });

            if (isCorrect) {
                this.correctItems.push(...this.selectedItems);
                this.wrongGuessMessage = "";
                this.nearMissMessage = "";
                if (this.correctItems.length === this.items.length) {
                    this.successMessage = "Tebrikler! Duvarı yendiniz! Her gün yeni bir duvar.";
                }
                this.storeGameState();
            } else {
                this.wrongGuessItems = [...this.selectedItems];
                this.wrongGuessMessage = "Yanlış tahmin!";
                this.isWrong = true;
                setTimeout(() => {
                    this.isWrong = false;
                    this.wrongGuessItems = [];
                }, 3000);
                this.attemptsLeft--;

                let nearMiss = this.correctGroups.some(group => {
                    let intersection = group.filter(item => this.selectedItems.includes(item));
                    return intersection.length === 3;
                });
                if (nearMiss) {
                    this.nearMissMessage = "Bir yaklaşık!";
                } else {
                    this.nearMissMessage = "";
                }

                if (this.attemptsLeft === 0) {
                    this.revealAllGroups();
                    this.gameOverMessage = 'Bugün duvar galip geldi! Her gün yeni bir duvar.';
                }
                this.storeGameState();
            }

            this.selectedItems = [];
        },
        arraysEqual(a, b) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        },
        shuffleItems() {
            this.shuffledItems = [...this.items].sort(() => Math.random() - 0.5);
            this.storeGameState();
        },
        deselectAll() {
            this.selectedItems = [];
        },
        revealAllGroups() {
            this.correctGroups.forEach(group => {
                if (!group.every(item => this.correctItems.includes(item))) {
                    this.correctItems.push(...group);
                }
            });
        },
        storeGameState() {
            localStorage.setItem('playedToday', true);
            localStorage.setItem('gameState', JSON.stringify({
                correctItems: this.correctItems,
                selectedItems: this.selectedItems,
                previousGuesses: this.previousGuesses,
                attemptsLeft: this.attemptsLeft,
                wrongGuessMessage: this.wrongGuessMessage,
                nearMissMessage: this.nearMissMessage,
                successMessage: this.successMessage,
                gameOverMessage: this.gameOverMessage,
                shuffledItems: this.shuffledItems
            }));
        },
        checkIfPlayedToday() {
            const playedToday = localStorage.getItem('playedToday');
            const gameState = JSON.parse(localStorage.getItem('gameState'));
            if (playedToday && gameState) {
                this.correctItems = gameState.correctItems;
                this.selectedItems = gameState.selectedItems;
                this.previousGuesses = gameState.previousGuesses;
                this.attemptsLeft = gameState.attemptsLeft;
                this.wrongGuessMessage = gameState.wrongGuessMessage;
                this.nearMissMessage = gameState.nearMissMessage;
                this.successMessage = gameState.successMessage;
                this.gameOverMessage = gameState.gameOverMessage;
                this.shuffledItems = gameState.shuffledItems || this.items;
            } else {
                this.shuffleItems();
            }
        },
        acceptCookies() {
            this.showCookieConsent = false;
            localStorage.setItem('cookieConsent', true);
        }
    }
});
