import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({

  imports: [

    // MODULO DEL CHAT //
    ChatModule,

    // PARA MOSTRAR EL CHAT QUE ESTA EN LA CARPETA PUBLIC EN EL NAVEGADOR //
    // ESTE VA A SER EL CLIENTE // 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    
  ],

})
export class AppModule {}
