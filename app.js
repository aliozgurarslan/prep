new Vue({
    el: '#app',
    data: {
        items: [],
        shuffledItems: [],
        correctGroups: [],
        correctGroupMessages: [],
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
        showCookieConsent: true,
        wallNumber: 3,
        wallDate: "2024-07-29",
        googleSheetId: 'your_google_sheet_id_here',  // Replace with your Google Sheet ID
        apiKey: 'your_api_key_here'  // Replace with your Google Sheets API key
    },
    created() {
        this.fetchWallData();
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
        fetchWallData() {
            const sheetRange = 'Sheet1!A2:H'; // Adjust the range according to your sheet structure
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetId}/values/${sheetRange}?key=${this.apiKey}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const rows = data.values;
                    for (const row of rows) {
                        if (parseInt(row[0]) === this.wallNumber) {
                            this.wallDate = row[1];
                            this.correctGroups = [
                                row[2].split(', '),
                                row[3].split(', '),
                                row[4].split(', '),
                                row[5].split(', ')
                            ];
                            this.correctGroupMessages = [row[6], row[6], row[6], row[6]]; // Assuming the same message for all groups
                            this.items = this.correctGroups.flat();
                            this.shuffleItems();
                            break;
                        }
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        },
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

                // Check for near miss
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
