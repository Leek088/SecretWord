//Css
import './App.css'

//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game';
import GameOver from './components/GameOver';

//React
import { useCallback, useEffect, useState } from 'react';

//Data
import wordsList from './data/words';

const stages = [
    { id: 1, name: "start" },
    { id: 2, name: "game" },
    { id: 3, name: "end" }
];

function App() {

    const guessesQuantity = 3;

    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);
    const [picketWord, setPicketWord] = useState("");
    const [picketCategory, setPicketCategory] = useState("");
    const [letters, setLetters] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(guessesQuantity);
    const [score, setScore] = useState(0);


    const pickWordAndCategory = () => {
        const categories = Object.keys(words);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const word = words[category][Math.floor(Math.random() * words[category].length)];
        return { category, word };
    };

    const startGame = () => {
        const { word, category } = pickWordAndCategory();

        let wordLetters = word.split("");
        wordLetters = wordLetters.map((l) => l.toLowerCase());

        setPicketCategory(category);
        setPicketWord(word);
        setLetters(wordLetters);
        setGameStage(stages[1].name);
    };

    const verifyLetter = (letter) => {
        const normalizedLetter = letter.toLowerCase();

        if (guessedLetters.includes(normalizedLetter) ||
            wrongLetters.includes(normalizedLetter)) {
            return;
        }

        if (letters.includes(normalizedLetter)) {
            setGuessedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters,
                normalizedLetter
            ]);
        } else {
            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters,
                normalizedLetter
            ]);

            setGuesses((actualGuesses) => actualGuesses - 1);
        }

    };

    const clearLetterStates = () => {
        setGuessedLetters([]);
        setWrongLetters([]);
    }

    const retryGamePoints = () => {
        setScore(0);
        setGuesses(guessesQuantity);
    }

    useEffect(() => {
        if (guesses <= 0) {
            clearLetterStates();
            setGameStage(stages[2].name);
        }
    }, [guesses])

    const retry = () => {
        retryGamePoints();
        setGameStage(stages[0].name);
    };

    return (
        <>
            <div className="App">
                {gameStage === "start" && <StartScreen startGame={startGame}></StartScreen>}
                {gameStage === "game" &&
                    <Game
                        verifyLetter={verifyLetter}
                        picketWord={picketWord}
                        picketCategory={picketCategory}
                        letters={letters}
                        guessedLetters={guessedLetters}
                        wrongLetters={wrongLetters}
                        guesses={guesses}
                        score={score}
                    >
                    </Game>
                }
                {gameStage === "end" &&
                    <GameOver
                        retry={retry}
                        score={score}
                    >
                    </GameOver>
                }
            </div>
        </>
    )
}

export default App
