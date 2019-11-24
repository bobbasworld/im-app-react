import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';


class ChatList extends React.Component {
    constructor(props) {
        super(props);
    }

    newChat = () => {
        console.log('NEW CHAT CLICKED!');
    }

    selectChat = (index) => {
        this.props.selectChatFn(index);
    }

    render() {
        const { classes } = this.props;

        if (this.props.chats.length > 0) {
            return (
                <main className={classes.root}>
                    <Button variant='contained'
                        fullWidth
                        color='primary'
                        className={classes.newChatBtn}
                        onClick={this.newChat}
                    >
                        New Message
                    </Button>
                    <List>
                        {
                            this.props.chats.map((chat, index) => {
                                return (
                                    <div key={index}>
                                        <ListItem className={classes.listItem}
                                            onClick={() => this.selectChat(index)}
                                            selected={this.props.selectedChatIndex === index}
                                            alignItems='flex-start'
                                        >
                                            <ListItemAvatar>
                                                <Avatar alt='Bobby Boy'>
                                                    {chat.users.filter(user => user !== this.props.userEmail)[0].split('')[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={chat.users.filter(user => user !== this.props.userEmail)[0]}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography component='span' color='textPrimary'>
                                                            {
                                                                chat.messages[chat.messages.length - 1].message.substring(0, 30)
                                                            }
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            >
                                            </ListItemText>
                                        </ListItem>
                                        <Divider></Divider>
                                    </div>
                                )
                            })
                        }
                    </List>
                </main>
            );
        } else {
            return (
                <main className={classes.root}>
                    <Button variant='contained'
                        fullWidth
                        color='primary'
                        className={classes.newChatBtn}
                        onClick={this.newChat}>
                        New Message
                    </Button>
                    <List></List>
                </main>
            );
        }


    }
}

export default withStyles(styles)(ChatList);