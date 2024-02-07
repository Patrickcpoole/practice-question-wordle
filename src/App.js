import React, {useEffect, useState} from 'react';
import './App.css';
import wordList from './wordle-words.json';
const NUM_GUESSES = 6;
const WORD_LENGTH = 5;
  
export default function Wordle() {
  // Write your code here.
  const [guesses, setGuesses] = useState(Array(NUM_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [solution, setSolution] = useState(null);

  const pickRandomWord = (wordList) => {
    const randomNumber = Math.floor(Math.random() * wordList.length)
    return wordList[randomNumber].toLowerCase();
  
  }

  useEffect(() => {
        // fetch solution from word list
        const chosenWord = pickRandomWord(wordList)
        setSolution(chosenWord)
    
  }, []);

  useEffect(() => {
    console.log('test')
    // Wait for the solution to be set
    if (solution === null) return
    const onPressKey = event => {
      // If the game is over, don't do anything
      if(guesses[NUM_GUESSES - 1] != null || guesses.includes(solution)) {
        return 
      }

      const charCode = event.key.toLowerCase().charCodeAt(0);
      const isLetter = 
        event.key.length === 1 &&
        charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0)

      setCurrentGuess(prevGuess => {
        if (event.key === 'Backspace') {
          return prevGuess.slice(0, -1);
          // If the guess is complete, add it to the list
        } else if(event.key === 'Enter' && prevGuess.length === WORD_LENGTH) {
          const currentGuessIndex = guesses.findIndex(guess => guess == null);
          const newGuesses = [...guesses];
          newGuesses[currentGuessIndex] = prevGuess
          setGuesses(newGuesses);
          return '';
          // Handle adding a letter to the current guess
        } else if (isLetter && prevGuess.length < WORD_LENGTH) {
          return prevGuess + event.key.toLowerCase();
        }
        // If the key is not a letter, return the previous guess
        return prevGuess
      })
 
    };

    window.addEventListener('keydown', onPressKey)
    
    return () => window.removeEventListener('keydown', onPressKey);
  }, [guesses, solution])


  const currentGuessIndex = guesses.findIndex(guess => guess == null)

  if (solution == null) return null
  
  return (
    <div className="board">
      {
        guesses.map((guess, i) => {
          return (
            <GuessLine 
              key={i}
              guess={(i === currentGuessIndex ? currentGuess : guess ?? '').padEnd(WORD_LENGTH)}
              solution={solution}
              isFinal={currentGuessIndex > i || currentGuessIndex === - 1}
              />
          )
        })
      }
       </div>
     );
   }


function GuessLine({guess, solution, isFinal}) {
  return (
    <div className="line">
      {
        guess.split('').map((char, i) => {
          let className = 'tile';
        
          if (isFinal) {
            if (char === solution[i]) {
              className += ' correct';
            } else if (solution.includes(char)) {
              className += ' close'
            } else {
              className += ' incorrect';
            }
          }
          return <div key={i} className={className}>{char}</div>
        })
      }
      </div>
  )
}