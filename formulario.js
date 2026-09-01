/* ===========================================================================
   RENDERIZADOR DE FERRAMENTAS
   ===========================================================================

   Le uma ferramenta do CATALOGO_FERRAMENTAS e monta a tela dela.
   Uma tela so serve as 27 — nao existe HTML escrito a mao por ferramenta.

   ONDE AS RESPOSTAS FICAM
   Hoje: no proprio navegador (localStorage).
   Depois: no Supabase, tabela ferramentas_respostas. Sao as duas funcoes
   marcadas com [SUPABASE] la embaixo — nada mais no arquivo precisa mudar.
   =========================================================================== */

(function () {
  "use strict";

  var CHAVE = "holohacking.ferramentas";
  var ESCALA = ["Nunca", "As vezes", "Frequente", "Sempre"];
  var MODULOS = { corpo: "Corpo", mente: "Mente", espirito: "Espirito" };

  function catalogo(id) {
    var lista = window.CATALOGO_FERRAMENTAS || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) return lista[i];
    }
    return null;
  }

  /* ---------- [SUPABASE] guardar e buscar ------------------------------- */

  function tudo() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch (e) {
      return {};
    }
  }

  function lerRespostas(ferramentaId) {
    return tudo()[ferramentaId] || {};
  }

  function gravarRespostas(ferramentaId, dados) {
    var t = tudo();
    t[ferramentaId] = dados;
    localStorage.setItem(CHAVE, JSON.stringify(t));
  }

  /* ---------- desenhar um campo ----------------------------------------- */

  function escapar(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function campoHTML(campo, valor) {
    var nome = "campo-" + campo.id;
    var dica = campo.dica ? '<span class="dica">' + escapar(campo.dica) + "</span>" : "";
    var ctrl = "";
    var i;

    if (campo.tipo === "textarea") {
      ctrl = '<textarea id="' + nome + '" rows="' + (campo.grande ? 12 : 4) + '">' + escapar(valor) + "</textarea>";

    } else if (campo.tipo === "escala") {
      ctrl = '<div class="grupo-escala" data-campo="' + campo.id + '">';
      for (i = 0; i < ESCALA.length; i++) {
        ctrl += '<button type="button" class="btn-escala' + (String(valor) === String(i) ? " marcado" : "") +
                '" data-valor="' + i + '"><b>' + i + "</b>" + ESCALA[i] + "</button>";
      }
      ctrl += "</div>";

    } else if (campo.tipo === "nota") {
      var n = (valor === "" || valor == null) ? 5 : valor;
      ctrl = '<div class="grupo-nota">' +
             '<input type="range" id="' + nome + '" min="0" max="10" step="1" value="' + escapar(n) + '">' +
             '<output data-para="' + nome + '">' + escapar(n) + "</output></div>";

    } else if (campo.tipo === "opcoes") {
      ctrl = '<div class="grupo-opcoes" data-campo="' + campo.id + '">';
      for (i = 0; i < campo.opcoes.length; i++) {
        ctrl += '<button type="button" class="btn-opcao' + (valor === campo.opcoes[i] ? " marcado" : "") +
                '" data-valor="' + escapar(campo.opcoes[i]) + '">' + escapar(campo.opcoes[i]) + "</button>";
      }
      ctrl += "</div>";

    } else if (campo.tipo === "data") {
      ctrl = '<input type="date" id="' + nome + '" value="' + escapar(valor) + '">';

    } else if (campo.tipo === "numero") {
      ctrl = '<input type="number" id="' + nome + '" value="' + escapar(valor) + '">';

    } else {
      ctrl = '<input type="text" id="' + nome + '" value="' + escapar(valor) + '">';
    }

    return '<div class="grupo tipo-' + campo.tipo + '">' +
           '<label for="' + nome + '">' + escapar(campo.rotulo) + "</label>" +
           dica + ctrl + "</div>";
  }

  /* ---------- desenhar a ferramenta inteira ------------------------------ */

  function desenhar(ferramenta, alvo) {
    var r = lerRespostas(ferramenta.id);
    var campos = "";
    for (var i = 0; i < ferramenta.campos.length; i++) {
      var c = ferramenta.campos[i];
      campos += campoHTML(c, r[c.id] || "");
    }

    alvo.innerHTML =
      '<button class="btn-voltar" type="button">&larr; Voltar as ferramentas</button>' +
      '<div class="secao-cabeca">' +
        '<span class="eyebrow">' + MODULOS[ferramenta.modulo] + " - Ferramenta " + ferramenta.numero + "</span>" +
        "<h2>" + escapar(ferramenta.titulo) + " &mdash; <em>" + escapar(ferramenta.chamada) + "</em></h2>" +
        "<p>" + escapar(ferramenta.descricao) + "</p>" +
      "</div>" +
      '<div class="form-ferramenta">' +
        '<p class="form-sub">Preencha durante ou logo apos o atendimento.</p>' +
        '<div class="campos">' + campos + "</div>" +
        '<div class="acoes-form">' +
          '<button class="btn-verde" type="button" data-acao="salvar">Salvar</button>' +
          '<span class="aviso-salvo" data-papel="aviso"></span>' +
        "</div>" +
      "</div>";

    ligar(ferramenta, alvo);
  }

  /* ---------- comportamento --------------------------------------------- */

  function ligar(ferramenta, alvo) {
    // escala e opcoes: um botao marcado por grupo
    var grupos = alvo.querySelectorAll(".grupo-escala, .grupo-opcoes");
    for (var g = 0; g < grupos.length; g++) {
      grupos[g].addEventListener("click", function (ev) {
        var b = ev.target.closest("button");
        if (!b) return;
        var irmaos = this.querySelectorAll("button");
        for (var k = 0; k < irmaos.length; k++) irmaos[k].classList.remove("marcado");
        b.classList.add("marcado");
      });
    }

    // regua: o numero ao lado acompanha
    var reguas = alvo.querySelectorAll('input[type="range"]');
    for (var s = 0; s < reguas.length; s++) {
      reguas[s].addEventListener("input", function () {
        var saida = alvo.querySelector('output[data-para="' + this.id + '"]');
        if (saida) saida.textContent = this.value;
      });
    }

    alvo.querySelector(".btn-voltar").addEventListener("click", function () {
      var vistas = document.querySelectorAll(".vista-ferramenta");
      for (var v = 0; v < vistas.length; v++) vistas[v].classList.add("hidden");
      var secao = alvo.closest(".secao");
      var gal = secao.querySelector(".galeria-ferramentas");
      if (gal) gal.classList.remove("hidden");
      var cab = secao.querySelector(".cabeca-modulo");
      if (cab) cab.classList.remove("hidden");
      var bus = secao.querySelector(".barra-busca");
      if (bus) bus.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    alvo.querySelector('[data-acao="salvar"]').addEventListener("click", function () {
      gravarRespostas(ferramenta.id, colher(ferramenta, alvo));
      var aviso = alvo.querySelector('[data-papel="aviso"]');
      aviso.textContent = "Salvo.";
      marcarCard(ferramenta.id);
      setTimeout(function () { aviso.textContent = ""; }, 2600);
    });
  }

  function colher(ferramenta, alvo) {
    var dados = {};
    for (var i = 0; i < ferramenta.campos.length; i++) {
      var c = ferramenta.campos[i];
      var v = "";
      if (c.tipo === "escala" || c.tipo === "opcoes") {
        var m = alvo.querySelector('[data-campo="' + c.id + '"] .marcado');
        v = m ? m.dataset.valor : "";
      } else {
        var el = alvo.querySelector("#campo-" + c.id);
        v = el ? el.value : "";
      }
      dados[c.id] = v;
    }
    return dados;
  }

  /* ---------- selo de preenchida na galeria ------------------------------ */

  function preenchida(id) {
    var r = lerRespostas(id);
    for (var k in r) {
      if (r[k] !== "" && r[k] != null) return true;
    }
    return false;
  }

  function marcarCard(id) {
    var card = document.querySelector('[data-ferramenta="' + id + '"]');
    if (!card) return;
    var selo = card.querySelector(".ferr-status");
    if (!selo) return;
    if (preenchida(id)) {
      selo.textContent = "Preenchida";
      selo.className = "ferr-status preenchida";
    } else {
      selo.textContent = "Disponivel";
      selo.className = "ferr-status disponivel";
    }
  }

  /* ---------- abrir ------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    var cards = document.querySelectorAll("[data-ferramenta]");
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        marcarCard(card.dataset.ferramenta);
        card.addEventListener("click", function () {
          var f = catalogo(card.dataset.ferramenta);
          if (!f) return;
          var alvo = document.getElementById("vista-gen-" + f.modulo);
          if (!alvo) return;
          desenhar(f, alvo);
          window.abrirFerramenta("vista-gen-" + f.modulo);
        });
      })(cards[i]);
    }
  });
})();
