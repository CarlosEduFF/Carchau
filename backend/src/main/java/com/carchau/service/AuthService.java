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
        log.info("[Auth] Recebida solicitação de perfil para: {}", request.getEmail());
        try {
            UserRecord userRecord = firebaseAuth.getUserByEmail(request.getEmail());
            String userId = userRecord.getUid();
            log.info("[Auth] Usuário encontrado no Firebase Auth. UID: {}", userId);
            
            Locatario locatario = locatarioService.getLocatarioById(userId);
            log.info("[Auth] Perfil do locatário encontrado no Firestore.");
            
            return new LoginResponse(userId, userRecord.getEmail(), locatario);
        } catch (FirebaseAuthException e) {
            log.error("[Auth] Erro no Firebase Admin SDK ao buscar e-mail {}: {}", request.getEmail(), e.getMessage());
            throw new RuntimeException("Usuário não encontrado no sistema de autenticação.");
        } catch (Exception e) {
            log.error("[Auth] Erro ao buscar perfil no Firestore para UID: {}. Detalhe: {}", request.getEmail(), e.getMessage());
            throw e; // Lança para o GlobalExceptionHandler tratar (provavelmente RuntimeException)
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
