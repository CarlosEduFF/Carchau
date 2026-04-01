package com.carchau.model.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {
    private String chatId;
    private List<String> participants;
    private String lastMessage;
    private Date lastUpdated;
    
    // Campos preenchidos sob demanda pelo backend (não persistidos na coleção principal necessariamente)
    private String displayName;
    private String avatar;
}
