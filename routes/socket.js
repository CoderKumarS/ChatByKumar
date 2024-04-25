const socketIo = require('socket.io');
const userModel = require('./users');
const messageModel = require('./message');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
function initializeSocket(server) {
    const io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Broadcast message when a new user joins
        io.emit('chatMessage', { username: 'System', message: 'A new user has joined the chat!', timestamp: new Date() });

        // Broadcast message when a user leaves
        socket.on('disconnect', () => {
            io.emit('chatMessage', { username: 'System', message: 'A user has left the chat!', timestamp: new Date() });
            console.log('User disconnected');
        });

        // Handle chat message submission
        socket.on('chatMessage', async (mess) => {
            let username = mess.username;
            let message = mess.message;
            const user = await userModel.findOne({
                username: username
            });
            const newMessage = await messageModel.create({
                messageText: message,
                sender: user._id
            });
            user.messages.push(newMessage._id);
            await user.save();
            io.emit('chatMessage', { username, message, timestamp: new Date() });
        });
    });
}

module.exports = initializeSocket;
