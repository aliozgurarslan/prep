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
        guessedGroups: [], // To keep track of guessed groups in order
        selectedItems: [],
        previousGuesses: [],
        attemptsLeft: 4,
        wrongGuessMessage: "",
        successMessage: "",
        gameOverMessage: "", // Separate game over message
        isWrong: false,
        wrongGuessItems: [],
        currentDate: new Date().toLocaleDateString() // Get current date
    },
    created() {
        if (this.getCookie("played")) {
            this.gameOverMessage = "Bu oyunu zaten oynadınız. Yeniden oynamak için sayfayı güncelleyin.";
        } else {
            this.shuffleItems();
        }
    },
    computed: {
        remainingItems() {
            return this.items.filter(item => !this.correctItems.includes(item));
        },
        correctGroupsWithMessages() {
            let groupsWithMessages = [];
            for (let i = 0; i < this.guessedGroups.length; i++) {
                let index = this.guessedGroups[i];
                groupsWithMessages.push({
                    items: this.correctGroups[index],
                    message: this.correctGroupMessages[index]
                });
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

            let groupIndex = this.correctGroups.findIndex(group => {
                return this.arraysEqual(group.sort(), this.selectedItems.sort());
            });

            if (groupIndex !== -1) {
                this.correctItems.push(...this.selectedItems);
                this.guessedGroups.push(groupIndex);
                this.wrongGuessMessage = "";
                if (this.correctItems.length === this.items.length) {
                    this.successMessage = "Tebrikler! Bütün grupları bildiniz!";
                    this.setCookie("played", "true", 1);
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
                    this.gameOverMessage = 'Oyun bitti! Deneme hakkınız kalmadı. Yeniden oynamak için sayfayı güncelleyin.';
                    this.setCookie("played", "true", 1);
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
                    this.guessedGroups.push(i); // Add this line to include unrevealed groups
                }
            }
        },
        setCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },
        getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    }
});
