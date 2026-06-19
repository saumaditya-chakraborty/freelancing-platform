const API = "http://localhost:8080";

export async function login(email, password) {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  console.log("STATUS:", response.status);
  console.log("DATA:", data);

  return data;
}