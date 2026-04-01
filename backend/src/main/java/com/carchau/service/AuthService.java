package com.carchau.service;

import org.springframework.stereotype.Service;

import com.carchau.model.locatario.Locatario;
import com.carchau.model.login.LoginRequest;
import com.carchau.model.login.LoginResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final FirebaseAuth firebaseAuth;
    private final LocatarioService locatarioService;

    /**
     * Busca dados do usuário pelo email.
     * Importante: O Firebase Admin SDK não autentica por senha. 
     * A autenticação deve ser feita no frontend.
     */
    public LoginResponse getUserInfoByEmail(LoginRequest request) throws Exception {
        try {
            UserRecord userRecord = firebaseAuth.getUserByEmail(request.getEmail());
            String userId = userRecord.getUid();
            Locatario locatario = locatarioService.getLocatarioById(userId);
            
            return new LoginResponse(userId, userRecord.getEmail(), locatario);
        } catch (FirebaseAuthException e) {
            log.error("Usuário não encontrado: {}", request.getEmail());
            throw new RuntimeException("Usuário não encontrado ou credenciais inválidas");
        }
    }

    /**
     * Verifica se o Token de ID enviado pelo frontend é válido.
     */
    public String verifyIdToken(String idToken) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(idToken).getUid();
    }

    /**
     * Envia link de redefinição de senha
     */
    public String sendPasswordReset(String email) {
        try {
            return firebaseAuth.generatePasswordResetLink(email);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Erro ao gerar link de redefinição de senha", e);
        }
    }
}
