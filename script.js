/* Tema claro/escuro */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme');
  var saved = null;
  try { saved = localStorage.getItem('autoteste-tema'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);

  btn.addEventListener('click', function () {
    var atual = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var novo = atual === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', novo);
    try { localStorage.setItem('autoteste-tema', novo); } catch (e) {}
  });
})();

/* Abas SAST / DAST (com navegação por setas) */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  function ativar(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { ativar(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') ativar(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') ativar(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
})();

/* Formulário de contato: envia o pedido por e-mail (serviço FormSubmit) */
(function () {
  var EMAIL_DESTINO = 'andreas.schell.x@gmail.com';
  var form = document.getElementById('form');
  if (!form) return;
  var ok = document.getElementById('ok');
  var msg = document.getElementById('ok-msg');
  var erro = document.getElementById('erro');
  var again = document.getElementById('again');
  var botao = document.getElementById('enviar');

  function mostrarErro(texto, campo) {
    erro.textContent = texto;
    erro.hidden = false;
    if (campo) campo.focus();
  }

  function enviar(dados, aoTerminar) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://formsubmit.co/ajax/' + EMAIL_DESTINO, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      var certo = false;
      if (xhr.status >= 200 && xhr.status < 300) {
        try { certo = String(JSON.parse(xhr.responseText).success) === 'true'; } catch (e) { certo = true; }
      }
      aoTerminar(certo);
    };
    xhr.onerror = function () { aoTerminar(false); };
    xhr.send(JSON.stringify(dados));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.elements.nome;
    var email = form.elements.email;
    var tipo = form.elements.tipo.value;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var nomeOk = nome.value.trim().length > 1;

    nome.setAttribute('aria-invalid', !nomeOk);
    email.setAttribute('aria-invalid', !emailOk);

    if (!nomeOk) { mostrarErro('Informe o seu nome.', nome); return; }
    if (!emailOk) { mostrarErro('Informe um e-mail válido, como voce@empresa.com.', email); return; }

    erro.hidden = true;
    botao.disabled = true;
    botao.textContent = 'Enviando...';

    enviar({
      _subject: 'Pedido de demonstração do AutoTeste',
      _template: 'table',
      _honey: form.elements._honey.value,
      nome: nome.value.trim(),
      email: email.value.trim(),
      perfil: tipo === 'empresa' ? 'Empresa' : 'Desenvolvedor'
    }, function (certo) {
      botao.disabled = false;
      botao.textContent = 'Pedir demonstração';
      if (!certo) {
        mostrarErro('Não foi possível enviar agora. Confira a internet e tente de novo.');
        return;
      }
      var primeiro = nome.value.trim().split(' ')[0];
      msg.textContent = 'Obrigado, ' + primeiro + '! Em breve a equipe entra em contato pelo e-mail informado.';
      form.hidden = true;
      ok.hidden = false;
      var t = ok.querySelector('h3');
      t.setAttribute('tabindex', '-1');
      t.focus();
    });
  });

  again.addEventListener('click', function () {
    form.reset();
    ok.hidden = true;
    form.hidden = false;
    form.elements.nome.focus();
  });
})();
