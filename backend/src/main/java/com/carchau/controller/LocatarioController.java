package com.carchau.controller;

import com.carchau.model.locatario.Locatario;
import com.carchau.service.AuthService;
import com.carchau.service.LocatarioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/locatarios")
@CrossOrigin(origins = "http://localhost:3000") // ajuste para o seu front
@RequiredArgsConstructor
public class LocatarioController {

    private final LocatarioService locatarioService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Locatario>> getAllLocatarios() throws Exception {
        return ResponseEntity.ok(locatarioService.getAllLocatarios());
    }

    @GetMapping("/me")
    public ResponseEntity<Locatario> getMyLocatario(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) throws Exception {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization header inválido");
        }

        String idToken = authorization.substring(7);
        String uid = authService.verifyIdToken(idToken);

        Locatario locatario = locatarioService.getLocatarioById(uid);
        return ResponseEntity.ok(locatario);
    }

    // Novos endpoints para CNH
    @GetMapping("/{id}/cnh")
    public ResponseEntity<Map<String, Object>> getCnhDetails(@PathVariable String id) throws Exception {
        return ResponseEntity.ok(locatarioService.getCnhDetails(id));
    }

    @PutMapping("/{id}/cnh-status")
    public ResponseEntity<String> updateCnhStatus(@PathVariable String id, @RequestBody Map<String, String> statusBody) throws Exception {
        String status = statusBody.get("status");
        locatarioService.updateCnhStatus(id, status);
        return ResponseEntity.ok("Status da CNH atualizado com sucesso!");
    }
}
