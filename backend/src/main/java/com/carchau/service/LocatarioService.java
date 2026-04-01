package com.carchau.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.carchau.model.locatario.Locatario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocatarioService {

    private final Firestore firestore;

    public List<Locatario> getAllLocatarios() throws Exception {
        List<Locatario> locatarios = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = firestore.collection("Locatarios").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot document : documents) {
            Locatario locatario = document.toObject(Locatario.class);
            String userId = document.getId();
            locatario.setId(userId);
            
            // Busca o status CNH em subcoleção: /Locatarios/{id}/Documentos/CNH
            DocumentReference cnhRef = firestore.collection("Locatarios").document(userId)
                    .collection("Documentos").document("CNH");
            DocumentSnapshot cnhSnapshot = cnhRef.get().get();
            
            if (cnhSnapshot.exists()) {
                locatario.setCnhvalida(cnhSnapshot.getString("cnhvalida"));
            }
            
            locatarios.add(locatario);
        }
        return locatarios;
    }

    public Locatario getLocatarioById(String userId) throws Exception {
        ApiFuture<DocumentSnapshot> future = firestore.collection("Locatarios").document(userId).get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Locatario locatario = document.toObject(Locatario.class);
            locatario.setId(userId);
            
            // Também preenche o status aqui se necessário para o perfil
            DocumentReference cnhRef = firestore.collection("Locatarios").document(userId)
                    .collection("Documentos").document("CNH");
            DocumentSnapshot cnhSnapshot = cnhRef.get().get();
            if (cnhSnapshot.exists()) {
                locatario.setCnhvalida(cnhSnapshot.getString("cnhvalida"));
            }

            return locatario;
        } else {
            throw new RuntimeException("Dados do locatário não encontrados.");
        }
    }

    public Map<String, Object> getCnhDetails(String userId) throws Exception {
        DocumentReference cnhRef = firestore.collection("Locatarios").document(userId)
                .collection("Documentos").document("CNH");
        DocumentSnapshot snapshot = cnhRef.get().get();

        if (snapshot.exists()) {
            Map<String, Object> data = snapshot.getData();
            if (data == null) return new HashMap<>();
            data.put("id", userId);
            return data;
        }
        return null;
    }

    public void updateCnhStatus(String userId, String status) throws Exception {
        DocumentReference cnhRef = firestore.collection("Locatarios").document(userId)
                .collection("Documentos").document("CNH");
        
        Map<String, Object> updates = new HashMap<>();
        updates.put("cnhvalida", status);
        
        cnhRef.set(updates, SetOptions.merge()).get();
    }
}