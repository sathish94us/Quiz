var initialState = {
    questions: [],
    submitted: [],
    timeout: 20,
    limit: 4
}

const questionsReducer = (state = initialState, action) => {
    var oldState = { ...state };
    switch (action.type) {
        // When fetches questions through api calls, but now i am referring from json.
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
    }
    return oldState;
}


export default questionsReducer;