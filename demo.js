/* ===========================================================================
   MODO DEMONSTRACAO — roteiro comercial
   ===========================================================================

   So liga com ?demo=1 na URL. Sem isso este arquivo nao faz nada e o app se
   comporta como sempre. Nenhuma maquete daqui vaza para o produto.

   MAQUETE (ainda nao existe no produto):
     . telas de texto da abertura e do fecho
     . a tela do questionario das 87 perguntas
     . a leitura combinada em destaque
     . a indicacao de qual ferramenta aplicar
     . a comparacao entre duas aplicacoes  <- a que menos existe e mais vende

   PRODUTO DE VERDADE — 5 das 14 cenas, ~40% do tempo:
     . o dashboard e o menu
     . o HOLOSCOPE com o radar (a demo poe as notas, o desenho e do app)
     . a galeria das ferramentas e a busca filtrando
     . Gatilhos & Respostas: abrir, preencher, salvar
     . Roda da Vida: as 8 reguas

   A demo e deterministica: DEMO.irPara(t) desenha o estado exato no segundo t.
   Nada depende de relogio nem de animacao de CSS, entao a captura sai limpa
   a 24 quadros por segundo.

   Entre uma cena e outra passa um veu escuro de 0,4s. Sem ele o corte fica
   seco e o salto de rolagem do app aparece.

   Sem selo de "demonstracao" por decisao do Leandro: o video roda no meio de
   uma apresentacao e a ressalva e feita na fala.
   =========================================================================== */

