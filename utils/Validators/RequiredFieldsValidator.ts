
export type ValidarCamposResultado = {
  valido: boolean;
  camposVazios: string[];
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

  return {
    valido: camposVazios.length === 0,
    camposVazios,
  };
};