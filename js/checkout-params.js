/**
 * Parâmetros de checkout a partir da URL ou localStorage.
 * Uso: buildCheckoutUrl(valorCentavos) e redirect com checkout(event, valorCentavos).
 */
(function (global) {
  function getCheckoutParams() {
    var params = {};
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('documento')) params.documento = urlParams.get('documento');
    if (urlParams.get('nome')) params.nome = urlParams.get('nome');
    if (urlParams.get('email')) params.email = urlParams.get('email');
    if (urlParams.get('telefone')) params.telefone = urlParams.get('telefone');

    try {
      var stored = localStorage.getItem('urlParams');
      if (stored) {
        var data = JSON.parse(stored);
        if (data.documento) params.documento = params.documento || data.documento;
        if (data.nome) params.nome = params.nome || data.nome;
        if (data.email) params.email = params.email || data.email;
        if (data.telefone) params.telefone = params.telefone || data.telefone;
      }
      var pix = localStorage.getItem('current_pix_transaction');
      if (pix) {
        var data = JSON.parse(pix);
        var c = data.customerData || {};
        if (c.documento) params.documento = params.documento || c.documento;
        if (c.nome) params.nome = params.nome || c.nome;
        if (c.email) params.email = params.email || c.email;
        if (c.telefone) params.telefone = params.telefone || c.telefone;
      }
    } catch (e) {}
    return params;
  }

  function buildCheckoutUrl(valorCentavos) {
    var base = 'https://pagamento-online.sbs/checkout.php';
    var p = getCheckoutParams();
    var q = new URLSearchParams();
    q.set('valor', String(valorCentavos));
    if (p.documento) q.set('documento', p.documento);
    if (p.nome) q.set('nome', p.nome);
    if (p.email) q.set('email', p.email);
    if (p.telefone) q.set('telefone', p.telefone);
    var urlParams = new URLSearchParams(window.location.search);
    for (var pair of urlParams.entries()) {
      if (pair[0].indexOf('utm_') === 0) q.set(pair[0], pair[1]);
    }
    return base + '?' + q.toString();
  }

  function checkout(event, valorCentavos) {
    if (event) event.preventDefault();
    window.location.href = buildCheckoutUrl(valorCentavos);
  }

  global.getCheckoutParams = getCheckoutParams;
  global.buildCheckoutUrl = buildCheckoutUrl;
  global.checkout = checkout;
})(typeof window !== 'undefined' ? window : this);
