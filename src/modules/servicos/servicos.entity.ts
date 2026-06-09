import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string; // Ex: "Atendimento Psicológico", "Ginecologia", "Vacinação"

  @Column({ type: 'text', nullable: true })
  descricao: string; // Detalhes sobre o público-alvo ou foco do serviço naquela rede

  // Vários serviços podem estar presentes em várias unidades de saúde
  @ManyToMany(() => UnidadeSaude, (unidade) => unidade.servicos)
  unidades?: UnidadeSaude[];

  constructor(dados?: Partial<Servico>) {
    this.id = dados?.id ?? 0;
    this.nome = dados?.nome ?? '';
    this.descricao = dados?.descricao ?? '';
    this.unidades = dados?.unidades; // Mantido sem inicialização de array conforme regra do TypeORM
  }
}