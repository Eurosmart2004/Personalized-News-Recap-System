from flask_socketio import SocketIO, join_room, emit, leave_room
import logging
def init(socketio: SocketIO):

    @socketio.on('join')
    def handle_join_room(data):
        email = data['email']
        join_room(email)
        emit('message', {'message': f'Joined room for {email}'}, to=email)

    @socketio.on('leave')
    def handle_leave_room(data):
        email = data['email']
        leave_room(email)
        emit('message', {'message': f'Left room for {email}'}, to=email)


