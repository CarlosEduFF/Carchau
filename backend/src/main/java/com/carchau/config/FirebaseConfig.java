package com.carchau.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            try (InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("carchauappSDK.json")) {
                if (serviceAccount == null) {
                    throw new IOException("Arquivo de credenciais do Firebase não encontrado no classpath!");
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase inicializado com sucesso!");
            }
        }
        return FirestoreClient.getFirestore();
    }
}
