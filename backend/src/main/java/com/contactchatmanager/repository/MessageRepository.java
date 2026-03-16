package com.contactchatmanager.repository;

import com.contactchatmanager.model.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
  List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);

  List<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
      String senderId, String receiverId, String senderId2, String receiverId2);
}
