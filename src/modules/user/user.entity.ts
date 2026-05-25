import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CargosEnum } from '../enums/cargos.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'enum', enum: CargosEnum, default: CargosEnum.UsuarioComum })
  cargo: CargosEnum;

  @Column({ unique: true }) // Garante que não existam dois usuários com o mesmo telefone
  telefone: string;

  @Column()
  bairro: string;

  @Column()
  senha: string;

  // O construtor aceita os dados, mas usamos o Partial<User> para o TypeORM não quebrar ao buscar do banco
  constructor(dados?: Partial<User>) {
    this.id = dados?.id ?? 0;
    this.nome = dados?.nome ?? '';
    this.cargo = dados?.cargo ?? CargosEnum.UsuarioComum;
    this.telefone = dados?.telefone ?? '';
    this.bairro = dados?.bairro ?? '';
    this.senha = dados?.senha ?? '';
  }

  // Criptografa a senha automaticamente antes de inserir no banco
  @BeforeInsert()
  async hashSenha() {
    if (this.senha) {
      const salt = await bcrypt.genSalt();
      this.senha = await bcrypt.hash(this.senha, salt);
    }
  }

  // Método auxiliar para validar a senha na hora do login
  async validarSenha(senhaPlana: string): Promise<boolean> {
    return bcrypt.compare(senhaPlana, this.senha);
  }
}