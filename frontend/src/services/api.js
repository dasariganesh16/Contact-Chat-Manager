const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  listContacts(userId) {
    const query = userId ? `?userId=${userId}` : "";
    return request(`/contacts/list${query}`);
  },
  addContact(payload) {
    return request("/contacts/add", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  updateContact(payload) {
    return request("/contacts/update", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  deleteContact(contactId) {
    return request(`/contacts/${contactId}`, {
      method: "DELETE"
    });
  },
  sendMessage(payload) {
    return request("/chat/send", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  chatHistory(senderId, receiverId) {
    const query = senderId && receiverId ? `?senderId=${senderId}&receiverId=${receiverId}` : "";
    return request(`/chat/history${query}`);
  }
};

export default api;
