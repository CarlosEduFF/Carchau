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
@CrossOrigin(origins = "*") // Permite acesso do React local
public class AuthController {

    private final AuthService authService;

    // Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) throws Exception {
        LoginResponse response = authService.login(request);
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
        // Se precisar invalidar token ou sessão, faça no AuthService
        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}
