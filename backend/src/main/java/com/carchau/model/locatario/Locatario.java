package com.carchau.model.locatario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Locatario {
    private String id;
    private String cpf;
    private String email;
    private String fotoPerfil;
    private String fotoFront;
    private String nacionalidade;
    private String nome;
    private String profissao;
    private String sexo;
    private String telefone;
    private String cnhvalida;
}
