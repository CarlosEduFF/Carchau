interface AddressResponse {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

export const findAddressbyCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data: AddressResponse = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return {
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        throw error;
    }
};
