package com.carchau.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.carchau.model.chat.ChatRoom;
import com.carchau.model.chat.Message;
import com.carchau.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getChatRooms(@RequestParam String userId) throws Exception {
        return ResponseEntity.ok(reportService.getChatRoomsForUser(userId));
    }

    @GetMapping("/rooms/{chatId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String chatId) throws Exception {
        return ResponseEntity.ok(reportService.getMessages(chatId));
    }

    @PostMapping("/rooms/{chatId}/messages")
    public ResponseEntity<String> sendMessage(@PathVariable String chatId, @RequestBody Message message) throws Exception {
        reportService.sendMessage(chatId, message);
        return ResponseEntity.ok("Mensagem enviada com sucesso!");
    }
}
