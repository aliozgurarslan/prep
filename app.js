new Vue({
    el: '#app',
    data: {
        items: ["KARA", "HASAN", "GALİP", "ENİŞTE", "BAŞ", "ALT", "ÜST", "ARA", "GÜNEY", "KUZEY", "KANDİLLİ", "HİSAR", "KEFİYE", "KARPUZ", "ANAHTAR", "ZEYTİN AĞACI"],
        correctGroups: [
            ["KARA", "HASAN", "GALİP", "ENİŞTE"],
            ["BAŞ", "ALT", "ÜST", "ARA"],
            ["GÜNEY", "KUZEY", "KANDİLLİ", "HİSAR"],
            ["KEFİYE", "KARPUZ", "ANAHTAR", "ZEYTİN AĞACI"]
        ],
        correctGroupMessages: [
            "Orhan Pamuk romanlarındaki katiller.",
            "Türkçe ön ekler.",
            "Boğaziçi Üniversitesi yerleşke isimleri.",
            "Filistin direnişinin sembolleri."
        ],
        correctItems: [],
        selectedItems: [],
        previousGuesses: [],
        attemptsLeft: 4,
        wrongGuessMessage: "",
        successMessage: "",
        gameOverMessage: "",
        isWrong: false,
        wrongGuessItems: []
    },
    created() {
        this.shuffleItems();
        this.checkIfPlayedToday();
    },
    computed: {
        remainingItems() {
            return this.items.filter(item => !this.correctItems.includes(item));
        },
        correctGroupsWithMessages() {
            let groupsWithMessages = [];
            for (let i = 0; i < this.correctGroups.length; i++) {
                let groupItems = this.correctGroups[i];
                if (groupItems.every(item => this.correctItems.includes(item))) {
                    groupsWithMessages.push({
                        items: groupItems,
                        message: this.correctGroupMessages[i]
                    });
                }
            }
            return groupsWithMessages;
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
                if (this.correctItems.length === this.items.length) {
                    this.successMessage = "Tebrikler! Bütün grupları bildiniz!";
                    this.storeGameState();
                }
            } else {
                this.wrongGuessItems = [...this.selectedItems];
                this.wrongGuessMessage = "Yanlış tahmin!";
                this.isWrong = true;
                setTimeout(() => {
                    this.isWrong = false;
                    this.wrongGuessItems = [];
                }, 3000);
                this.attemptsLeft--;
                if (this.attemptsLeft === 0) {
                    this.revealAllGroups();
                    this.gameOverMessage = 'Bugün duvar galip geldi! Yeni bir duvar için yarın tekrar ziyaret edin.';
                    this.storeGameState();
                }
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
            this.items = this.items.sort(() => Math.random() - 0.5);
        },
        deselectAll() {
            this.selectedItems = [];
        },
        revealAllGroups() {
            for (let i = 0; i < this.correctGroups.length; i++) {
                let groupItems = this.correctGroups[i];
                if (!groupItems.every(item => this.correctItems.includes(item))) {
                    this.correctItems.push(...groupItems);
                }
            }
        },
        storeGameState() {
            localStorage.setItem('playedToday', true);
            localStorage.setItem('gameState', JSON.stringify({
                correctItems: this.correctItems,
                attemptsLeft: this.attemptsLeft,
                successMessage: this.successMessage,
                gameOverMessage: this.gameOverMessage
            }));
        },
        checkIfPlayedToday() {
            const playedToday = localStorage.getItem('playedToday');
            const gameState = JSON.parse(localStorage.getItem('gameState'));
            if (playedToday && gameState) {
                this.correctItems = gameState.correctItems;
                this.attemptsLeft = gameState.attemptsLeft;
                this.successMessage = gameState.successMessage;
                this.gameOverMessage = gameState.gameOverMessage;
            }
        }
    }
});
