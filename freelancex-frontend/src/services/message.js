const API = "http://localhost:8080";

export async function getConversations() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/conversations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

export async function getMessages(
  conversationId
) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/messages/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}