import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import ListItemText from '@material-ui/core/ListItemText';

import './Result.css';
import * as actionCreators from '../../store/actions';

class Result extends Component {

    constructor() {
        super();
        this.state = {
            submitted: []
        }
    }

    componentDidMount() {
        // Gets the submitted answers from store
        var submitted = this.props.submitted.map((item, index) => {
            var questionIndex = item.question;
            var answerIndex = item.answer;
            const question = this.props.questions[questionIndex];
            const correctAnswer = question.answer;
            var right = false;
            var wrong = false;
            var skipped = false;
            if (answerIndex === -1)
                skipped = true;
            else if (answerIndex === correctAnswer)
                right = true;
            else
                wrong = true;
            return {
                question: question.question, right: right, wrong: wrong, skipped: skipped, correctAnswer: question.options[correctAnswer]
            }
        });
        this.setState({
            submitted: submitted
        })
    }

    // Goes to quiz page on click of Play Again Button
    goToQuizPage() {
        // Redirect to quiz page
        this.props.reset();
        this.props.history.push("/quiz");
    }

    render() {
        var table = null;
        if (this.props.submitted.length === this.props.limit) {
            table =
            // Creates table for selected answers
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>S No</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell align="center">Right</TableCell>
                                <TableCell align="center">Wrong</TableCell>
                                <TableCell align="center">Not Answered</TableCell>
                                <TableCell align="center">Correct Answer</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.submitted.map((row, index) => {
                                const correctAnswer = row.correctAnswer;
                                return <TableRow key={`question-${index + 1}`}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{row.question}</TableCell>
                                    <TableCell style={{ color: "green", fontSize: 'large' }} align="center">{row.right ? <b>&#10004;</b> : ''}</TableCell>
                                    <TableCell style={{ color: "red", fontSize: 'large' }} align="center">{row.wrong ? <b>&#10006;</b> : ''}</TableCell>
                                    <TableCell align="center">{row.skipped ? <b>Skipped</b> : ''}</TableCell>
                                    <TableCell align="center">{correctAnswer}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
        }
        else {
            // Loader
            table = (<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>);
        }
        return <div className="cl-center-container">
            <div>
                <ListItemText className="cl-thanks-card" primary="Thanks for playing quiz" />
                {table}
                <Button onClick={this.goToQuizPage.bind(this)} variant="contained" color="primary">Play Again</Button>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        submitted: state.submitted,
        questions: state.questions,
        limit: state.limit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reset: () => {
            return dispatch(actionCreators.reset())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Result);