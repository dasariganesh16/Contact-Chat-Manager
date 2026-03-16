# Contact Chat Manager - Java Full Stack Skill Guide

## 1. Core Skills Required (Java FSD)

### Backend (Java)

-   Core Java
-   OOP Concepts
-   Collections Framework
-   Exception Handling
-   Multithreading
-   Java Streams

### Backend Framework

-   Spring Boot
-   Spring MVC
-   Spring Data JPA / Hibernate
-   REST API Development
-   JWT Authentication
-   WebSockets (Real-time communication)

### Database

-   MySQL / PostgreSQL
-   SQL Queries
-   Database Design
-   Indexing
-   Relationships (OneToMany, ManyToMany)

### Frontend

-   HTML
-   CSS
-   JavaScript
-   React.js
-   Axios / Fetch API
-   State Management

### Dev Tools

-   Git & GitHub
-   Postman
-   Maven / Gradle
-   VS Code / IntelliJ
-   Docker (Optional)

------------------------------------------------------------------------

# 2. System Architecture

Frontend (React / HTML JS) \| \| REST APIs / WebSockets \| \| Spring
Boot Backend \| \| MySQL Database

------------------------------------------------------------------------

# 3. User Management Module

Features: - Register User - Login User - Logout - JWT Authentication -
Profile Management

Example APIs

POST /api/auth/register\
POST /api/auth/login\
GET /api/user/profile\
PUT /api/user/update

User Entity

User - id - name - email - phone - password - profilePic - status -
createdAt

------------------------------------------------------------------------

# 4. Contact Management

Features: - Add Contact - Delete Contact - Update Contact - Search
Contacts - Favorite Contacts - Block Contacts

Contact Table

Contact - id - user_id - contact_id - nickname - isFavorite -
isBlocked - createdAt

APIs

POST /contacts/add\
GET /contacts/list\
DELETE /contacts/{id}\
PUT /contacts/update\
GET /contacts/search

------------------------------------------------------------------------

# 5. Chat Messaging System

Features: - Send Message - Receive Message - Real-time Chat - Message
Status - Message History - Delete Message

Message Table

Message - id - sender_id - receiver_id - content - timestamp - status -
isDeleted

APIs

POST /chat/send\
GET /chat/history\
DELETE /chat/message/{id}

------------------------------------------------------------------------

# 6. Real-Time Chat (WebSocket)

Technology: - Spring Boot WebSocket - STOMP Protocol

Flow

User A → WebSocket → Server → WebSocket → User B

Dependencies

-   spring-boot-starter-websocket
-   spring-boot-starter-web
-   spring-boot-starter-data-jpa
-   spring-boot-starter-security

------------------------------------------------------------------------

# 7. Chat Features

Messaging Features - Text Messages - Emoji Support - Message
Timestamps - Message Read/Unread - Typing Indicator

Advanced Messaging - Edit Message - Delete Message - Reply to Message -
Forward Message

------------------------------------------------------------------------

# 8. Chat List

Features - Recent Chats - Last Message Preview - Unread Message Count -
Online/Offline Indicator

Chat Table

Chat - id - user1 - user2 - last_message - last_message_time

------------------------------------------------------------------------

# 9. Search System

Search Features - Search Contacts - Search Messages - Filter Chats

Examples

GET /search?name=ganesh\
GET /search/messages?q=hello

------------------------------------------------------------------------

# 10. Notifications

Features - New Message Notification - Unread Message Badge - Email
Notification (Optional)

Technologies - WebSocket - Firebase Push Notifications (Optional)

------------------------------------------------------------------------

# 11. Security

Implement

-   JWT Authentication
-   Password Hashing (BCrypt)
-   API Authorization
-   Role-Based Access

Roles

USER\
ADMIN

------------------------------------------------------------------------

# 12. Admin Panel (Optional)

Admin Can - View Users - Delete Users - Monitor Chats - Ban Users

Admin Table

Admin - id - name - email - role

------------------------------------------------------------------------

# 13. File Sharing (Advanced Feature)

Users can send

-   Images
-   Videos
-   Documents

Storage Options

-   Local Storage
-   AWS S3
-   Cloudinary

Message Table Extra Fields

-   file_url
-   file_type

------------------------------------------------------------------------

# 14. Additional Features

-   Online Status
-   Last Seen
-   Dark Mode
-   Message Reactions
-   Group Chats
-   Voice Messages
-   Message Encryption

------------------------------------------------------------------------

# 15. Database Tables

-   Users
-   Contacts
-   Messages
-   Chats
-   Notifications
-   Files

Relationships

User 1 → Many Contacts\
User 1 → Many Messages\
Chat 1 → Many Messages

------------------------------------------------------------------------

# 16. Backend Folder Structure

backend - controller - service - repository - model - dto - config -
security

------------------------------------------------------------------------

# 17. Frontend Folder Structure

frontend - components - pages - services - context - utils

------------------------------------------------------------------------

# 18. Skills You Gain

-   Full Stack Development
-   REST API Design
-   Real-Time Communication
-   Authentication & Security
-   Database Design
-   System Architecture

------------------------------------------------------------------------

# 19. Difficulty Levels

Basic Contact Manager --- Easy\
Messaging System --- Medium\
Real-Time Chat --- Hard\
Group Chat --- Hard\
File Sharing --- Hard
