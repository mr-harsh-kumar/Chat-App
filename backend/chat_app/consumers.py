import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

class TextRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        # Send a message to the client upon successful connection
        # data = json.dumps({'text': 'connected', 'sender': 'server'})
        # self.send(text_data=data)
        logger.info(f"Connected to room: {self.room_group_name}")
        print(f"Connected to room: {self.room_group_name}")

    def receive(self, text_data):
        try:
            from chat_app.models import Members, Messages  # Import models here
            
            text_data_json = json.loads(text_data)
            text = text_data_json.get('text')
            sender = text_data_json.get('sender')
            receiver = text_data_json.get('receiver')

            # Ensure both text and sender are present
            if text and sender:
                
                # Save message to the database
                sender_user = Members.objects.get(username=sender)
                receiver_user = Members.objects.get(username=receiver)
                Messages.objects.create(
                    sender=sender_user,
                    receiver=receiver_user,
                    content=text
                )

                # Send message to room group
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': text,
                        'sender': sender,
                        'receiver': receiver,
                    }
                )
                logger.info(f"Message from {sender} to {receiver}: {text}")
            else:
                logger.error("Invalid message data received")

        except json.JSONDecodeError:
            logger.error("Error decoding JSON data")
        except Members.DoesNotExist:
            logger.error("Member not found")

    def chat_message(self, event):
        text = event['message']
        sender = event['sender']
        receiver = event['receiver']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'text': text,
            'sender': sender,
            'receiver': receiver
        }))
        logger.info(f"Sent message from {sender} to {receiver}: {text}")

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f"Disconnected from room: {self.room_group_name}")
