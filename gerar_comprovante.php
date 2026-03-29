<?php
/**
 * gerar_comprovante.php
 *
 * Usa a imagem template e escreve o nome, data de emissão e vencimento dinamicamente.
 */

// Define o fuso horário para garantir que a data atual esteja correta
date_default_timezone_get('America/Sao_Paulo');

// ── DADOS DINÂMICOS ────────────────────────────────────────

// 1. NOME DA PESSOA (vindo do Typebot via variável {{nome}})
$nome = isset($_GET['nome']) ? urldecode($_GET['nome']) : '';
$nome = strip_tags(trim($nome));
$nome = mb_strtoupper($nome, 'UTF-8'); // Converte para maiúsculas

// 2. DATAS (Geradas automaticamente)
// Data de Emissão: Hoje
$data_emissao = date('d/m/Y');

// Data de Vencimento: Exemplo de 30 dias após a emissão.
// Você pode alterar '+30 days' para '+1 year', 'first day of next month', etc.
$data_vencimento = date('d/m/Y', strtotime('+30 days'));
// Caso queira fixar uma data exata (ex: 20/03/2026), descomente a linha abaixo e comente a de cima:
// $data_vencimento = '20/03/2026';


// ── CARREGAR IMAGEM TEMPLATE ───────────────────────────────
$template = __DIR__ . '/comprovante_template.png';

if (!file_exists($template)) {
    header('HTTP/1.1 500 Internal Server Error');
    die('Arquivo comprovante_template.png nao encontrado.');
}

$img = imagecreatefrompng($template);
if (!$img) {
    header('HTTP/1.1 500 Internal Server Error');
    die('Erro ao carregar imagem template.');
}

// ── CONFIGURAÇÃO DE TEXTO ──────────────────────────────────

// Cor do texto principal (um cinza bem escuro, quase preto)
$cor_texto = imagecolorallocate($img, 40, 40, 40);

// Cor para os campos dentro das caixas verdes (Branco)
$cor_branca = imagecolorallocate($img, 255, 255, 255);

// Fontes em ordem de preferência
$fontes = [
    __DIR__ . '/Poppins-Bold.ttf',
    __DIR__ . '/Rawline-SemiBold.ttf',
    __DIR__ . '/Raleway-SemiBold.ttf'
];

$fonte = null;
foreach ($fontes as $f) {
    if (file_exists($f)) {
        $fonte = $f;
        break;
    }
}

// =========================================================
// 🛠️ AJUSTE FINO DE POSIÇÃO E TAMANHO AQUI
// =========================================================

// Configurações para o NOME
$font_size_nome = 38;  // Tamanho da letra
$x_nome         = 90;  // Distância da esquerda
$y_nome         = 480; // Distância do topo (baseline)

// Configurações para a DATA DE EMISSÃO (Preto/Cinza)
$font_size_data = 28;  // Tamanho da letra das datas
$x_emissao      = 250; // Ajuste para centralizar na caixinha de emissão
$y_emissao      = 635; // Alinhamento vertical na caixinha

// Configurações para a DATA DE VENCIMENTO (Branco, dentro do verde)
$font_size_venc = 28;  // Tamanho da letra
$x_vencimento   = 780; // Ajuste para centralizar na caixinha verde
$y_vencimento   = 635; // Alinhamento vertical na caixinha verde (geralmente igual à emissão)


// ── ESCREVER NO TEMPLATE ──────────────────────────────────

if ($fonte) {
    // 1. Escreve o NOME (se não estiver vazio)
    if (!empty($nome)) {
        imagettftext($img, $font_size_nome, 0, $x_nome, $y_nome, $cor_texto, $fonte, $nome);
    }

    // 2. Escreve a DATA DE EMISSÃO
    imagettftext($img, $font_size_data, 0, $x_emissao, $y_emissao, $cor_texto, $fonte, $data_emissao);

    // 3. Escreve a DATA DE VENCIMENTO (em Branco)
    imagettftext($img, $font_size_venc, 0, $x_vencimento, $y_vencimento, $cor_branca, $fonte, $data_vencimento);

} else {
    // Fallback simplificado caso não ache a fonte na pasta (não suporta cores diferentes facilmente)
    header('HTTP/1.1 500 Internal Server Error');
    die('Erro: Fontes TTF necessarias nao encontradas na pasta.');
}


// ── RETORNAR IMAGEM PNG ────────────────────────────────────
header('Content-Type: image/png');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
imagepng($img, null, 6); // Qualidade de compressão 6 (equilíbrio)
imagedestroy($img);
?>