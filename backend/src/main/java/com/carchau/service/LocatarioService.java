package com.carchau.service;

import org.springframework.stereotype.Service;

import com.carchau.model.locatario.Locatario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;

@Service
public class LocatarioService {

    private final Firestore firestore;

    public LocatarioService(Firestore firestore) {
        this.firestore = firestore;
    }

    public Locatario getLocatarioById(String userId) throws Exception {
        ApiFuture<DocumentSnapshot> future = firestore.collection("Locatarios").document(userId).get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(Locatario.class);
        } else {
            throw new RuntimeException("Usuário não encontrado no Firestore");
        }
    }
}