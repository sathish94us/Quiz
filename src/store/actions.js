import { questions } from '../quiz';

// Adds questions to store
const fetchQuestions = () => {
    return (dispatch) => {
        dispatch({
            type: "addQuestions",
            value: questions
        })
    }
}

// Submit answer
const submitAnswer = (questionIndex, answerIndex) => {
    return {
        type: "submitAnswer",
        questionIndex: questionIndex,
        answerIndex: answerIndex
    }
}

export { fetchQuestions, submitAnswer };