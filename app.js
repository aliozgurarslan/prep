new Vue({
    el: '#app',
    data: {
        items: [
            "Paris", "Tokyo", "Rio de Janeiro", "Londra",
            "Stokholm", "Tetik Parmak", "Dunning-Kruger", "Asperger",
            "Mısır", "Plastik Ördek", "Emoji", "Güneş",
            "Çay", "Sağlık", "Asker", "Ülkü"
        ],
        shuffledItems: [],
        correctGroups: [
            ["Paris", "Tokyo", "Rio de Janeiro", "Londra"],
            ["Stokholm", "Tetik Parmak", "Dunning-Kruger", "Asperger"],
            ["Mısır", "Plastik Ördek", "Emoji", "Güneş"],
            ["Çay", "Sağlık", "Asker", "Ülkü"]
        ],
        correctGroupMessages: [
            "Son dört Olimpiyat Oyunları ev sahipleri",
            "Sendromlar",
            "Sarı resmedilirler",
            "_____ Ocağı"
        ],
        correctItems: [],
        selected
