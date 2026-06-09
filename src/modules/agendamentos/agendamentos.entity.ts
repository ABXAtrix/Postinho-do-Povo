import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';
import { StatusAgendamentoEnum } from '@/enums/status-agendamento.enum';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  // Um usuário pode ter vários agendamentos
  @ManyToOne(() => User, (user) => user.agendamentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: User;

  @Column({ name: 'unidade_id' })
  unidadeId: number;

  // Uma unidade de saúde pode receber vários agendamentos
  @ManyToOne(() => UnidadeSaude, (unidade) => unidade.agendamentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unidade_id' })
  unidade!: UnidadeSaude;

  @Column()
  servico: string; // Ex: "Consulta Médica", "Vacinação", "Odontologia"

  @Column({ type: 'date' })
  data: string; // Armazena no formato YYYY-MM-DD

  @Column()
  horario: string; // Ex: "08:30"

  @Column({
    type: 'enum',
    enum: StatusAgendamentoEnum,
    default: StatusAgendamentoEnum.PENDENTE,
  })
  status: StatusAgendamentoEnum;

  constructor(dados?: Partial<Agendamento>) {
    this.id = dados?.id ?? 0;
    this.usuarioId = dados?.usuarioId ?? 0;
    this.unidadeId = dados?.unidadeId ?? 0;
    this.servico = dados?.servico ?? '';
    this.data = dados?.data ?? '';
    this.horario = dados?.horario ?? '';
    this.status = dados?.status ?? StatusAgendamentoEnum.PENDENTE;
    this.usuario = dados?.usuario!;
    this.unidade = dados?.unidade!;
  }

  // GETTER PARA FORMATAR A DATA NO PADRÃO BRASILEIRO (DD/MM/YYYY)
  get dataFormatada(): string {
    if (!this.data) return '';
    
    const [ano, mes, dia] = this.data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}