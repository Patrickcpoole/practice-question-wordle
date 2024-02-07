import React, {useEffect, useState} from 'react';
import './App.css';
import wordList from './wordle-words.json';

const WORD_LIST_API_URL = 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words';
const NUM_GUESSES = 6;
const WORD_LENGTH = 5;
  
export default function Wordle() {
  // Write your code here.
  const [guesses, setGuesses] = useState(Array(NUM_GUESSES).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [solution, setSolution] = useState(null);

  const pickRandomWord = (wordList) => {
    console.log('word list', wordList)
    const randomNumber = Math.floor(Math.random() * wordList.length - 1)
    console.log('random number', randomNumber)
    return wordList[randomNumber].toLowerCase();
  
  }

  useEffect(() => {
    
        const chosenWord = pickRandomWord(wordList)
        setSolution(chosenWord)
      


 
    
  }, []);

  useEffect(() => {
    if (solution === null) return
    const onPressKey = event => {
      if(guesses[NUM_GUESSES - 1] != null || guesses.includes(solution)) {
        return 
      }

      setCurrentGuess(prevGuess => {
        if (event.key === 'Backspace') {
          return prevGuess.slice(0, -1);
        } else if(event.key === 'Enter' && prevGuess.length === WORD_LENGTH) {
          const currentGuessIndex = guesses.findIndex(guess => guess == null);
          const newGuesses = [...guesses];
          newGuesses[currentGuessIndex] = prevGuess
          setGuesses(newGuesses);
        }
        return prevGuess + event.key.toLowerCase();
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