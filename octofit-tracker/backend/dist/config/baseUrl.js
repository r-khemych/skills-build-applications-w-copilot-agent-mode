"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = getApiBaseUrl;
const CODESPACES_DOMAIN = 'app.github.dev';
const API_PORT = 8000;
function getApiBaseUrl() {
    const codespaceName = process.env.CODESPACE_NAME;
    if (codespaceName) {
        return `https://${codespaceName}-${API_PORT}.${CODESPACES_DOMAIN}`;
    }
    return `http://localhost:${API_PORT}`;
}
