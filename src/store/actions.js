import axios from 'axios';

// Adds questions to store
const fetchQuestions = () => {
    return (dispatch) => {
        axios.get("quiz.json").then(response => {
            dispatch({
                type: "addQuestions",
                value: response.data
            })
        }).catch(() => {
            dispatch(addError())
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

// Handles error
const addError = () => {
    return {
        type: "addError"
    }
}

// Resets store
const reset = () => {
    return {
        type: "reset"
    }
}

export { fetchQuestions, submitAnswer, reset };