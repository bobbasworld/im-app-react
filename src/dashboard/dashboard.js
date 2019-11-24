import React from 'react';
import ChatList from '../chatlist/chatlist';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatView from '../chatView/chatView';
import ChatTextBox from '../chattextbox/chattextbox';

import firebase from 'firebase';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        }
    }


    newChatBtnClicked = () => {
        console.log('NEW CHAT BUTTON CLICKED!');
        this.setState({ newChatFormVisible: true, selectedChat: null })
    }

    selectChat = (chatIndex) => {
        this.setState({ selectedChat: chatIndex });
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    buildDocKey = (friend) => {
        return [this.state.email, friend].sort().join(':');
    }

    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
            .users
            .filter(usr => usr !== this.state.email)[0]);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            });
    }



    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if (!_usr) {
                this.props.history.push('/login');
            }
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _usr.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _usr.email,
                            chats: chats
                        })
                        console.log(chats);
                    })
            }
        })
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <ChatList history={this.props.history}
                    newChatBtnFn={this.newChatBtnClicked}
                    selectChatFn={this.selectChat}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChatIndex={this.state.selectedChat}
                />
                {
                    this.state.newChatFormVisible ?
                        null :
                        <ChatView
                            user={this.state.email}
                            chat={this.state.chats[this.state.selectedChat]}
                        />
                }
                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                        <ChatTextBox
                            submitMessageFn={this.submitMessage}
                        /> :
                        null

                }
                <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        );
    }

}

export default withStyles(styles)(Dashboard);