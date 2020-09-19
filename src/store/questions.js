var initialState = {
    questions: [],
    submitted: [],
    timeout: 20,
    limit: 4,
    error: null
}

const questionsReducer = (state = initialState, action) => {
    var oldState = { ...state };
    switch (action.type) {
        // When fetches questions through api call.
        case "addQuestions": {
            oldState.questions = action.value;
            break;
        }

        case "submitAnswer": {
            // answerIndex === -1 handles skip question or timeout
            var { questionIndex, answerIndex } = action;
            var submitted = state.submitted.map(item => {
                return {...item};
            });
            submitted.push({
                question: questionIndex,
                answer: answerIndex
            });
            oldState = {...state, submitted: submitted};
            break;
        }

        case "reset": {
            // Resets all submitted answers
            oldState = {...state, submitted: [], timeout: 20}
            break;
        }

        case "addError": {
            oldState = {...state, error: "Something went wrong. Please "};
            break;
        }

        default:
            break
    }
    return oldState;
}


export default questionsReducer;