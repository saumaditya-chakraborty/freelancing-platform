const API = "http://localhost:8080";

// Get My Portfolio
export async function getMyPortfolio() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/portfolio`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

// Create Portfolio
export async function createPortfolio(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Update Portfolio
export async function updatePortfolio(id, data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/portfolio/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// Delete Portfolio
export async function deletePortfolio(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/portfolio/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}