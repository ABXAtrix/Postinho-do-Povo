import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campanha } from '../campanha/campanhas.entity';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';

@Entity('campanha_faqs')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pergunta: string; // Ex: "O postinho vai abrir na emenda de feriado?"

  @Column({ type: 'text' })
  resposta: string; // Ex: "Não, funcionaremos apenas até a quinta-feira."

  // Relacionamento com Campanha (Opcional agora)
  @ManyToOne(() => Campanha, (campanha) => campanha.faqs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'campanha_id' })
  campanha?: Campanha;

  // Relacionamento com Unidade de Saúde / Postinho (Opcional)
  @ManyToOne(() => UnidadeSaude, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'unidade_id' })
  unidadeSaude?: UnidadeSaude;

  constructor(dados?: Partial<Faq>) {
    this.id = dados?.id ?? 0;
    this.pergunta = dados?.pergunta ?? '';
    this.resposta = dados?.resposta ?? '';
    this.campanha = dados?.campanha;
    this.unidadeSaude = dados?.unidadeSaude;
  }
}
