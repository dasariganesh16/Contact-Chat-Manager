package com.contactchatmanager.repository;

import com.contactchatmanager.model.Contact;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
  List<Contact> findByUserId(String userId);

  List<Contact> findByNicknameContainingIgnoreCase(String nickname);
}

