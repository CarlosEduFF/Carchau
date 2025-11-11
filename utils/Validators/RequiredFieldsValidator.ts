export type ValidarCamposResultado = {
  valido: boolean;
  camposVazios: string[];
  errosEspecificos?: string[];
};

/**
 * validarCampos
 * - dados: objeto com os valores
 * - camposObrigatorios: lista de chaves que devem existir e não serem vazias (aplica validação genérica)
 *
 * Além disso, faz validação especializada de CNH aceitando:
 * - frontImage / backImage
 * - frontCNH / backCNH
 * - existingImages: { front, back }
 *
 * E valida cnhvalida (não pode ser null/pendente quando imagens existem)
 */
export const validarCampos = (
  dados: Record<string, any>,
  camposObrigatorios: string[]
): ValidarCamposResultado => {
  // checa campos obrigatórios textuais/booleanos genéricos
  const camposVazios = camposObrigatorios.filter((campo) => {
    const valor = dados[campo];
    return (
      valor === undefined ||
      valor === null ||
      (typeof valor === 'string' && valor.trim() === '') ||
      valor === false
    );
  });

  const errosEspecificos: string[] = [];

  // --- Normalize imagens CNH vindo de diferentes formas ---
  const frontImage =
    dados.frontImage ??
    dados.frontCNH ??
    (dados.existingImages && dados.existingImages.front) ??
    null;
  const backImage =
    dados.backImage ??
    dados.backCNH ??
    (dados.existingImages && dados.existingImages.back) ??
    null;
  const cnhvalida = dados.cnhvalida ?? null;

  // Validações específicas CNH
  if (!frontImage && !backImage && (dados.frontImage !== undefined || dados.backImage !== undefined || dados.frontCNH !== undefined || dados.backCNH !== undefined || dados.existingImages)) {
    // se o caller enviou intenção de validar imagens (algum campo relacionado existe), então cobramos
    errosEspecificos.push('Faltam as imagens da CNH (frente e verso).');
  } else if (!frontImage && (dados.frontImage !== undefined || dados.frontCNH !== undefined || (dados.existingImages && 'front' in dados.existingImages))) {
    errosEspecificos.push('A imagem da frente da CNH é obrigatória.');
  } else if (!backImage && (dados.backImage !== undefined || dados.backCNH !== undefined || (dados.existingImages && 'back' in dados.existingImages))) {
    errosEspecificos.push('A imagem do verso da CNH é obrigatória.');
  }

  // Se ambas imagens estão presentes, requer que a validação da CNH já tenha ocorrido e esteja "valido"
  if (frontImage && backImage) {
    if (cnhvalida === null || cnhvalida === 'pendente' || typeof cnhvalida === 'undefined') {
      errosEspecificos.push('A CNH precisa ser validada antes de prosseguir.');
    }
  }

  return {
    valido: camposVazios.length === 0 && errosEspecificos.length === 0,
    camposVazios,
    errosEspecificos,
  };
};
