import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions';
import './Quiz.css';

import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Quiz extends Component {

    constructor() {
        super();
        this.state = {
            randomIndex: 0,
            timer: null
        };
    }

    selectedQuestions = [];
    timerInterval = null;

    componentDidMount() {
        // Loads questions
        this.generateNextQuestion();
        this.props.fetchQuestions();
    }

    // On click of submit anser button
    onSubmitClicked(questionIndex, answerIndex) {
        this.clearTimer();
        this.props.submitAnswer(questionIndex, answerIndex);
        if (this.selectedQuestions.length === this.props.limit) {
            this.navigateToResult();
            return;
        }
        this.generateNextQuestion();
    }

    // Generates next question
    generateNextQuestion() {
        var randomNumber = this.getRandomIndex();
        this.setState({
            randomIndex: randomNumber,
            option: null,
            timer: this.props.timeout
        });
        this.triggerTimer();
    }

    // Starts timer
    triggerTimer() {
        this.clearTimer();
        this.timerInterval = setInterval(() => {
            if (this.state.timer === 0) {
                this.onSubmitClicked(this.state.randomIndex, -1);
                return;
            }
            this.setState(prevState => {
                return {
                    timer: prevState.timer - 1
                }
            })
        }, 1000);
    }

    // Clears the timer
    clearTimer() {
        if (!!this.timerInterval)
            clearInterval(this.timerInterval);
    }

    // Gets random number to generate question
    getRandomIndex() {
        var max = 8;
        var min = 0;
        var index = Math.floor(Math.random() * (max - min + 1) + min);
        if (this.selectedQuestions.indexOf(index) !== -1)
            return this.getRandomIndex();
        this.selectedQuestions.push(index);
        return index;
    }

    // Navigates to result page on last submit anser button click
    navigateToResult() {
        this.props.history.push("/result");
    }

    // On radio button select
    onOptionSelect(event) {
        var value = event.target.value;
        var options = this.props.questions[this.state.randomIndex].options;
        var index = options.indexOf(value);
        this.setState({
            option: index
        })
    }

    render() {
        var contentToShow = null;
        var currentQuestion = null;
        var loading = null;
        if (this.props.questions.length >= this.props.limit) {
            var item = this.props.questions[this.state.randomIndex];
            var progress = (this.props.timeout - this.state.timer) / this.props.timeout;
            var timerClasses = "cl-timer-text";
            if (this.state.timer <= 5)
                timerClasses += " cl-timer-warning";
            currentQuestion = (<div>
                {/* Timer */}
                <Box className="cl-timer" position="relative" display="inline-flex">
                    <CircularProgress variant="static" value={progress * 100} />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography className={timerClasses} variant="caption" component="div" color="textSecondary">{this.state.timer}</Typography>
                    </Box>
                </Box>
                {/* Question */}
                <Grid className="cl-paper" key={`grid`} item>
                    <Paper variant="outlined">
                        <ListItemText primary={`${item.question}`} />
                        <FormControl component="fieldset">
                            <RadioGroup name="options" onChange={(event) => this.onOptionSelect(event)}>
                                {item.options.map((option, index) => <FormControlLabel key={`option-${index}`} value={option} control={<Radio />} label={`${option}`} />)}
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid>
                {/* Buttons */}
                <div className="cl-options-button">
                    <Button onClick={() => this.onSubmitClicked(this.state.randomIndex, -1)} variant="contained">SKIP</Button>
                    <Button className={this.state.option === null ? 'cl-disabled' : ''} onClick={() => this.onSubmitClicked(this.state.randomIndex, this.state.option)} variant="contained" color="primary">SUBMIT ANSWER</Button>
                </div>
            </div>)
        }
        else {
            // Loader
            loading = (<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>);
        }
        contentToShow = (<div className="cl-contents">
            {currentQuestion}
            {loading}
        </div>);
        return (
            <React.Fragment>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography style={{ textAlign: "center" }} variant="h6">Welcome to Quiz</Typography>
                    </Toolbar>
                </AppBar>
                <div className="cl-quiz-conatiner cl-perfect-center">
                    {contentToShow}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions,
        submitted: state.submitted,
        timeout: state.timeout,
        limit: state.limit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchQuestions: () => {
            return dispatch(actionCreators.fetchQuestions())
        },
        submitAnswer: (questionIndex, answerIndex) => {
            return dispatch(actionCreators.submitAnswer(questionIndex, answerIndex))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);