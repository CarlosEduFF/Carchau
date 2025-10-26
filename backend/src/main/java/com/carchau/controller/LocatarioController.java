package com.carchau.controller;

import com.carchau.model.locatario.Locatario;
import com.carchau.service.LocatarioService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/locatarios")
@CrossOrigin(origins = "http://localhost:3000") // ajuste para o domínio do seu front
public class LocatarioController {

    private final LocatarioService locatarioService;

    @Autowired
    public LocatarioController(LocatarioService locatarioService) {
        this.locatarioService = locatarioService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyLocatario(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header inválido");
            }

            String idToken = authorization.substring(7);
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String uid = decodedToken.getUid();

            Locatario locatario = locatarioService.getLocatarioById(uid);
            return ResponseEntity.ok(locatario);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no servidor: " + e.getMessage());
        }
    }
}
