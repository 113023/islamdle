// Charger la base de données des prophètes depuis data.json
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données JSON");
        }
        return response.json();
    })
    .then(prophets => {
        const randomProphet = prophets[Math.floor(Math.random() * prophets.length)];

        const guessTable = document.getElementById("guess-table");
        const guessInput = document.getElementById("guess-input");
        const submitGuess = document.getElementById("submit-guess");
        const resultDiv = document.getElementById("result");

        function addRow(guess, attributes) {
            const row = document.createElement('tr');

            for (const key in attributes) {
                const cell = document.createElement('td');

                if (key === 'annee') {
                    cell.textContent = guess[key];
                    if (guess[key] > attributes[key]) {
                        cell.textContent += ' ▼';
                        cell.classList.add("incorrect");
                    } else if (guess[key] < attributes[key]) {
                        cell.textContent += ' ▲';
                        cell.classList.add("incorrect");
                    } else {
                        cell.classList.add("correct");
                    }
                } else {
                    cell.textContent = guess[key];
                    if (guess[key] === attributes[key]) {
                        cell.classList.add("correct");
                    } else {
                        cell.classList.add("incorrect");
                    }
                }
                row.appendChild(cell);
            }

            guessTable.appendChild(row);
        }

        submitGuess.addEventListener("click", () => {
            const guessName = guessInput.value.toUpperCase().trim();
            const guess = prophets.find(prophet => prophet.name === guessName);

            if (guess) {
                addRow(guess, randomProphet);
            } else {
                resultDiv.textContent = "Prophète non trouvé ! Essayez à nouveau.";
            }

            guessInput.value = ""; 
            document.getElementById("suggestions").innerHTML = "";
        });

        function updateSuggestions(inputValue) {
            const suggestionsDiv = document.getElementById("suggestions");
            suggestionsDiv.innerHTML = ""; 

            if (inputValue.length > 0) {
                const filteredProphets = prophets.filter(prophet => prophet.name.includes(inputValue.toUpperCase()));

                if (filteredProphets.length > 0) {
                    filteredProphets.forEach(prophet => {
                        const suggestionItem = document.createElement("div");
                        suggestionItem.classList.add("suggestion-item");
                        suggestionItem.textContent = prophet.name;

                        suggestionItem.addEventListener("click", () => {
                            guessInput.value = prophet.name;
                            suggestionsDiv.innerHTML = "";
                        });

                        suggestionsDiv.appendChild(suggestionItem);
                    });
                } else {
                    const noResult = document.createElement("div");
                    noResult.classList.add("suggestion-item");
                    noResult.textContent = "Aucune correspondance trouvée";
                    suggestionsDiv.appendChild(noResult);
                }
            }
        }

        guessInput.addEventListener("input", () => {
            const inputValue = guessInput.value.trim();
            updateSuggestions(inputValue);
        });
    })
    .catch(error => {
        console.error("Erreur:", error);
        document.getElementById("result").textContent = "Une erreur est survenue lors du chargement des données.";
    });
