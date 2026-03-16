import { useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "./services/api.js";

const initialRegister = {
  name: "",
  email: "",
  password: "",
  phone: ""
};

const initialLogin = {
  email: "",
  password: ""
};

const initialContact = {
  mobileNumber: "",
  name: ""
};

const initialMessage = {
  receiverId: "",
  content: ""
};

export function App() {
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [contactForm, setContactForm] = useState(initialContact);
  const [messageForm, setMessageForm] = useState(initialMessage);
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ type: "info", text: "Ready." });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const activeUserId = currentUser?.userId || "";

  const title = useMemo(() => {
    if (activeTab === "chat") {
      return "Chat";
    }
    if (activeTab === "register") {
      return "Register";
    }
    if (activeTab === "login") {
      return "Login";
    }
    if (activeTab === "account") {
      return "Account";
    }
    if (activeTab === "contact-details") {
      return "Contact";
    }
    return "Contacts";
  }, [activeTab]);

  const summary = useMemo(() => {
    if (!currentUser) {
      return "No user session yet.";
    }
    return `Signed in as ${currentUser.name || currentUser.email} (Mobile ${currentUser.userId}).`;
  }, [currentUser]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) {
      return contacts;
    }
    const term = searchTerm.toLowerCase();
    return contacts.filter((contact) => {
      const name = contact.nickname?.toLowerCase() || "";
      const mobileNumber = String(contact.contactId || "");
      return name.includes(term) || mobileNumber.includes(term);
    });
  }, [contacts, searchTerm]);

  useEffect(() => {
    if (!activeUserId) {
      setContacts([]);
      setMessages([]);
      return;
    }
    api
      .listContacts(activeUserId)
      .then(setContacts)
      .catch((error) => setStatus({ type: "error", text: error.message }));
  }, [activeUserId]);

  useEffect(() => {
    if (!selectedContact) {
      return;
    }
    setMessageForm((prev) => ({
      ...prev,
      receiverId: String(selectedContact.contactId || "")
    }));
  }, [selectedContact]);

  const updateField = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.register(registerForm);
      setAuthToken(response.token);
      setCurrentUser(response);
      setRegisterForm(initialRegister);
      setStatus({ type: "success", text: response.message || "Registered." });
      setActiveTab("contacts");
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.login(loginForm);
      setAuthToken(response.token);
      setCurrentUser(response);
      setLoginForm(initialLogin);
      setStatus({ type: "success", text: response.message || "Logged in." });
      setActiveTab("contacts");
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (event) => {
    event.preventDefault();
    if (!activeUserId) {
      setStatus({ type: "error", text: "Log in to add contacts." });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId: String(activeUserId),
        contactId: String(contactForm.mobileNumber),
        nickname: contactForm.name,
        favorite: false,
        blocked: false
      };
      const saved = await api.addContact(payload);
      setContacts((prev) => [saved, ...prev]);
      setContactForm(initialContact);
      setShowAddContact(false);
      setStatus({ type: "success", text: "Contact added." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async (updates) => {
    if (!selectedContact) {
      return;
    }
    setLoading(true);
    try {
      const payload = { ...selectedContact, ...updates };
      const saved = await api.updateContact(payload);
      setContacts((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      setSelectedContact(saved);
      setStatus({ type: "success", text: "Contact updated." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) {
      return;
    }
    setLoading(true);
    try {
      await api.deleteContact(selectedContact.id);
      setContacts((prev) => prev.filter((item) => item.id !== selectedContact.id));
      setSelectedContact(null);
      setShowContactDetails(false);
      setStatus({ type: "success", text: "Contact deleted." });
      setActiveTab("contacts");
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!selectedContact) {
      return;
    }
    handleUpdateContact({ favorite: !selectedContact.favorite });
  };

  const handleToggleBlocked = () => {
    if (!selectedContact) {
      return;
    }
    handleUpdateContact({ blocked: !selectedContact.blocked });
  };

  const loadHistoryFor = async (receiverId) => {
    if (!activeUserId || !receiverId) {
      setStatus({ type: "error", text: "Provide both sender and receiver mobile numbers." });
      return;
    }
    setLoading(true);
    try {
      const history = await api.chatHistory(String(activeUserId), String(receiverId));
      setMessages(history);
      setStatus({ type: "success", text: "Loaded message history." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = () => {
    if (!selectedContact) {
      setStatus({ type: "error", text: "Select a contact first." });
      return;
    }
    setActiveTab("chat");
    loadHistoryFor(String(selectedContact.contactId || ""));
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!activeUserId) {
      setStatus({ type: "error", text: "Log in to send messages." });
      return;
    }
    if (!messageForm.receiverId) {
      setStatus({ type: "error", text: "Provide a mobile number." });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        senderId: String(activeUserId),
        receiverId: String(messageForm.receiverId),
        content: messageForm.content,
        status: "SENT"
      };
      const saved = await api.sendMessage(payload);
      setMessages((prev) => [saved, ...prev]);
      setMessageForm((prev) => ({ ...prev, content: "" }));
      setStatus({ type: "success", text: "Message sent." });
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setContacts([]);
    setMessages([]);
    setSelectedContact(null);
    setShowContactDetails(false);
    setActiveTab("login");
    setStatus({ type: "info", text: "Logged out." });
  };

  const navItems = currentUser
    ? [
        { key: "contacts", label: "Contacts" },
        { key: "chat", label: "Chat" },
        { key: "account", label: "Account" }
      ]
    : [
        { key: "login", label: "Login" },
        { key: "register", label: "Register" }
      ];

  const showBottomNav = activeTab !== "contact-details";

  return (
    <div className="page">
      <div className="phone">
        <header className="topbar">
          <div>
            <p className="eyebrow">Contact Chat</p>
            <h1>{title}</h1>
          </div>
          <div className="user-chip">
            <span className="dot" data-state={currentUser ? "on" : "off"} />
            <span>{currentUser ? `Mobile ${currentUser.userId}` : "Guest"}</span>
          </div>
        </header>

        <section className="status">
          <strong>Status</strong>
          <span>{status.text}</span>
        </section>

        {activeTab === "contacts" && (
          <section className="screen">
            <div className="search-row">
              <input
                type="search"
                placeholder="Search contacts"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button
                className="ghost"
                type="button"
                onClick={() => setShowAddContact((prev) => !prev)}
              >
                {showAddContact ? "Close" : "Add"}
              </button>
            </div>

            {showAddContact && (
              <form className="card" onSubmit={handleAddContact}>
                <h3>Add contact</h3>
                <input
                  name="name"
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={updateField(setContactForm)}
                  required
                />
                <input
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={contactForm.mobileNumber}
                  onChange={updateField(setContactForm)}
                  required
                />
                <button className="primary" type="submit" disabled={loading}>
                  Save
                </button>
              </form>
            )}

            <div className="list">
              {filteredContacts.length === 0 ? (
                <div className="empty">No contacts yet.</div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    className="list-item"
                    onClick={() => {
                      setSelectedContact(contact);
                      setActiveTab("contact-details");
                      setShowContactDetails(true);
                    }}
                  >
                    <div>
                      <strong>{contact.nickname || "Unnamed"}</strong>
                      <span>Mobile {contact.contactId}</span>
                      <div className="pill-row">
                        {contact.favorite ? <span className="pill">Fav</span> : null}
                        {contact.blocked ? <span className="pill danger">Blocked</span> : null}
                      </div>
                    </div>
                    <span className="chevron">View</span>
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "contact-details" && selectedContact && (
          <section className="screen">
            <button
              className="ghost"
              type="button"
              onClick={() => {
                setActiveTab("contacts");
                setShowContactDetails(false);
              }}
            >
              Back to contacts
            </button>
            <div className="card">
              <h3>Contact details</h3>
              <p className="muted">Name: {selectedContact.nickname || "Unnamed"}</p>
              <p className="muted">Mobile: {selectedContact.contactId}</p>
              <div className="action-row">
                <button className="ghost" type="button" onClick={handleToggleFavorite}>
                  {selectedContact.favorite ? "Remove favorite" : "Add to favorites"}
                </button>
                <button className="ghost danger" type="button" onClick={handleToggleBlocked}>
                  {selectedContact.blocked ? "Unblock" : "Block"}
                </button>
                <button className="ghost danger" type="button" onClick={handleDeleteContact}>
                  Delete
                </button>
                <button className="primary" type="button" onClick={handleOpenChat}>
                  Message
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "chat" && (
          <section className="screen">
            <div className="card">
              <h3>Chat</h3>
              <p className="muted">{summary}</p>
              {selectedContact ? (
                <p className="muted">
                  Talking to {selectedContact.nickname || "Unnamed"} (Mobile {selectedContact.contactId})
                </p>
              ) : null}
              <div className="chat-meta">
                <input
                  name="receiverId"
                  placeholder="Mobile Number"
                  value={messageForm.receiverId}
                  onChange={updateField(setMessageForm)}
                />
                <button
                  className="ghost"
                  type="button"
                  onClick={() => loadHistoryFor(messageForm.receiverId)}
                  disabled={loading}
                >
                  Load
                </button>
              </div>
            </div>

            <div className="chat-history">
              {messages.length === 0 ? (
                <p className="empty">No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bubble ${
                      String(message.senderId) === String(activeUserId) ? "out" : "in"
                    }`}
                  >
                    <span className="bubble-meta">
                      {message.senderId} to {message.receiverId}
                    </span>
                    <p>{message.content}</p>
                  </div>
                ))
              )}
            </div>

            <form className="composer" onSubmit={handleSendMessage}>
              <textarea
                name="content"
                placeholder="Type a message"
                rows={2}
                value={messageForm.content}
                onChange={updateField(setMessageForm)}
                required
              />
              <button className="primary" type="submit" disabled={loading}>
                Send
              </button>
            </form>
          </section>
        )}

        {activeTab === "login" && !currentUser && (
          <section className="screen">
            <form className="card" onSubmit={handleLogin}>
              <h3>Login</h3>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={updateField(setLoginForm)}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={updateField(setLoginForm)}
                required
              />
              <button className="primary" type="submit" disabled={loading}>
                Log in
              </button>
            </form>
          </section>
        )}

        {activeTab === "register" && !currentUser && (
          <section className="screen">
            <form className="card" onSubmit={handleRegister}>
              <h3>Register</h3>
              <input
                name="name"
                placeholder="Name"
                value={registerForm.name}
                onChange={updateField(setRegisterForm)}
                required
              />
              <input
                name="phone"
                placeholder="Mobile Number"
                value={registerForm.phone}
                onChange={updateField(setRegisterForm)}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={updateField(setRegisterForm)}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={updateField(setRegisterForm)}
                required
              />
              <button className="primary" type="submit" disabled={loading}>
                Create account
              </button>
            </form>
          </section>
        )}

        {activeTab === "account" && currentUser && (
          <section className="screen">
            <div className="card">
              <h3>Account</h3>
              <p className="muted">{summary}</p>
              <button className="ghost" type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </section>
        )}

        {showBottomNav && (
          <nav className="bottom-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={activeTab === item.key ? "active" : ""}
                onClick={() => setActiveTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
