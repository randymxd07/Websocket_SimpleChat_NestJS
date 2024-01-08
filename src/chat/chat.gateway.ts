import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// HAY QUE PONER EL DECORADOR WEBSOCKETGATEWAY Y EN LA CLASE IMPLEMENTAR EL ONMODULEINIT //
@WebSocketGateway()
export class ChatGateway implements OnModuleInit {

  // CREO UNA INSTANCIA DE SERVER DE SOCKET.IO //
  // PONGO EL DECORADOR DE WEBSOCKETSERVER //
  @WebSocketServer()
  public server: Server;

  // EL CONTRUCTOR APUNTANDO A QUE SE REQUIERE EN CHATSERVICE //
  constructor(private readonly chatService: ChatService) {}

  // ON MODULE INIT FUNCTION //
  onModuleInit() {

    // ESTO ES PARA CUANDO SE CONECTE EL CLIENTE //
    // EL PARAMETRO SOCKET VIENE DE SOCKET.IO POR ESO LO PONGO DEL TIPO SOCKET //
    this.server.on('connection', (socket: Socket) => {

      /**=================================================================================
       * ? CON HANDSHAKE PUEDO ACCEDER Y MANIPULAR LOS OBJETOS QUE ESTAN EN EL SOCKET, 
       * ? EN ESTE CASO AUTH QUE VIENE DESDE EL CLIENTE
      ====================================================================================*/
      const { name, token } = socket.handshake.auth;

      //? SI NO VIENE EL NOMBRE SE DESCONECTA //
      if(!name) {
        socket.disconnect();
        return;
      }


      // ? AGREGAR CLIENTE AL LISTADO
      this.chatService.onClientConnected({id: socket.id, name: name});


      
      // ? MENSAJE DE BIENVENIDA //
      socket.emit('welcome-message', 'Bienvenido al servidor');

      

      // ? LISTADO DE CLIENTES CONECTADOS //
      this.server.emit('on-clients-changed', this.chatService.getClients());



      //? PARA CUANDO SE DESCONECTA EL CLIENTE //
      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
        // console.log('Cliente se desconectado: ', socket.id);
      });

    });
      
  }

  // HANDLE MESSAGE FUNCTION //
  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {

    const { name, token } = client.handshake.auth;

    if(!message) {
      return;
    }

    // EN MENSAJE SOLO VA A ENVIAR ESTA INFORMACION, USERID, MENSAJE Y EL NOMBRE DE USUARIO //
    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    });

  }

}
