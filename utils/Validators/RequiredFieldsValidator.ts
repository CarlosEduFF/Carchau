export type ValidarCamposResultado = {
  valido: boolean;
  camposVazios: string[];
  errosEspecificos?: string[];
};

export const validarCampos = (
  dados: Record<string, any>,
  camposObrigatorios: string[]
): ValidarCamposResultado => {
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

  // 🔍 Verificação específica para CNH
  const frontImage = dados.frontImage;
  const backImage = dados.backImage;
  const cnhvalida = dados.cnhvalida;

  if (!frontImage && !backImage) {
    errosEspecificos.push('Faltam as imagens da CNH (frente e verso).');
  } else if (!frontImage) {
    errosEspecificos.push('A imagem da frente da CNH é obrigatória.');
  } else if (!backImage) {
    errosEspecificos.push('A imagem do verso da CNH é obrigatória.');
  }

  // Validação extra: CNH não pode estar "pendente" ou indefinida se ambas as imagens existem
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
