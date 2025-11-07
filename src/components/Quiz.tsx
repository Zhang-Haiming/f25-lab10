import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion';
import QuizCore from '../core/QuizCore';
// Hint: Take advantage of the QuizQuestion interface

interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  score: number
}

const Quiz: React.FC = () => {
  // TODO: Task1 - Seprate the logic of quiz from the UI.
  // Hint: Take advantage of QuizCore to manage quiz state separately from the UI.
  const [quizCore] = useState(() => new QuizCore()); // Create once and reuse
  
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  }


  const handleButtonClick = (): void => {
    // TODO: Task3 - Implement the logic for button click ("Next Question" and "Submit").
    // Hint: You might want to check for a function in the core logic to help with this.
    
    // Record the answer
    if (state.selectedAnswer) {
      quizCore.answerQuestion(state.selectedAnswer);
    }
    
    if(quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null,
        score: quizCore.getScore()
      }));
    } else {
      // Quiz completed
      setState((prevState) => ({
        ...prevState,
        score: quizCore.getScore(),
        currentQuestionIndex: quizCore.getTotalQuestions() // This ensures we show completion
      }));
    }
  }

  const { currentQuestionIndex, selectedAnswer, score } = state;
  const currentQuestion = quizCore.getCurrentQuestion();

  // Check if quiz is completed
  if (!currentQuestion || currentQuestionIndex >= quizCore.getTotalQuestions()) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {quizCore.getTotalQuestions()}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>
    
      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button 
        onClick={handleButtonClick} 
        disabled={!selectedAnswer}
        className={quizCore.hasNextQuestion() ? 'next-button' : 'submit-button'}
      >
        {quizCore.hasNextQuestion() ? 'Next Question' : 'Submit'}
      </button>
    </div>
  );
};

export default Quiz;