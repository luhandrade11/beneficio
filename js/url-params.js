// Utility para gerenciar parâmetros de URL entre páginas

function saveUrlParams() {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    if (Object.keys(params).length > 0) {
        localStorage.setItem("urlParams", JSON.stringify(params));
    }
}

function getUrlParams() {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem("urlParams");
    return stored ? JSON.parse(stored) : {};
}

function getUrlParamsString() {
    const params = getUrlParams();
    const entries = Object.entries(params);

    if (entries.length === 0) return "";

    const queryString = entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");

    return `?${queryString}`;
}

function clearUrlParams() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("urlParams");
}

// Salvar parâmetros ao carregar a página
if (typeof window !== "undefined") {
    window.addEventListener("load", saveUrlParams);
}

