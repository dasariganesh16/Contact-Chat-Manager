package com.contactchatmanager.controller;

import com.contactchatmanager.model.Message;
import com.contactchatmanager.repository.MessageRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class MessageController {
  private final MessageRepository messageRepository;

  public MessageController(MessageRepository messageRepository) {
    this.messageRepository = messageRepository;
  }

  @PostMapping("/send")
  public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
    if (message.getStatus() == null) {
      message.setStatus("SENT");
    }
    return ResponseEntity.ok(messageRepository.save(message));
  }

  @GetMapping("/history")
  public ResponseEntity<List<Message>> messageHistory(
      @RequestParam(required = false) String senderId,
      @RequestParam(required = false) String receiverId) {
    if (senderId != null && receiverId != null) {
      return ResponseEntity.ok(
          messageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
              senderId, receiverId, receiverId, senderId));
    }
    return ResponseEntity.ok(messageRepository.findAll());
  }

  @DeleteMapping("/message/{id}")
  public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
    messageRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
