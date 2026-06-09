import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Agendamento } from '../agendamentos/agendamentos.entity';

@Entity('unidade_saude')
export class UnidadeSaude {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => User, (user) => user.unidade)
  usuarios?: User[];

  @OneToMany(() => Agendamento, (agendamento) => agendamento.unidade)
  agendamentos?: Agendamento[];

  @Column()
  endereco: string;

  @Column()
  bairro: string;

  @Column()
  telefone: string;

  @Column()
  tipo: string; // Ex: "USF", "UPA", "Centro de Saúde"

  @Column({ name: 'horario_funcionamento' })
  horarioFuncionamento: string; // Ex: "07:00 às 17:00"

  constructor(dados?: Partial<UnidadeSaude>) {
    this.id = dados?.id ?? 0;
    this.nome = dados?.nome ?? '';
    this.usuarios = dados?.usuarios;
    this.agendamentos = dados?.agendamentos;
    this.endereco = dados?.endereco ?? '';
    this.bairro = dados?.bairro ?? '';
    this.telefone = dados?.telefone ?? '';
    this.tipo = dados?.tipo ?? '';
    this.horarioFuncionamento = dados?.horarioFuncionamento ?? '';
  }
}