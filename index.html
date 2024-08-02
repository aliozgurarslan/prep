<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dört adet dörtlü grup oluştur!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }

        .container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            overflow: hidden;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            margin: 20px 0;
        }

        .correct-groups-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .correct-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
            width: 100%;
            background-color: #729B9B;
            padding: 10px;
            border-radius: 5px;
            box-sizing: border-box;
        }

        .correct-group div {
            font-size: 12px;
            color: #E1FFE2;
            font-weight: 600;
        }

        .correct-group p {
            margin: 5px 0;
            font-size: 14px;
            color: #E1FFE2;
            font-weight: 600;
            text-align: center;
        }

        .grid-item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 60px;
            padding: 15px;
            background-color: #B0C4DE;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s, font-size 0.3s;
            box-sizing: border-box;
            font-size: calc(10px + 1vw);
        }

        .grid-item.selected {
            background-color: #555D66;
        }

        .grid-item.correct {
            background-color: #729B8C;
        }

        .grid-item.wrong {
            animation: flash-red 2s;
        }

        @keyframes flash-red {
            0% { background-color: #A24242; }
            100% { background-color: #B0C4DE; }
        }

        button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            background-color: #778290;
            color: white;
            margin: 10px 5px;
            transition: background-color 0.3s;
        }

        button:hover {
            background-color: #555D66;
        }

        .message {
            margin-top: 10px;
            font-size: 14px;
            color: #A24242;
            font-weight: 600;
        }

        .success-message {
            margin-top: 10px;
            font-size: 16px;
            color: #729B9B;
        }

        .game-over-message {
            margin-top: 10px;
            font-size: 16px;
            color: #A24242;
            font-weight: bold;
        }

        .attempts-left {
            margin-top: 10px;
            font-size: 14px;
        }

        .wall-number {
            margin-top: 10px;
            font-size: 12px;
        }

        .cookie-consent {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            max-width: 400px;
            width: calc(100% - 20px);
            box-sizing: border-box;
        }

        .cookie-consent button {
            background-color: #555D66;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            border-radius: 3px;
        }

        .cookie-consent button:hover {
            background-color: #777;
        }
    </style>
</head>
<body>
    <div id="app" class="container">
        <h1>Dört adet dörtlü grup oluştur!</h1>
        <div class="correct-groups-container">
            <div v-for="(group, index) in correctGroupsWithMessages" :key="index" class="correct-group">
                <div>{{ group.items.join(', ') }}</div>
                <p>{{ group.message }}</p>
            </div>
        </div>
        <div class="grid">
            <div v-for="item in remainingItems" :key="item" @click="toggleSelection(item)" :class="{'grid-item': true, 'selected': selectedItems.includes(item), 'wrong': wrongGuessItems.includes(item)}">
                {{ item }}
            </div>
        </div>
        <p class="attempts-left">Kalan hak: {{ attemptsLeft }}</p>
        <div v-if="wrongGuessMessage || nearMissMessage" class="message">
            <span>{{ wrongGuessMessage }}</span>
            <span v-if="nearMissMessage"> {{ nearMissMessage }}</span>
        </div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="gameOverMessage" class="game-over-message">{{ gameOverMessage }}</div>
        <div style="display: flex; justify-content: center;">
            <button @click="deselectAll">Temizle</button>
            <button @click="shuffleItems">Karıştır</button>
            <button :disabled="selectedItems.length !== 4" @click="checkResults">Gönder</button>
        </div>
        <div class="wall-number">Duvar #5 - 31/07/2024</div>
        <div v-if="showCookieConsent" class="cookie-consent">
            Bu oyun seansınızı hatırlamak için çerez kullanmaktadır. 
            <button @click="acceptCookies">Kabul et</button>
        </div>
    </div>

    <!-- Inline JavaScript to dynamically add the script tag with a date query string -->
    <script>
        var script = document.createElement('script');
        var date = new Date();
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        script.src = 'app.js?v=' + year + month + day;
        document.head.appendChild(script);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
    <script src="app.js"></script>
</body>
</html>
