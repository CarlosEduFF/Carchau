package com.carchau.controller;

import com.carchau.model.locatario.Locatario;
import com.carchau.service.AuthService;
import com.carchau.service.LocatarioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locatarios")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class LocatarioController {

    private final LocatarioService locatarioService;
    private final AuthService authService;

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
}
