import { Injectable } from '@nestjs/common';

// INTERFAZ DEL CLIENTE QUE SE VA A CONECTAR //
interface Client {
    id: string;
    name: string;
}

@Injectable()
export class ChatService {

    // RECORD ES COMO SI FUESE UN OBJETO QUE VOY A RECIBIR EN ESTE CASO DEL CLIENTE //
    private clients: Record<string, Client> = {};

    // CUANDO EL CLIENTE SE CONECTE VOY A GUARDAR EL ID DE ESTE //
    onClientConnected(client: Client) {
        this.clients[client.id] = client;
    }

    // CUANDO EL CLIENTE SE DESCONECTE VOY A QUITAR EL ID DEL OBJETO CLIENTS //
    onClientDisconnected(id: string) {
        delete this.clients[id];
    }

    // ESTA FUNCION ES PARA OBTENER TODOS LOS CLIENTES QUE ESTAN CONECTADOS //
    getClients() {
        return Object.values(this.clients);
    }

}
