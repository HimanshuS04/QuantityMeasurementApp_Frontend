// js/apiClient.js

const API_BASE = "/api/v1";

async function sendRequest(path, method = "GET", body = null, token = null) {
    const url = `${API_BASE}${path}`;
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch (networkError) {
        throw new Error("Network error. Please check your connection or API status.");
    }

    const text = await response.text();
    let payload = null;
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch {
            payload = text;
        }
    }

    if (!response.ok) {
        const message = (payload && payload.message) || payload || response.statusText;
        throw new Error(typeof message === "string" ? message : "Request failed.");
    }

    return payload;
}