package com.carchau.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.carchau.model.chat.ChatRoom;
import com.carchau.model.chat.Message;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final Firestore firestore;

    /**
     * Busca salas de chat onde o usuário participa.
     */
    public List<ChatRoom> getChatRoomsForUser(String userId) throws Exception {
        List<ChatRoom> rooms = new ArrayList<>();
        
        // Query: participants array-contains userId
        Query query = firestore.collection("ChatRooms")
                .whereArrayContains("participants", userId);
        
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot document : documents) {
            ChatRoom room = document.toObject(ChatRoom.class);
            room.setChatId(document.getId());
            rooms.add(room);
        }
        
        // Fallback: se o ID fixo for usado em documentos que não têm o array 'participants'
        // mas o ID faz parte do nome do documento (ex: a_b)
        if (rooms.isEmpty()) {
            ApiFuture<QuerySnapshot> allRoomsFuture = firestore.collection("ChatRooms").get();
            for (QueryDocumentSnapshot doc : allRoomsFuture.get().getDocuments()) {
                if (doc.getId().contains(userId)) {
                    ChatRoom room = doc.toObject(ChatRoom.class);
                    room.setChatId(doc.getId());
                    rooms.add(room);
                }
            }
        }
        
        return rooms;
    }

    /**
     * Busca mensagens de uma sala específica.
     */
    public List<Message> getMessages(String chatId) throws Exception {
        List<Message> messages = new ArrayList<>();
        
        ApiFuture<QuerySnapshot> future = firestore.collection("ChatRooms")
                .document(chatId)
                .collection("messages")
                .orderBy("createdAt", Query.Direction.ASCENDING)
                .get();
        
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            Message msg = document.toObject(Message.class);
            msg.set_id(document.getId());
            messages.add(msg);
        }
        
        return messages;
    }

    /**
     * Envia uma mensagem.
     */
    public void sendMessage(String chatId, Message message) throws Exception {
        DocumentReference roomRef = firestore.collection("ChatRooms").document(chatId);
        
        // Salva a mensagem na subcoleção
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(new Date());
        }
        
        roomRef.collection("messages").add(message).get();
        
        // Atualiza o resumo da sala
        Map<String, Object> update = new HashMap<>();
        update.put("lastMessage", message.getText());
        update.put("lastUpdated", message.getCreatedAt());
        
        roomRef.set(update, SetOptions.merge()).get();
    }
}
