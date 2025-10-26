package com.carchau.model.login;

import com.carchau.model.locatario.Locatario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String userId;
    private String email;
    private Locatario dadosPerfil;
}