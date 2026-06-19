import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificacoesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // O @WebSocketServer dá acesso direto à instância global do servidor Socket.io
  @WebSocketServer()
  server!: Server;

  // Executado automaticamente sempre que um usuário (Front-end) logar e conectar no WebSocket
  handleConnection(client: Socket) {
    console.log(`🔌 Usuário conectado ao WebSocket: ${client.id}`);
  }

  // Executado quando o usuário fecha o app ou desconecta
  handleDisconnect(client: Socket) {
    console.log(`❌ Usuário desconectado do WebSocket: ${client.id}`);
  }

  // Método customizado que nosso Service vai chamar para transmitir a novidade
  enviarNotificacaoNovaCampanha(campanha: any) {
    this.server.emit('novaCampanha', {
      titulo: campanha.titulo,
      descricao: campanha.descricao,
      publicoAlvo: campanha.publicoAlvo,
      local: campanha.local,
      mensagem: `🚨 Nova campanha de saúde disponível: ${campanha.titulo}!`,
    });
  }
}
