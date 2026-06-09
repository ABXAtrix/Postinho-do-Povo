import { IsNotEmpty, IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateServicoDTO {
  @IsString({ message: 'O nome do serviço deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  nome!: string; // Ex: "Pediatria", "Odontologia"

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsOptional()
  descricao?: string; // Detalhes opcionais do serviço

  @IsArray({ message: 'As unidades devem ser enviadas em formato de lista (array).' })
  @IsInt({ each: true, message: 'Cada ID de unidade de saúde deve ser um número inteiro.' })
  @IsOptional()
  unidadesIds?: number[]; // Lista opcional de IDs de unidades para já vincular na criação
}