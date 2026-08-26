# /goal — Objetivo Terapêutico Holístico

Ao receber `/goal`, sintetize os dados do paciente selecionado e gere um **Objetivo Terapêutico Integrado** seguindo a metodologia HOLOS (Corpo + Mente + Espírito).

## Dados de Entrada

Colete ou solicite ao usuário as seguintes informações do paciente:

### 1. OQ3 — Orientação Quádrupla do Corpo
- **O que quer?** — desejo consciente do paciente
- **O que precisa?** — necessidade clínica real identificada pelo profissional
- **O que consegue?** — capacidade atual de execução (limitações, rotina, contexto)
- **Alavancas** — pontos de maior impacto para mudança imediata

### 2. PQQ — Perguntas que Queimam (Mente)
- **Objetivo declarado** — o que o paciente diz buscar
- **5 Reflexões (R1–R5)** — respostas às perguntas provocativas sobre crenças, padrões e bloqueios
- **Verdade do paciente** — síntese da narrativa interna que sustenta ou sabota o processo

### 3. HOLOSCOPE — Mapa dos 5 Sistemas (0–10)
- **Sistema Fúngico** — disbiose, candidíase, biofilmes
- **Sistema Ácido-Inflamatório** — pH tecidual, inflamação crônica, dor
- **Sistema Metabólico** — resistência insulínica, tireoide, energia celular
- **Sistema Detox-Linfático** — fígado, rins, linfa, pele, intestino
- **Sistema Mental-Emocional** — estresse, sono, humor, cognição

### 4. Contexto adicional (se disponível)
- Queixa principal e histórico
- Data de início do acompanhamento
- Score HOLOS geral (0–100)

## Formato de Saída

Gere a resposta nesta estrutura:

```
## OBJETIVO TERAPÊUTICO HOLÍSTICO
### Paciente: [nome]
### Data: [data atual]

---

### DIAGNÓSTICO INTEGRATIVO
Síntese em 2–3 frases conectando os achados do OQ3, PQQ e HOLOSCOPE.
Identifique o eixo predominante (Corpo, Mente ou Espírito) e as conexões entre eles.

### META UNIFICADA
Uma frase clara que integre corpo-mente-espírito em um único direcionamento clínico.

### PLANO DE AÇÃO

**Curto prazo (1–2 semanas):**
- 2–3 ações prioritárias focadas nas alavancas do OQ3
- Foco no sistema HOLOSCOPE mais crítico (score mais baixo)

**Médio prazo (30–60 dias):**
- Ajustes nutricionais e de estilo de vida
- Trabalho sobre as crenças identificadas no PQQ
- Reequilíbrio dos sistemas HOLOSCOPE deficientes

**Longo prazo (90+ dias):**
- Consolidação da mudança de padrão
- Meta de score HOLOS alvo
- Integração espiritual/propósito com a rotina

### INDICADORES DE PROGRESSO
- Scores HOLOSCOPE alvo para cada sistema
- Critérios objetivos para reavaliação
- Sinais subjetivos de evolução (energia, humor, clareza)

### NOTA CLÍNICA
Observação breve sobre riscos, contraindicações ou pontos de atenção.
```

## Diretrizes

- Use linguagem clínica mas acessível — o paciente pode ler este documento
- Sempre conecte os três eixos (corpo-mente-espírito) — nunca trate isoladamente
- Priorize pelo score HOLOSCOPE: sistemas com nota mais baixa recebem atenção primeiro
- Respeite o "O que consegue" do OQ3 — metas devem ser realistas para o contexto do paciente
- A "Verdade do paciente" (PQQ) deve informar o tom e a abordagem, não ser ignorada
- Se dados estiverem incompletos, sinalize quais informações faltam antes de gerar o plano
- Nunca prescreva medicamentos — foque em nutrição, estilo de vida, e orientação integrativa
