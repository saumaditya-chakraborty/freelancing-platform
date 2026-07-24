const API = "http://localhost:8080";

export async function adminLogin(email, password) {

    const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export function getToken() {
    return localStorage.getItem("token");
}

export async function getDashboard() {

    const response = await fetch(`${API}/admin/dashboard`, {

        headers: {
            Authorization: `Bearer ${getToken()}`
        }

    });

    if (!response.ok)
        throw new Error("Unauthorized");

    return response.json();
}
export async function getUsers() {

    const res = await fetch("http://localhost:8080/admin/users",{
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

    return await res.json();
}

export async function blockUser(id){

    return fetch(`http://localhost:8080/admin/users/${id}/block`,{
        method:"PATCH",
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

}

export async function unblockUser(id){

    return fetch(`http://localhost:8080/admin/users/${id}/unblock`,{
        method:"PATCH",
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

}

export async function banUser(id){

    return fetch(`http://localhost:8080/admin/users/${id}/ban`,{
        method:"PATCH",
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

}

export async function getProjects(){

    const res=await fetch("http://localhost:8080/admin/projects",{
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

    return res.json();

}

export async function deleteProject(id){

    return fetch(`http://localhost:8080/admin/projects/${id}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

}

export async function getProposals(){

    const res=await fetch("http://localhost:8080/admin/proposals",{
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

    return res.json();

}

export async function deleteProposal(id){

    return fetch(`http://localhost:8080/admin/proposals/${id}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${getToken()}`
        }
    });

}