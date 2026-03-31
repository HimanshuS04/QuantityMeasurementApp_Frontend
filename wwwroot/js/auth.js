// js/auth.js

const TOKEN_KEY = "qm_jwt_token";
const USER_EMAIL_KEY = "qm_user_email";

function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_EMAIL_KEY);
}

function setUserEmail(email) {
    window.localStorage.setItem(USER_EMAIL_KEY, email);
}

function getUserEmail() {
    return window.localStorage.getItem(USER_EMAIL_KEY) || "";
}

async function login(email, password) {
    const payload = { email, password };
    const result = await sendRequest("/auth/login", "POST", payload, null);
    if (!result || !result.token) {
        throw new Error("Login failed: token missing.");
    }
    setToken(result.token);
    setUserEmail(email);
}

async function register(email, password) {
    const payload = { email, password };
    await sendRequest("/auth/register", "POST", payload, null);
}

// -------- JWT parsing & admin detection --------

function parseJwt(token) {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    try {
        const decoded = atob(payloadBase64);
        const json = decodeURIComponent(
            decoded
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function isAdminToken() {
    const token = getToken();
    const payload = parseJwt(token);
    if (!payload) return false;

    // Common patterns: role: "Admin", Role: "Admin", roles: ["Admin"], etc.
    const roleProp = payload.role || payload.Role;
    if (Array.isArray(roleProp)) {
        return roleProp.includes("Admin");
    }
    if (Array.isArray(payload.roles)) {
        return payload.roles.includes("Admin");
    }
    return roleProp === "Admin";
}
