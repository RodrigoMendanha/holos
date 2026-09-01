# Plano da semana — 27 a 30 de agosto

> Quinta a domingo. Quatro dias.
> **A entrega:** o HOLOSCOPE deixa de ser cinco notas digitadas à mão e passa a
> ser calculado a partir do questionário, dentro do HoloHacking.

---

## O que muda

**Hoje**, a tela do HOLOSCOPE tem cinco réguas de 0 a 10 — uma por sistema. A
nutricionista arrasta cada uma no olho, o app soma e multiplica por 2, e sai o
Índice. O gráfico radar já está desenhado e funciona.

**Domingo**, o paciente responde o questionário e o cálculo sai pronto: as cinco
notas, o Índice, a Triada, as leituras combinadas e o detalhamento de onde veio
cada ponto. **A tela quase não muda** — as réguas viram resultado em vez de
entrada, e o radar continua o mesmo.

Isso é o coração do produto. Sem isso, o HOLOSCOPE é um formulário bonito.

---

## Quinta — o motor roda no navegador

**Objetivo:** tirar o motor da linha de comando e fazer ele rodar dentro do app,
sem backend e sem instalar nada.

O motor é TypeScript sem nenhuma dependência, então isso é possível: ele compila
para um arquivo JS único que o `index.html` carrega como qualquer outro script.
Os bancos em CSV viram JSON embutido no próprio arquivo.

| Tarefa | Quem |
| --- | --- |
| Compilar `src/` para um `holoscope.js` único | eu |
| Converter os 6 bancos CSV em JSON dentro do bundle | eu |
| Criar uma branch no repositório para não mexer na principal | eu |
| Página de teste que carrega o bundle e pontua o caso de exemplo | eu |

**Pronto quando:** abrir uma página em branco no navegador, chamar a função de
pontuação com as respostas do caso de exemplo e ver Índice 42, com CMB-001
disparando — o mesmo resultado que sai hoje no terminal.

---

## Sexta — a tela do questionário

**Objetivo:** a nutricionista consegue aplicar as 87 perguntas na consulta.

As perguntas vêm dos bancos, não do HTML — assim, quando o Rodrigo corrigir uma
pergunta, ela muda no app sem ninguém tocar em código.

| Função | O que faz |
| --- | --- |
| **Questionário HOLOSCOPE** | Mostra as 87 perguntas agrupadas em três blocos: BioRoot (corpo), NeuroScan (mente), SoulIndex (espírito) |
| **Escala de resposta** | 0 nunca · 1 às vezes · 2 frequente · 3 sempre. Quatro botões, não um campo de texto |
| **Salvamento parcial** | Se fechar no meio, volta de onde parou. Consulta de 15 minutos não pode perder tudo por um clique errado |
| **Barra de progresso** | Quantas faltam. A nutricionista precisa saber se cabe no tempo da consulta |

**Pronto quando:** dá para responder as 87 perguntas na tela e ver as respostas
guardadas, mesmo fechando e reabrindo.

---

## Sábado — ligar o cálculo e guardar

**Objetivo:** responder o questionário passa a desenhar o mapa sozinho.

| Função | O que faz |
| --- | --- |
| **Cálculo automático** | Respostas → 5 notas, Índice HOLOS, Triada, combinações |
| **Réguas viram resultado** | Os cinco controles deixam de ser arrastáveis e passam a mostrar o que o motor calculou |
| **Radar alimentado** | O gráfico que já existe passa a receber os valores calculados |
| **Guardar as respostas** | Nova tabela no Supabase — hoje só o resultado é salvo, e sem as respostas não dá para reavaliar nem auditar |

Esse último item é o mais importante do dia e o menos visível. **Sem guardar as
respostas, a reavaliação de 4 semanas não tem com o que comparar** — e a promessa
de acompanhamento cai por terra.

**Pronto quando:** escolher um paciente, aplicar o questionário e ver o radar
desenhar sozinho, com o resultado salvo e recarregável.

---

## Domingo — a leitura

**Objetivo:** a nutricionista entende o mapa, não só vê o número.

| Função | O que faz |
| --- | --- |
| **Leituras combinadas** | Mostra o que disparou — "paciente vivendo em estado crônico de ameaça" — em destaque, não como item de lista |
| **Por que deu esse número** | Abre o detalhamento: qual marcador, que peso, que intensidade. É o que sustenta a credibilidade clínica |
| **Marcadores dominantes** | Os que mais pesaram em cada sistema, para ela saber por onde começar |
| **Relatório** | Texto em dois registros: técnico para ela, acolhedor para o paciente |

O relatório tem dois caminhos, e depende de uma coisa:

- **Com a chave da API** → o Holos AI escreve, adaptado ao caso concreto.
- **Sem a chave** → sai a versão dos bancos, correta mas genérica.

**Pronto quando:** aplicar num paciente e a nutricionista conseguir explicar o
resultado para ele sem precisar de mais nada na tela.

---

## O que NÃO entra nesta semana

Escrito para ninguém cobrar depois:

- **Holoscan** — entrada de exames laboratoriais. Não existe e não começa agora.
- **As 27 ferramentas** que estão "em breve" no app.
- **App do paciente.**
- **Reavaliação 4/8/12** — sábado prepara o terreno (guardar as respostas), mas a comparação entre duas aplicações fica para depois.
- **Login e permissões** — decisão de deixar por último.

---

## Três avisos

**1. Os 87 marcadores ainda são rascunho.** Foram montados por mim da literatura
funcional e do material, com a fonte em cada linha, esperando o Rodrigo revisar.
Dá para construir a máquina inteira em cima deles — mas **nenhum resultado pode
ser mostrado a paciente real** enquanto ele não marcar aceito. O validador avisa
isso a cada execução.

**2. Trabalhar em branch.** O repositório é da conta do Rodrigo. Tudo o que eu
fizer vai para uma branch separada, e nada entra na principal sem você olhar.

**3. Segurança fica para depois, mas fica anotada.** O app grava nome, data de
nascimento e contato de paciente sem nenhum login, usando uma chave pública. Hoje
a tabela está vazia, então nada está exposto. **Antes do primeiro paciente real,
isso precisa ser resolvido** — não nesta semana, mas antes de vender.

---

## Se sobrar tempo

Em ordem de valor:

1. **A comparação entre duas aplicações** — o gráfico de evolução do Índice.
2. **Recomendação de ferramenta** — a IA olha o resultado e sugere qual das 30 aplicar.
3. **Exportar o mapa em PDF** — está na promessa do produto desde o começo.
