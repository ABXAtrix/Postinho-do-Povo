import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UnidadeSaude } from '../unidadesaude/unidadesaude.entity';
import { Faq } from '../perguntasfrequentes/faq.entity'

@Entity('campanhas')
export class Campanha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string; // Ex: "Campanha Nacional de Vacinação Contra Gripe"

  @Column({ type: 'text' })
  descricao: string;

  @Column({ name: 'publico_alvo' })
  publicoAlvo: string; // Ex: "Idosos, gestantes e crianças"

  @Column({ name: 'data_inicio', type: 'timestamp' })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'timestamp' })
  dataFim: Date;

  @Column()
  local: string; // Ex: "Salas de vacina e tendas externas"

  // Uma campanha pode acontecer em várias unidades,
  // e uma unidade participa de várias campanhas.
  @ManyToMany(() => UnidadeSaude, { cascade: true })
  @JoinTable({
    name: 'unidade_campanhas', // Nome da tabela principal no banco
    joinColumn: { name: 'campanha_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'unidade_id', referencedColumnName: 'id' }
  })
  unidades?: UnidadeSaude[];

  @OneToMany(() => Faq, (faq) => faq.campanha)
  faqs?: Faq[];

  constructor(dados?: Partial<Campanha>) {
    this.id = dados?.id ?? 0;
    this.titulo = dados?.titulo ?? '';
    this.descricao = dados?.descricao ?? '';
    this.publicoAlvo = dados?.publicoAlvo ?? '';
    this.dataInicio = dados?.dataInicio ?? new Date();
    this.dataFim = dados?.dataFim ?? new Date();
    this.local = dados?.local ?? '';
    this.unidades = dados?.unidades;
    this.faqs = dados?.faqs;
  }
}