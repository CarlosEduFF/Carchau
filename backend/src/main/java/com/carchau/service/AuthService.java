package com.carchau.service;

import org.springframework.stereotype.Service;

import com.carchau.model.locatario.Locatario;
import com.carchau.model.login.LoginRequest;
import com.carchau.model.login.LoginResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;

@Service
public class AuthService {

    /**
     * Login usando Admin SDK
     * Observação: não autentica senha diretamente,
     * apenas retorna dados do usuário e cria um custom token
     */
    private final LocatarioService locatarioService;

    public AuthService(LocatarioService locatarioService) {
        this.locatarioService = locatarioService;
    }

    public LoginResponse login(LoginRequest request) throws Exception {
        // Verifica email e senha usando Firebase
        UserRecord userRecord;
        try {
            userRecord = FirebaseAuth.getInstance().getUserByEmail(request.getEmail());
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Usuário não encontrado");
        }

        // Captura o userId
        String userId = userRecord.getUid();

        // Busca os dados do Firestore
        Locatario locatario = locatarioService.getLocatarioById(userId);

        // Retorna tudo para o frontend
        return new LoginResponse(userId, userRecord.getEmail(), locatario);
    }

    /**
     * Envia link de redefinição de senha
     */
    public String sendPasswordReset(String email) {
        try {
            // Gera link de redefinição
            return FirebaseAuth.getInstance().generatePasswordResetLink(email);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Erro ao gerar link de redefinição de senha", e);
        }
    }

}
