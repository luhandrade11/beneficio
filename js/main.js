// Função principal para navegação
function handleContinue() {
    const params = getUrlParamsString();
    window.location.href = `inicio.html${params}`;
}

// Validação de CPF
function validateCPF(cpf) {
    const numbers = cpf.replace(/\D/g, "");

    if (numbers.length !== 11) return false;

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;

    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;

    return true;
}

// Formatação de CPF
function formatCPF(value) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
}

// Formatação de telefone/WhatsApp
function formatWhatsApp(value) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

// Protected Route - verifica se há dados do usuário
function checkProtectedRoute() {
    const userData = localStorage.getItem("userData");
    if (!userData) {
        window.location.href = "consulta.html";
        return false;
    }
    return true;
}

// Formatação de data
function formatDate(dateString) {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
}

// Formatação de CPF para exibição
function formatCPFDisplay(cpf) {
    if (!cpf) return "Não informado";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formatação de telefone para exibição
function formatPhoneDisplay(phone) {
    if (!phone) return "Não informado";
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

