package com.carchau.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.carchau.model.login.LoginRequest;
import com.carchau.model.login.LoginResponse;
import com.carchau.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000") // Limita ao seu frontend local
public class AuthController {

    private final AuthService authService;

    // Login (Busca dados pós-autenticação no front)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> getUserInfo(@RequestBody LoginRequest request) throws Exception {
        LoginResponse response = authService.getUserInfoByEmail(request);
        return ResponseEntity.ok(response);
    }

    // Reset de senha
    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String link = authService.sendPasswordReset(body.get("email"));
        return ResponseEntity.ok("Link de redefinição gerado: " + link);
    }

    // Logout
    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}