(function () {
  "use strict";
  if (!/[?&]demo=1/.test(location.search)) return;

  /* ---------------------------------------------------------------- palco */

  var palco = document.createElement("div");
  palco.id = "palco-demo";
  palco.innerHTML = '<div class="palco-painel"></div>' +
                    '<div class="palco-veu"></div>' +
                    '<div class="palco-legenda"><span></span></div>';
  document.body.appendChild(palco);

  var painel = palco.querySelector(".palco-painel");
  var veu = palco.querySelector(".palco-veu");
  var legenda = palco.querySelector(".palco-legenda");
  var legendaTxt = legenda.querySelector("span");

  var estilo = document.createElement("style");
  estilo.textContent = [
    "#palco-demo{position:fixed;inset:0;z-index:9000;pointer-events:none;font-family:var(--fonte-corpo)}",
    ".palco-painel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;",
    "  background:var(--verde-noite,#06231a);opacity:0}",
    ".palco-painel.on{opacity:1}",
    ".palco-veu{position:absolute;inset:0;background:#04160f;opacity:0}",
    ".palco-legenda{position:absolute;left:0;right:0;bottom:0;padding:38px 60px 42px;",
    "  background:linear-gradient(transparent,rgba(6,35,26,.93) 45%);text-align:center}",
    ".palco-legenda span{display:inline-block;color:#f4efe3;font-size:1.62rem;font-weight:300;",
    "  line-height:1.5;max-width:32ch;text-shadow:0 2px 20px rgba(0,0,0,.65)}",

    ".cena{width:min(860px,88vw);color:#ede8da;text-align:center}",
    ".cena .rotulo{font-size:.62rem;letter-spacing:.32em;text-transform:uppercase;",
    "  color:var(--dourado);margin-bottom:26px;display:block}",

    ".t-linha{font-family:var(--fonte-display);font-size:2.6rem;font-weight:300;line-height:1.4;",
    "  color:#f4efe3;margin:0 0 26px;opacity:0}",
    ".t-linha.forte{color:var(--dourado)}",

    ".cena-capa{text-align:center}",
    ".cena-capa h1{font-family:var(--fonte-display);font-size:3.2rem;font-weight:600;",
    "  color:#f4efe3;letter-spacing:.02em;margin:26px 0 12px}",
    ".cena-capa p{font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--dourado)}",
    ".cena-capa p.f-frase{font-family:var(--fonte-display);font-size:2.2rem;font-weight:300;",
    "  line-height:1.42;letter-spacing:normal;text-transform:none;color:var(--dourado);margin:0 0 46px}",

    ".q-barra{height:3px;background:rgba(201,163,90,.18);border-radius:2px;margin-bottom:36px}",
    ".q-barra i{display:block;height:100%;background:var(--dourado);border-radius:2px}",
    ".q-conta{font-size:.76rem;letter-spacing:.2em;color:rgba(237,232,218,.5);margin-bottom:16px}",
    ".q-texto{font-family:var(--fonte-display);font-size:2rem;font-weight:300;line-height:1.4;",
    "  color:#f4efe3;margin-bottom:38px;min-height:2.8em}",
    ".q-ops{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}",
    ".q-op{padding:18px 8px;border:1px solid rgba(201,163,90,.3);border-radius:12px;",
    "  font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(237,232,218,.6)}",
    ".q-op b{display:block;font-family:var(--fonte-display);font-size:1.35rem;margin-bottom:5px;color:#ede8da}",
    ".q-op.on{border-color:var(--dourado);background:rgba(201,163,90,.16);color:var(--dourado)}",
    ".q-op.on b{color:var(--dourado)}",

    ".d-pergunta{font-family:var(--fonte-display);font-size:2.75rem;font-weight:300;",
    "  line-height:1.36;color:#f4efe3;max-width:20ch;margin:0 auto}",

    ".l-frase{font-family:var(--fonte-display);font-size:2.85rem;font-weight:300;line-height:1.3;",
    "  color:#f4efe3;margin-bottom:34px}",
    ".l-itens{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}",
    ".l-item{font-size:.8rem;font-weight:300;color:rgba(237,232,218,.6);",
    "  border:1px solid rgba(201,163,90,.24);border-radius:999px;padding:8px 17px}",

    ".i-de{font-size:1.05rem;font-weight:300;color:rgba(237,232,218,.62);margin-bottom:30px}",
    ".i-de b{color:var(--dourado);font-weight:400}",
    ".i-card{display:inline-block;border:1px solid var(--dourado);border-radius:16px;",
    "  padding:30px 46px;background:rgba(201,163,90,.07)}",
    ".i-eyebrow{font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;",
    "  color:var(--dourado);display:block;margin-bottom:12px}",
    ".i-nome{font-family:var(--fonte-display);font-size:2.1rem;color:#f4efe3;margin-bottom:14px}",
    ".i-porque{font-size:.94rem;font-weight:300;color:rgba(237,232,218,.66);max-width:34ch;margin:0 auto}",

    ".a-dia{text-align:left;border:1px solid rgba(201,163,90,.2);border-radius:16px;overflow:hidden}",
    ".a-topo{display:flex;justify-content:space-between;align-items:baseline;",
    "  padding:20px 28px;border-bottom:1px solid rgba(201,163,90,.16)}",
    ".a-topo b{font-family:var(--fonte-display);font-size:1.3rem;color:#f4efe3;font-weight:400}",
    ".a-topo span{font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--dourado)}",
    ".a-linha{display:flex;align-items:center;gap:22px;padding:17px 28px;opacity:0;",
    "  border-bottom:1px solid rgba(201,163,90,.08)}",
    ".a-linha:last-child{border-bottom:none}",
    ".a-linha.foco{background:rgba(201,163,90,.09)}",
    ".a-nome{flex:1;font-size:1.05rem;font-weight:300;color:#ede8da}",
    ".a-ind{width:5.2ch;text-align:right;font-family:var(--fonte-display);font-size:1.4rem;",
    "  color:var(--dourado);font-variant-numeric:tabular-nums}",
    ".a-nota{width:15ch;font-size:.8rem;font-weight:300;color:rgba(237,232,218,.5)}",
    ".a-sobe{color:#7fb896}",

    ".r-par{display:flex;align-items:center;justify-content:center;gap:56px;margin-bottom:34px}",
    ".r-um{text-align:center}",
    ".r-quando{font-size:.66rem;letter-spacing:.28em;text-transform:uppercase;",
    "  color:rgba(237,232,218,.45);margin-bottom:14px}",
    ".r-indice{font-family:var(--fonte-display);font-size:3.1rem;color:var(--dourado);",
    "  margin-top:10px;font-variant-numeric:tabular-nums}",
    ".r-seta{font-size:2rem;color:rgba(201,163,90,.42)}",

    /* catalogo: as 10 ferramentas de um modulo, duas colunas */
    ".cat{width:min(1180px,92vw)}",
    ".cat-topo{display:flex;align-items:baseline;justify-content:center;gap:16px;margin-bottom:34px}",
    ".cat-topo h3{font-family:var(--fonte-display);font-size:2.4rem;font-weight:400;color:#f4efe3;margin:0}",
    ".cat-topo em{font-style:normal;font-size:.66rem;letter-spacing:.3em;text-transform:uppercase;",
    "  color:var(--dourado)}",
    ".cat-grade{display:grid;grid-template-columns:1fr 1fr;gap:14px 40px;text-align:left}",
    ".cat-item{display:flex;gap:14px;opacity:0}",
    ".cat-num{font-family:var(--fonte-display);font-size:.92rem;color:var(--dourado);",
    "  width:2.2ch;flex-shrink:0;padding-top:3px}",
    ".cat-txt b{display:block;font-size:1.06rem;font-weight:400;color:#ede8da;line-height:1.3}",
    ".cat-txt span{display:block;font-size:.82rem;font-weight:300;color:rgba(237,232,218,.5);",
    "  line-height:1.45;margin-top:2px}"
  ].join("\n");
  document.head.appendChild(estilo);

  /* --------------------------------------------------------------- ajudas */

  function mostrarPainel(l) { painel.classList.toggle("on", !!l); }
  function irSecao(n) {
    var b = document.querySelector('.nav-item[data-secao="' + n + '"]');
    if (b) b.click();
  }
  function suave(p, a, b) {
    if (p <= a) return 0;
    if (p >= b) return 1;
    var x = (p - a) / (b - a);
    return x * x * (3 - 2 * x);
  }
  function pulso(p, a, b, c, d) { return suave(p, a, b) * (1 - suave(p, c, d)); }

  /** Rolagem como funcao de p: sem salto, o olho acompanha. */
  function rolarAte(seletor, p, ini, fim) {
    var el = document.querySelector(seletor);
    if (!el) return;
    var cx = el.getBoundingClientRect();
    var alvo = cx.top + window.scrollY - (window.innerHeight - cx.height) / 2;
    window.scrollTo(0, Math.max(0, alvo) * suave(p, ini, fim));
  }

  function radar(valores, tam) {
    var C = tam / 2, R = tam * .37, i, a, r, pts = [], eixos = "", aneis = "";
    for (i = 0; i < 5; i++) {
      a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      r = R * valores[i] / 10;
      pts.push((C + r * Math.cos(a)).toFixed(1) + "," + (C + r * Math.sin(a)).toFixed(1));
      eixos += '<line x1="' + C + '" y1="' + C + '" x2="' + (C + R * Math.cos(a)).toFixed(1) +
               '" y2="' + (C + R * Math.sin(a)).toFixed(1) +
               '" stroke="rgba(201,163,90,.16)" stroke-width="1"/>';
    }
    [.25, .5, .75, 1].forEach(function (f) {
      var q = [];
      for (var k = 0; k < 5; k++) {
        var g = -Math.PI / 2 + k * 2 * Math.PI / 5;
        q.push((C + R * f * Math.cos(g)).toFixed(1) + "," + (C + R * f * Math.sin(g)).toFixed(1));
      }
      aneis += '<polygon points="' + q.join(" ") + '" fill="none" stroke="rgba(201,163,90,.13)" stroke-width="1"/>';
    });
    return '<svg width="' + tam + '" height="' + tam + '">' + aneis + eixos +
           '<polygon points="' + pts.join(" ") + '" fill="rgba(201,163,90,.22)" ' +
           'stroke="#c9a35a" stroke-width="2"/></svg>';
  }

  function telaTexto(linhas) {
    return '<div class="cena">' + linhas.map(function (l) {
      return '<p class="t-linha' + (l[1] ? " forte" : "") + '">' + l[0] + "</p>";
    }).join("") + "</div>";
  }
  function animarLinhas(p, ini, passo) {
    painel.querySelectorAll(".t-linha").forEach(function (el, i) {
      el.style.opacity = suave(p, ini + i * passo, ini + i * passo + .16);
    });
  }
  function digitar(campo, texto, p, ini, fim) {
    var el = document.getElementById(campo);
    if (el && p > ini) el.value = texto.slice(0, Math.round(texto.length * suave(p, ini, fim)));
  }
  function umaVez(chave, cond, acao) {
    if (cond && palco.dataset[chave] !== "1") { palco.dataset[chave] = "1"; acao(); }
    if (!cond) delete palco.dataset[chave];
  }

  /* As tres ancoras tem tela propria e nao vivem no catalogo; o resto vem de
     CATALOGO_FERRAMENTAS, entao o video nunca desencontra do app. */
  var ANCORA = {
    corpo:    ["OQ³ — O Que Quer · Precisa · Consegue", "a distância entre desejo e realidade"],
    mente:    ["PQQ — Pra Que Que?", "o porquê por trás do objetivo"],
    espirito: ["Mapa do Propósito", "síntese do OQ³ e do PQQ"]
  };
  var TITULO_MOD = { corpo: "Corpo", mente: "Mente", espirito: "Espírito" };

  function listaDoModulo(mod) {
    var itens = [["01", ANCORA[mod][0], ANCORA[mod][1]]];
    (window.CATALOGO_FERRAMENTAS || []).forEach(function (f) {
      if (f.modulo === mod) itens.push([f.numero, f.titulo, f.chamada]);
    });
    return itens.sort(function (a, b) { return a[0].localeCompare(b[0]); });
  }

  function cenaCatalogo(mod) {
    return {
      dur: 13,
      legenda: "",
      entrar: function () {
        mostrarPainel(true);
        var itens = listaDoModulo(mod);
        painel.innerHTML =
          '<div class="cat"><div class="cat-topo"><h3>' + TITULO_MOD[mod] + "</h3>" +
          "<em>" + itens.length + " ferramentas</em></div>" +
          '<div class="cat-grade">' + itens.map(function (i) {
            return '<div class="cat-item"><span class="cat-num">' + i[0] + "</span>" +
                   '<span class="cat-txt"><b>' + i[1] + "</b><span>" + i[2] + "</span></span></div>";
          }).join("") + "</div></div>";
      },
      quadro: function (p) {
        painel.querySelectorAll(".cat-item").forEach(function (el, i) {
          el.style.opacity = suave(p, .04 + i * .04, .20 + i * .04);
        });
      }
    };
  }

  var ESCALA = ["Nunca", "Às vezes", "Frequente", "Sempre"];
  var PERGUNTAS = [
    "Você sente vontade forte de doce ou pão quase todo dia?",
    "Você acorda com o corpo travado que leva um tempo para soltar?",
    "Você come depois do jantar mesmo sem fome real?",
    "Uma taça já te dá ressaca no dia seguinte?",
    "Você costuma aceitar o que não quer para evitar conflito?",
    "Existe alguma mágoa que você carrega há anos?"
  ];
  var RESPOSTAS = [3, 2, 3, 2, 3, 3];
  var DESTAQUE = [
    "Você come depois do jantar mesmo sem fome real?",
    "Você costuma aceitar o que não quer para evitar conflito?",
    "Existe alguma mágoa que você carrega há anos?"
  ];
  var NOTAS = [["fungico", 3], ["inflamatorio", 4], ["metabolico", 4], ["detox", 5], ["mental", 5]];
  var RODA = [["saude", 4], ["relacoes", 6], ["trabalho", 8], ["financas", 5],
              ["espiritualidade", 3], ["lazer", 3], ["desenvolvimento", 6], ["proposito", 4]];

  /* ---------------------------------------------------------------- cenas */

  var CENAS = [

    /* 1 */ { dur: 10, legenda: "",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML = telaTexto([
          ["Marina já fez cinco dietas.", 0],
          ["Todas funcionaram por três semanas.", 0],
          ["Ela acha que o problema é ela.", 1]
        ]);
      },
      quadro: function (p) { animarLinhas(p, .05, .26); } },

    /* 2 */ { dur: 8, legenda: "",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML = telaTexto([
          ["Quarenta minutos de anamnese.", 0],
          ["E a nutricionista ainda não sabe<br>quem está na frente dela.", 1]
        ]);
      },
      quadro: function (p) { animarLinhas(p, .08, .32); } },

    /* 3 — o app de verdade abre */
    { dur: 8, legenda: "A plataforma clínica da Nutrição Holística.",
      entrar: function () { mostrarPainel(false); irSecao("dashboard"); window.scrollTo(0, 0); } },

    /* 4 */ { dur: 12, legenda: "Quinze minutos. Oitenta e sete perguntas que ninguém faz.",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML =
          '<div class="cena"><span class="rotulo">HOLOSCOPE · Marina Alves</span>' +
          '<div class="q-barra"><i></i></div><div class="q-conta"></div>' +
          '<div class="q-texto"></div><div class="q-ops">' +
          ESCALA.map(function (e, i) { return '<div class="q-op"><b>' + i + "</b>" + e + "</div>"; })
            .join("") + "</div></div>";
      },
      quadro: function (p) {
        var n = PERGUNTAS.length, i = Math.min(n - 1, Math.floor(p * n)), loc = p * n - i;
        painel.querySelector(".q-barra i").style.width = (6 + p * 86).toFixed(1) + "%";
        painel.querySelector(".q-conta").textContent = "Pergunta " + (Math.round(p * 78) + 6) + " de 87";
        painel.querySelector(".q-texto").textContent = PERGUNTAS[i];
        painel.querySelectorAll(".q-op").forEach(function (o, k) {
          o.classList.toggle("on", loc > .5 && k === RESPOSTAS[i]);
        });
      } },

    /* 5 */ { dur: 9, legenda: "O corpo responde. A emoção responde. O propósito responde.",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML = '<div class="cena"><div class="d-pergunta"></div></div>';
      },
      quadro: function (p) {
        var i = Math.min(2, Math.floor(p * 3)), loc = p * 3 - i;
        var el = painel.querySelector(".d-pergunta");
        el.textContent = DESTAQUE[i];
        el.style.opacity = pulso(loc, 0, .22, .8, 1);
      } },

    /* 6 — o radar, app de verdade */
    { dur: 13, legenda: "O sistema cruza tudo e devolve o mapa.",
      entrar: function () {
        mostrarPainel(false);
        irSecao("holoscope");
        window.scrollTo(0, 0);
        var sel = document.getElementById("sel-holoscope");
        if (sel) sel.innerHTML = "<option>Marina Alves</option>";
        var av = document.querySelector("#secao-holoscope .aviso");
        if (av) av.textContent = "Primeira aplicação · 28 de agosto";
      },
      quadro: function (p) {
        var v = suave(p, .04, .42);
        NOTAS.forEach(function (s) {
          var el = document.getElementById("holo-" + s[0]);
          if (!el) return;
          el.value = String(Math.round(s[1] * v));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        });
        rolarAte("#radar-svg", p, .3, .72);
      } },

    /* 7 */ { dur: 9, legenda: "Você não tem falta de disciplina. Você tem falta de diagnóstico.",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML =
          '<div class="cena">' +
          '<div class="l-frase">“Paciente vivendo em<br>estado crônico de ameaça.”</div>' +
          '<div class="l-itens">' +
          ["compulsão noturna", "corpo travado ao acordar", "mágoa antiga",
           "conflito evitado", "Índice HOLOS 42"]
            .map(function (i) { return '<span class="l-item">' + i + "</span>"; }).join("") +
          "</div></div>";
      },
      quadro: function (p) {
        painel.querySelector(".l-frase").style.opacity = suave(p, 0, .2);
        painel.querySelectorAll(".l-item").forEach(function (el, i) {
          el.style.opacity = suave(p, .3 + i * .08, .5 + i * .08);
        });
      } },

    /* 8 */ { dur: 6, legenda: "O mapa não para no diagnóstico. Ele diz por onde começar.",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML =
          '<div class="cena">' +
          '<p class="i-de">Sistema mais baixo: <b>Fúngico · nota 3,0</b></p>' +
          '<div class="i-card"><span class="i-eyebrow">Ferramenta indicada</span>' +
          '<div class="i-nome">Gatilhos &amp; Respostas</div>' +
          '<p class="i-porque">Compulsão por doce responde a gatilho, ' +
          'não a força de vontade.</p></div></div>';
      },
      quadro: function (p) {
        painel.querySelector(".i-de").style.opacity = suave(p, .06, .28);
        painel.querySelector(".i-card").style.opacity = suave(p, .22, .5);
      } },

    /* 9 — a galeria e a busca, app de verdade */
    { dur: 11, legenda: "Trinta ferramentas em corpo, mente e espírito.",
      entrar: function () { mostrarPainel(false); irSecao("corpo"); window.scrollTo(0, 0); },
      quadro: function (p) {
        var busca = document.querySelector("#secao-corpo .barra-busca input");
        if (!busca) return;
        var termo = "sono";
        if (p > .46) {
          busca.value = termo.slice(0, Math.round(termo.length * suave(p, .46, .68)));
          busca.dispatchEvent(new Event("input", { bubbles: true }));
          legendaTxt.textContent = "Ela acha a que precisa em segundos.";
        } else if (busca.value) {
          busca.value = "";
          busca.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } },

    /* 10, 11, 12 — o catalogo completo dos tres modulos */
    cenaCatalogo("corpo"),
    cenaCatalogo("mente"),
    cenaCatalogo("espirito"),

    /* 13 — exemplo com escala de 0 a 3, app de verdade */
    { dur: 10, legenda: "O paciente marca. Nunca, às vezes, frequente, sempre.",
      entrar: function () {
        mostrarPainel(false); irSecao("corpo"); window.scrollTo(0, 0);
        delete palco.dataset.abriuDiario;
      },
      quadro: function (p) {
        umaVez("abriuDiario", p > .08, function () {
          var c = document.querySelector('[data-ferramenta="diario_corporal"]');
          if (c) c.click();
        });
        // marca uma resposta por campo, uma depois da outra
        [["fome_acordar", 3], ["saciedade", 1], ["desconforto", 2]].forEach(function (r, i) {
          if (p < .26 + i * .18) return;
          var g = document.querySelector('#vista-gen-corpo [data-campo="' + r[0] + '"]');
          if (!g) return;
          g.querySelectorAll("button").forEach(function (b, k) {
            b.classList.toggle("marcado", k === r[1]);
          });
        });
        digitar("campo-sensacoes", "Barriga estufada depois do almoço", p, .62, .92);
      } },

    /* 14 — preencher uma ferramenta, app de verdade */
    { dur: 11, legenda: "Preenchida na consulta, guardada na ficha.",
      entrar: function () {
        mostrarPainel(false); irSecao("mente"); window.scrollTo(0, 0);
        delete palco.dataset.abriu; delete palco.dataset.salvou;
      },
      quadro: function (p) {
        umaVez("abriu", p > .1, function () {
          var c = document.querySelector('[data-ferramenta="gatilhos_respostas"]');
          if (c) c.click();
        });
        digitar("campo-gatilho1", "Briga em casa no fim do dia", p, .2, .5);
        digitar("campo-resposta1", "Come doce até passar", p, .46, .72);
        digitar("campo-escolha1", "Sair para caminhar 10 minutos", p, .66, .9);
        umaVez("salvou", p > .93, function () {
          var s = document.querySelector('#vista-gen-mente [data-acao="salvar"]');
          if (s) s.click();
        });
      } },

    /* 11 — a Roda da Vida, app de verdade */
    { dur: 9, legenda: "Cada ferramenta tem a sua forma. Nada é formulário genérico.",
      entrar: function () {
        mostrarPainel(false); irSecao("espirito"); window.scrollTo(0, 0);
        delete palco.dataset.abriuRoda;
      },
      quadro: function (p) {
        umaVez("abriuRoda", p > .08, function () {
          var c = document.querySelector('[data-ferramenta="roda_vida"]');
          if (c) c.click();
        });
        RODA.forEach(function (r, i) {
          var el = document.getElementById("campo-" + r[0]);
          if (!el) return;
          var v = suave(p, .2 + i * .045, .52 + i * .045);
          el.value = String(Math.round(5 + (r[1] - 5) * v));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        });
      } },

    /* 12 */ { dur: 11, legenda: "No dia a dia: quem evoluiu, quem parou, quem precisa voltar.",
      entrar: function () {
        mostrarPainel(true);
        var linhas = [
          ["Marina Alves", "42", "1ª aplicação", "", 1],
          ["Carla Ribeiro", "58", "consulta às 14h", "", 0],
          ["Juliana Prado", "71", "+13 em 8 semanas", "a-sobe", 0],
          ["Renata Alves", "—", "questionário pendente", "", 0]
        ];
        painel.innerHTML =
          '<div class="cena"><div class="a-dia">' +
          '<div class="a-topo"><b>Seus pacientes</b><span>quinta, 5 de setembro</span></div>' +
          linhas.map(function (l) {
            return '<div class="a-linha' + (l[4] ? " foco" : "") + '">' +
                   '<span class="a-nome">' + l[0] + "</span>" +
                   '<span class="a-ind">' + l[1] + "</span>" +
                   '<span class="a-nota ' + l[3] + '">' + l[2] + "</span></div>";
          }).join("") + "</div></div>";
      },
      quadro: function (p) {
        painel.querySelectorAll(".a-linha").forEach(function (el, i) {
          el.style.opacity = suave(p, .1 + i * .11, .28 + i * .11);
        });
      } },

    /* 13 */ { dur: 13, legenda: "Doze semanas depois. E dá para mostrar isso para ela.",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML =
          '<div class="cena"><span class="rotulo">Evolução do Índice HOLOS</span>' +
          '<div class="r-par">' +
          '<div class="r-um"><div class="r-quando">28 de agosto</div>' + radar([3,4,4,5,5], 250) +
          '<div class="r-indice">42</div></div>' +
          '<div class="r-seta">→</div>' +
          '<div class="r-um" id="r-depois"><div class="r-quando">20 de novembro</div>' +
          radar([6,7,7,7,7], 250) + '<div class="r-indice">68</div></div>' +
          "</div></div>";
      },
      quadro: function (p) {
        painel.querySelector(".r-par").style.opacity = suave(p, .03, .18);
        var d = painel.querySelector("#r-depois");
        if (d) d.style.opacity = suave(p, .3, .55);
        var n = painel.querySelector("#r-depois .r-indice");
        if (n) n.textContent = String(Math.round(42 + 26 * suave(p, .4, .76)));
      } },

    /* 14 */ { dur: 7, legenda: "",
      entrar: function () {
        mostrarPainel(true);
        painel.innerHTML =
          '<div class="cena-capa">' +
          '<p class="f-frase">Quando você enxerga o que está por trás,<br>tudo muda.</p>' +
          '<svg width="96" height="90" viewBox="0 0 64 60" style="color:var(--dourado)">' +
          '<use href="#logo-simbolo"/></svg>' +
          "<h1>HoloHacking</h1><p>Plataforma clínica da Nutrição Holística</p></div>";
      },
      quadro: function (p) { painel.firstChild.style.opacity = suave(p, 0, .3); } }
  ];

  /* ------------------------------------------------------------ transporte */

  var LIMITES = [], acc = 0;
  CENAS.forEach(function (c) { LIMITES.push(acc); acc += c.dur; });
  var DURACAO = acc, MEIO_VEU = .2, atual = -1;

  function irPara(t) {
    t = Math.max(0, Math.min(DURACAO - .001, t));
    var i = 0;
    while (i < CENAS.length - 1 && LIMITES[i + 1] <= t) i++;
    var cena = CENAS[i], p = (t - LIMITES[i]) / cena.dur;

    if (i !== atual) {
      atual = i;
      cena.entrar();
      legendaTxt.textContent = cena.legenda;
      legenda.style.opacity = cena.legenda ? 1 : 0;
    }
    if (cena.quadro) cena.quadro(p);

    // veu do corte: escurece 0,2s antes e clareia 0,2s depois de cada emenda
    var d = Infinity;
    for (var k = 1; k < LIMITES.length; k++) d = Math.min(d, Math.abs(t - LIMITES[k]));
    veu.style.opacity = d < MEIO_VEU ? (1 - d / MEIO_VEU).toFixed(3) : 0;
  }

  window.DEMO = { duracao: DURACAO, irPara: irPara, cenas: CENAS.length, limites: LIMITES };

  if (!/[?&]passo=1/.test(location.search)) {
    var t0 = Date.now();
    (function laco() {
      irPara(((Date.now() - t0) / 1000) % DURACAO);
      requestAnimationFrame(laco);
    })();
  } else {
    irPara(0);
  }
})();
