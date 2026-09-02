/**
 * CAMINHO COM CRISTO - SCRIPT PRINCIPAL
 * Gerencia a navegação, devocional diário, reflexão interativa,
 * registro de leituras bíblicas e espaço de orações com persistência local.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // UTILITÁRIOS & SEGURANÇA (ANTI-XSS)
    // ==========================================
    function escaparHTML(texto) {
        if (!texto) return "";
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function obterDataFormatada() {
        const hoje = new Date();
        return hoje.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    function exibirFeedback(elementoId, mensagem, tipo = "sucesso") {
        const elemento = document.getElementById(elementoId);
        if (!elemento) return;

        elemento.textContent = mensagem;
        elemento.className = `feedback-msg ${tipo}`;

        setTimeout(() => {
            elemento.className = "feedback-msg";
            elemento.textContent = "";
        }, 4000);
    }

    // ==========================================
    // NAVEGAÇÃO & MENU MOBILE
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const linksMenu = document.querySelectorAll(".menu a");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const estaAberto = navMenu.classList.toggle("aberto");
            menuToggle.classList.toggle("ativo", estaAberto);
            menuToggle.setAttribute("aria-expanded", String(estaAberto));
        });

        // Fechar menu ao clicar em qualquer link
        linksMenu.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("aberto");
                menuToggle.classList.remove("ativo");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Fechar menu se clicar fora dele
        document.addEventListener("click", (evento) => {
            if (!navMenu.contains(evento.target) && !menuToggle.contains(evento.target)) {
                navMenu.classList.remove("aberto");
                menuToggle.classList.remove("ativo");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Botão do Hero: Começar Caminhada
    const btnHeroComecar = document.getElementById("btnComecarCaminhada");
    if (btnHeroComecar) {
        btnHeroComecar.addEventListener("click", () => {
            const secaoPalavra = document.getElementById("palavra");
            if (secaoPalavra) {
                secaoPalavra.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Botão Voltar ao Topo
    const btnVoltarTopo = document.getElementById("btnVoltarTopo");
    if (btnVoltarTopo) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                btnVoltarTopo.classList.add("visivel");
            } else {
                btnVoltarTopo.classList.remove("visivel");
            }
        });

        btnVoltarTopo.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================
    // SEÇÃO PALAVRA DO DIA: EXPANDIR REFLEXÃO
    // ==========================================
    const botaoReflexao = document.getElementById("btnToggleReflexao") || document.querySelector(".botao-reflexao");
    const reflexaoCompleta = document.getElementById("reflexaoCompleta");

    if (botaoReflexao && reflexaoCompleta) {
        botaoReflexao.addEventListener("click", () => {
            const aberta = reflexaoCompleta.classList.toggle("aberta");
            botaoReflexao.setAttribute("aria-expanded", String(aberta));
            reflexaoCompleta.setAttribute("aria-hidden", String(!aberta));

            if (aberta) {
                botaoReflexao.textContent = "Fechar reflexão ↑";
            } else {
                botaoReflexao.textContent = "Ler reflexão →";
            }
        });
    }

    // ==========================================
    // MINHA CAMINHADA (REGISTRO BÍBLICO)
    // ==========================================
    const botaoSalvarLeitura = document.getElementById("salvarLeitura");
    const botaoCancelarEdicaoLeitura = document.getElementById("cancelarEdicaoLeitura");
    const campoLivro = document.getElementById("livro");
    const campoCapitulo = document.getElementById("capitulo");
    const campoAprendizado = document.getElementById("aprendizado");
    const listaLeituras = document.getElementById("listaLeituras");

    let indiceEdicaoLeitura = null;

    let leituras = [];
    try {
        leituras = JSON.parse(localStorage.getItem("leiturasBiblicas")) || [];
    } catch (e) {
        leituras = [];
    }

    function salvarLeiturasStorage() {
        try {
            localStorage.setItem("leiturasBiblicas", JSON.stringify(leituras));
        } catch (e) {
            console.error("Erro ao salvar leituras no localStorage:", e);
        }
    }

    function limparFormularioLeitura() {
        campoLivro.value = "";
        campoCapitulo.value = "";
        campoAprendizado.value = "";
        indiceEdicaoLeitura = null;
        botaoSalvarLeitura.textContent = "Salvar leitura";
        if (botaoCancelarEdicaoLeitura) {
            botaoCancelarEdicaoLeitura.style.display = "none";
        }
    }

    function renderizarLeituras() {
        if (!listaLeituras) return;

        if (leituras.length === 0) {
            listaLeituras.innerHTML = `
                <p class="sem-leituras">
                    Nenhuma leitura registrada ainda. Faça sua primeira anotação acima!
                </p>
            `;
            return;
        }

        listaLeituras.innerHTML = "";

        leituras.forEach((leitura, indice) => {
            const card = document.createElement("div");
            card.className = "leitura-registrada";

            const livroEscapado = escaparHTML(leitura.livro);
            const capituloEscapado = escaparHTML(leitura.capitulo);
            const aprendizadoEscapado = escaparHTML(leitura.aprendizado);
            const dataFormatada = leitura.data ? escaparHTML(leitura.data) : "Leitura salva";

            card.innerHTML = `
                <div class="cabecalho-card">
                    <h4>${livroEscapado} — Capítulo ${capituloEscapado}</h4>
                    <span class="data-badge">${dataFormatada}</span>
                </div>
                <p>${aprendizadoEscapado}</p>
                <div class="botoes-card">
                    <button class="botao-editar" data-indice="${indice}" type="button" aria-label="Editar leitura de ${livroEscapado}">
                        ✎ Editar
                    </button>
                    <button class="botao-excluir" data-indice="${indice}" type="button" aria-label="Excluir leitura de ${livroEscapado}">
                        🗑 Excluir
                    </button>
                </div>
            `;

            listaLeituras.appendChild(card);
        });

        // Adicionar eventos nos botões recém-criados
        listaLeituras.querySelectorAll(".botao-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                iniciarEdicaoLeitura(idx);
            });
        });

        listaLeituras.querySelectorAll(".botao-excluir").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                excluirLeituraComConfirmacao(idx);
            });
        });
    }

    function iniciarEdicaoLeitura(indice) {
        const item = leituras[indice];
        if (!item) return;

        indiceEdicaoLeitura = indice;
        campoLivro.value = item.livro;
        campoCapitulo.value = item.capitulo;
        campoAprendizado.value = item.aprendizado;

        botaoSalvarLeitura.textContent = "Salvar alterações";
        if (botaoCancelarEdicaoLeitura) {
            botaoCancelarEdicaoLeitura.style.display = "inline-block";
        }

        campoLivro.focus();
        campoLivro.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function excluirLeituraComConfirmacao(indice) {
        const item = leituras[indice];
        const nomeLivro = item ? `${item.livro} ${item.capitulo}` : "esta leitura";
        
        if (confirm(`Deseja realmente excluir a leitura de ${nomeLivro}?`)) {
            // Se estava editando este item, cancela a edição
            if (indiceEdicaoLeitura === indice) {
                limparFormularioLeitura();
            } else if (indiceEdicaoLeitura > indice) {
                indiceEdicaoLeitura--;
            }

            leituras.splice(indice, 1);
            salvarLeiturasStorage();
            renderizarLeituras();
            exibirFeedback("feedbackLeitura", "Leitura excluída com sucesso.", "sucesso");
        }
    }

    if (botaoCancelarEdicaoLeitura) {
        botaoCancelarEdicaoLeitura.addEventListener("click", () => {
            limparFormularioLeitura();
            exibirFeedback("feedbackLeitura", "Edição cancelada.", "sucesso");
        });
    }

    if (botaoSalvarLeitura) {
        botaoSalvarLeitura.addEventListener("click", () => {
            const livro = campoLivro.value.trim();
            const capitulo = campoCapitulo.value.trim();
            const aprendizado = campoAprendizado.value.trim();

            if (!livro || !capitulo || !aprendizado) {
                exibirFeedback("feedbackLeitura", "Por favor, preencha todos os campos antes de salvar.", "erro");
                return;
            }

            if (indiceEdicaoLeitura !== null && leituras[indiceEdicaoLeitura]) {
                // Atualização segura do item existente sem risco de perda
                leituras[indiceEdicaoLeitura].livro = livro;
                leituras[indiceEdicaoLeitura].capitulo = capitulo;
                leituras[indiceEdicaoLeitura].aprendizado = aprendizado;
                exibirFeedback("feedbackLeitura", "Leitura bíblica atualizada com sucesso!", "sucesso");
            } else {
                // Novo registro
                const novaLeitura = {
                    livro: livro,
                    capitulo: capitulo,
                    aprendizado: aprendizado,
                    data: obterDataFormatada()
                };
                leituras.unshift(novaLeitura);
                exibirFeedback("feedbackLeitura", "Leitura bíblica registrada com sucesso!", "sucesso");
            }

            salvarLeiturasStorage();
            limparFormularioLeitura();
            renderizarLeituras();
        });
    }

    // ==========================================
    // MINHAS ORAÇÕES
    // ==========================================
    const botaoSalvarOracao = document.getElementById("salvarOracao");
    const botaoCancelarEdicaoOracao = document.getElementById("cancelarEdicaoOracao");
    const campoPedidoOracao = document.getElementById("pedidoOracao");
    const listaOracoes = document.getElementById("listaOracoes");

    let indiceEdicaoOracao = null;

    let oracoes = [];
    try {
        oracoes = JSON.parse(localStorage.getItem("oracoes")) || [];
    } catch (e) {
        oracoes = [];
    }

    function salvarOracoesStorage() {
        try {
            localStorage.setItem("oracoes", JSON.stringify(oracoes));
        } catch (e) {
            console.error("Erro ao salvar orações no localStorage:", e);
        }
    }

    function limparFormularioOracao() {
        campoPedidoOracao.value = "";
        indiceEdicaoOracao = null;
        botaoSalvarOracao.textContent = "Salvar oração";
        if (botaoCancelarEdicaoOracao) {
            botaoCancelarEdicaoOracao.style.display = "none";
        }
    }

    function renderizarOracoes() {
        if (!listaOracoes) return;

        if (oracoes.length === 0) {
            listaOracoes.innerHTML = `
                <p class="sem-oracoes">
                    Nenhuma oração registrada ainda. Escreva seu pedido ou agradecimento acima!
                </p>
            `;
            return;
        }

        listaOracoes.innerHTML = "";

        oracoes.forEach((oracao, indice) => {
            const card = document.createElement("div");
            const estaAtendida = Boolean(oracao.atendida);
            card.className = `oracao-registrada ${estaAtendida ? "oracao-atendida" : ""}`;

            const textoEscapado = escaparHTML(oracao.texto);
            const dataFormatada = oracao.data ? escaparHTML(oracao.data) : "Oração registrada";

            card.innerHTML = `
                <div class="cabecalho-card">
                    ${estaAtendida ? '<span class="tag-atendida">✓ GRAÇA ALCANÇADA / ORAÇÃO ATENDIDA</span>' : ''}
                    <span class="data-badge">${dataFormatada}</span>
                </div>
                <p>${textoEscapado}</p>
                <div class="botoes-card">
                    <button class="botao-atendida" data-indice="${indice}" type="button" aria-label="${estaAtendida ? 'Marcar como não atendida' : 'Marcar como atendida'}">
                        ${estaAtendida ? "✓ Graça alcançada 🙏" : "Marcar como atendida"}
                    </button>
                    <button class="botao-editar" data-indice="${indice}" type="button" aria-label="Editar oração">
                        ✎ Editar
                    </button>
                    <button class="botao-excluir" data-indice="${indice}" type="button" aria-label="Excluir oração">
                        🗑 Excluir
                    </button>
                </div>
            `;

            listaOracoes.appendChild(card);
        });

        // Eventos nos botões das orações
        listaOracoes.querySelectorAll(".botao-atendida").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                alternarOracaoAtendida(idx);
            });
        });

        listaOracoes.querySelectorAll(".botao-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                iniciarEdicaoOracao(idx);
            });
        });

        listaOracoes.querySelectorAll(".botao-excluir").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                excluirOracaoComConfirmacao(idx);
            });
        });
    }

    function iniciarEdicaoOracao(indice) {
        const item = oracoes[indice];
        if (!item) return;

        indiceEdicaoOracao = indice;
        campoPedidoOracao.value = item.texto;

        botaoSalvarOracao.textContent = "Salvar alterações";
        if (botaoCancelarEdicaoOracao) {
            botaoCancelarEdicaoOracao.style.display = "inline-block";
        }

        campoPedidoOracao.focus();
        campoPedidoOracao.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function alternarOracaoAtendida(indice) {
        if (!oracoes[indice]) return;
        oracoes[indice].atendida = !oracoes[indice].atendida;
        salvarOracoesStorage();
        renderizarOracoes();

        const status = oracoes[indice].atendida ? "Oração marcada como graça alcançada! Glória a Deus." : "Status da oração atualizado.";
        exibirFeedback("feedbackOracao", status, "sucesso");
    }

    function excluirOracaoComConfirmacao(indice) {
        if (confirm("Deseja realmente excluir este pedido de oração?")) {
            if (indiceEdicaoOracao === indice) {
                limparFormularioOracao();
            } else if (indiceEdicaoOracao > indice) {
                indiceEdicaoOracao--;
            }

            oracoes.splice(indice, 1);
            salvarOracoesStorage();
            renderizarOracoes();
            exibirFeedback("feedbackOracao", "Oração excluída com sucesso.", "sucesso");
        }
    }

    if (botaoCancelarEdicaoOracao) {
        botaoCancelarEdicaoOracao.addEventListener("click", () => {
            limparFormularioOracao();
            exibirFeedback("feedbackOracao", "Edição cancelada.", "sucesso");
        });
    }

    if (botaoSalvarOracao && campoPedidoOracao) {
        botaoSalvarOracao.addEventListener("click", () => {
            const texto = campoPedidoOracao.value.trim();

            if (!texto) {
                exibirFeedback("feedbackOracao", "Por favor, escreva seu pedido de oração antes de salvar.", "erro");
                return;
            }

            if (indiceEdicaoOracao !== null && oracoes[indiceEdicaoOracao]) {
                oracoes[indiceEdicaoOracao].texto = texto;
                exibirFeedback("feedbackOracao", "Oração atualizada com sucesso!", "sucesso");
            } else {
                const novaOracao = {
                    texto: texto,
                    atendida: false,
                    data: obterDataFormatada()
                };
                oracoes.unshift(novaOracao);
                exibirFeedback("feedbackOracao", "Oração registrada com sucesso! Deus ouve sua oração.", "sucesso");
            }

            salvarOracoesStorage();
            limparFormularioOracao();
            renderizarOracoes();
        });
    }

    // Inicialização da listagem
    renderizarLeituras();
    renderizarOracoes();
});