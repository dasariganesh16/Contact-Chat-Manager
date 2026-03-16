package com.contactchatmanager.controller;

import com.contactchatmanager.model.Contact;
import com.contactchatmanager.repository.ContactRepository;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contacts")
public class ContactController {
  private final ContactRepository contactRepository;

  public ContactController(ContactRepository contactRepository) {
    this.contactRepository = contactRepository;
  }

  @PostMapping("/add")
  public ResponseEntity<Contact> addContact(@RequestBody Contact contact) {
    return ResponseEntity.ok(contactRepository.save(contact));
  }

  @GetMapping("/list")
  public ResponseEntity<List<Contact>> listContacts(@RequestParam(required = false) String userId) {
    if (userId == null) {
      return ResponseEntity.ok(contactRepository.findAll());
    }
    return ResponseEntity.ok(contactRepository.findByUserId(userId));
  }

  @PutMapping("/update")
  public ResponseEntity<Contact> updateContact(@RequestBody Contact contact) {
    if (contact.getId() == null) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok(contactRepository.save(contact));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
    contactRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/search")
  public ResponseEntity<List<Contact>> searchContacts(@RequestParam String name) {
    return ResponseEntity.ok(contactRepository.findByNicknameContainingIgnoreCase(name));
  }
}

