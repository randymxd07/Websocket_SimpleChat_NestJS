import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  // CHATGATEWAY ESTA EN PROVIDER PORQUE SE SERVIRA COMO UN SERVICIO //
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
