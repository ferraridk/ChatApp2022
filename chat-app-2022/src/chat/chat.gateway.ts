import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Socket } from 'socket.io'
import {ChatService} from "./shared/chat.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(private chatService: ChatService) {
    }

    @WebSocketServer() server;
    @SubscribeMessage('message')
    handleChatEvent(@MessageBody() message: string): void {
        this.chatService.addMessage(message);
        this.server.emit('newMessage', message);
    }

    @SubscribeMessage('nickname')
    handleNickNameEvent(
        @MessageBody() nickname: string,
        @ConnectedSocket() client: Socket): void
        {
            this.chatService.addClient(client.id, nickname);
            this.server.emit('clients', this.chatService.getClients());
        }


    handleConnection(client: Socket, ...args: any[]): any {
        client.emit('allMessages', this.chatService.getMessages());
        this.server.emit('clients', this.chatService.getClients());

    }

    handleDisconnect(client: Socket): any {
        this.chatService.deleteClient(client.id);
        this.server.emit('clients', this.chatService.getClients());
    }
}