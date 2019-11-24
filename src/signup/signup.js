import React from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';

import firebase from 'firebase';


class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            passwordConfirmation: null,
            signupError: ''
        };
    }

    formIsValid = () => {
        const regx = new RegExp('/^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2, 8})(.[a-z]{2, 8})?$/');
        if (regx.test(this.state.email) ||
            this.state.password.length !== 8 ||
            this.state.password === this.state.passwordConfirmation
        ) {
            return true;
        } else {
            return false;
        }
    };

    submitSignup = (e) => {
        e.preventDefault();
        if (!this.formIsValid()) {
            this.setState({ signupError: 'Passwords do not match!' });
            return;
        }

        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email
                };
                firebase
                    .firestore()
                    .collection('users')
                    .doc(this.state.email)
                    .set(userObj)
                    .then(() => {
                        this.props.history.push('/dashboard');
                    }, dbError => {
                        console.log(dbError);
                        this.setState({ signupError: 'Email should be valid and password should be at least 8 characters!' });
                    })
            }, authErr => {
                console.log(authErr);
                this.setState({ signupError: authErr.message });
            })

    }


    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({ email: e.target.value });
                break;

            case 'password':
                this.setState({ password: e.target.value });
                break;

            case 'passwordConfirmation':
                this.setState({ passwordConfirmation: e.target.value });
                break;

            default:
                break;

        }
    }

    render() {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Sign Up
                    </Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitSignup(e)}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-email-input'>Enter Your Email</InputLabel>
                            <Input autoComplete='email' autoFocus id='signup-email-input' onChange={(e) => {
                                this.userTyping('email', e)
                            }
                            }></Input>
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-password-input'>Create A Password</InputLabel>
                            <Input type='password' id='signup-password-input' onChange={(e) => {
                                this.userTyping('password', e);
                            }}></Input>
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='signup-password-confirmation-input'>Confirm Your Password</InputLabel>
                            <Input type='password' id='signup-password-confirmation-input' onChange={(e) => {
                                this.userTyping('passwordConfirmation', e);
                            }}></Input>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Sign Up</Button>
                    </form>
                    {this.state.signupError ?
                        <Typography className={classes.errorText} component='h5' variant='h6'>
                            {this.state.signupError}
                        </Typography> :
                        null
                    }
                    <Typography conponent='h5' variant='h6' className={classes.hasAccountHeader}>
                        Already have an account? <br />
                        <Link className={classes.logInLink} to='/login'>Log In</Link>
                    </Typography>

                </Paper>
            </main >
        );
    }

}

export default withStyles(styles)(Signup);