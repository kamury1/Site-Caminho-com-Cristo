/**
 * CAMINHO COM CRISTO - SCRIPT PRINCIPAL (2026)
 * Gerencia devocional dinâmico, leitura por voz, timer de oração meditativo,
 * diário bíblico, mural de orações, backup/restore e notificações modernas.
 */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. BANCO DE DADOS DEVOCIONAL (VERSÍCULOS & REFLEXÕES CRISTÃS)
    // =========================================================================
    const DEVOCIONAIS = [
        {
            titulo: "Encontre descanso em Cristo",
            tema: "Paz e Descanso",
            texto: "Vinde a mim, todos vós que estais cansados e carregados de fardos, e eu vos darei descanso.",
            referencia: "Mateus 11:28",
            previa: "Há dias em que o peso da caminhada parece maior do que conseguimos carregar. Cristo não nos pede que enfrentemos as tempestades com as próprias forças. Ele nos faz um convite de amor: aproximarmo-nos Dele e descansarmos em sua fidelidade.",
            completa: [
                "Quando Jesus nos chama para junto de Si, isso não significa que todas as aflições desaparecerão num piscar de olhos. Significa que não precisamos mais suportar os fardos da vida solitariamente.",
                "A fé verdadeira é aprender a confiar e repousar em Deus mesmo quando as circunstâncias ao redor ainda não mostram uma solução imediata. Cristo caminha conosco em cada passo da jornada, sustentando nossa alma com graça suficiente para cada novo dia."
            ],
            pensamento: "A sua força não vem de carregar tudo sozinho, mas de entregar tudo nas mãos daquele que cuida de você."
        },
        {
            titulo: "O Bom Pastor que tudo supre",
            tema: "Provisão e Cuidado",
            texto: "O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.",
            referencia: "Salmos 23:1-2",
            previa: "Nas incertezas do amanhã, o cuidado de Deus permanece inabalável. Ele conhece o caminho adiante e nos guia com amor paternal aos mananciais de paz e restauração.",
            completa: [
                "Davi conhecia a vida nos campos e sabia que a ovelha depende inteiramente do pastor para proteção e alimento. Da mesma forma, nossa alma encontra plena segurança ao descansar na providência divina.",
                "Mesmo quando atravessamos vales escuros, não estamos desamparados. A presença do Senhor é escudo, bálsamo e luz para os nossos passos."
            ],
            pensamento: "Deus não apenas provê o que precisamos no tempo certo; Ele próprio é o nosso refúgio e maior tesouro."
        },
        {
            titulo: "Força renovada na esperança",
            tema: "Esperança e Renovação",
            texto: "Aqueles que esperam no Senhor renovam as suas forças. Voam alto como águias; correm e não ficam exaustos, andam e não se cansam.",
            referencia: "Isaías 40:31",
            previa: "O cansaço humano é inevitável quando dependemos apenas de nossa energia física e mental. Contudo, há uma fonte inesgotável de vigor reservada àqueles que confiam no Deus Todo-Poderoso.",
            completa: [
                "Esperar em Deus não é inércia nem resignação passiva, mas uma atitude ativa de fé, onde entregamos o controle e alinhamos o nosso coração com a soberania celestial.",
                "Quando confiamos no tempo do Senhor, Ele nos capacita a superar tempestades e a nos elevarmos acima dos medos que tentam nos paralisar."
            ],
            pensamento: "Quando as suas forças terminam, é exatamente onde a graça sustentadora de Deus começa a operar."
        },
        {
            titulo: "A paz que excede todo entendimento",
            tema: "Paz e Confiança",
            texto: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica, com ação de graças.",
            referencia: "Filipenses 4:6",
            previa: "A ansiedade tenta nos roubar a serenidade do presente antecipando incertezas futuras. A oração sincera é o antídoto divino que transforma preocupação em paz profunda.",
            completa: [
                "A oração com gratidão muda o nosso foco: deixamos de olhar para o tamanho do problema e contemplamos a grandeza do nosso Deus.",
                "A paz de Cristo não depende da ausência de tribulações, mas da certeza inabalável de que o Senhor governa todas as coisas com sabedoria perfeita."
            ],
            pensamento: "Troque a inquietação da mente pelo joelho no chão e experimente a paz que guarda o coração."
        },
        {
            titulo: "Amor do qual nada nos separa",
            tema: "Amor Incondicional",
            texto: "Pois estou convencido de que nem morte nem vida, nem anjos nem demônios, nem o presente nem o futuro... será capaz de nos separar do amor de Deus que está em Cristo Jesus.",
            referencia: "Romanos 8:38-39",
            previa: "Não há falha, crise ou dor que possa romper o vínculo eterno de amor que Cristo selou por nós na cruz. Você é profundamente amado pelo Pai celestial.",
            completa: [
                "Em dias difíceis, a dúvida tenta sussurrar que fomos esquecidos. Mas a Palavra declara que o amor de Deus é incondicional, eterno e inabalável.",
                "Caminhe hoje com a certeza de que a mão que sustenta as estrelas é a mesma mão que acolhe e guarda o seu coração com carinho infinito."
            ],
            pensamento: "O amor de Deus por você não oscila com o seu desempenho; ele é eterno, seguro e suficiente."
        }
    ];

    let indiceDevocionalAtual = 0;

    // =========================================================================
    // 2. UTILITÁRIOS, SEGURANÇA (ANTI-XSS) E NOTIFICAÇÕES
    // =========================================================================
    function escaparHTML(texto) {
        if (!texto) return "";
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function obterDataHoje() {
        return new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    // SISTEMA MODERNO DE TOAST
    function mostrarToast(mensagem, tipo = "sucesso", icone = "") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const icones = {
            sucesso: "✓",
            erro: "✕",
            info: "ℹ"
        };

        const toast = document.createElement("div");
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <span class="toast-icone" style="font-weight: bold; color: var(--dourado-luz);">${icone || icones[tipo] || "•"}</span>
            <span class="toast-msg">${escaparHTML(mensagem)}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-30px)";
            setTimeout(() => toast.remove(), 350);
        }, 4000);
    }

    // MODAL DE CONFIRMAÇÃO ELEGANTE
    function abrirModalConfirmacao(titulo, mensagem, callbackConfirmar, icone = "⚠️") {
        const modal = document.getElementById("modalConfirmacao");
        const elTitulo = document.getElementById("modalTitulo");
        const elMensagem = document.getElementById("modalMensagem");
        const elIcone = document.getElementById("modalIcone");
        const btnConfirmar = document.getElementById("btnModalConfirmar");
        const btnCancelar = document.getElementById("btnModalCancelar");

        if (!modal) {
            if (confirm(mensagem)) callbackConfirmar();
            return;
        }

        elTitulo.textContent = titulo;
        elMensagem.textContent = mensagem;
        elIcone.textContent = icone;

        modal.classList.add("ativo");
        modal.setAttribute("aria-hidden", "false");

        const fecharModal = () => {
            modal.classList.remove("ativo");
            modal.setAttribute("aria-hidden", "true");
            btnConfirmar.onclick = null;
            btnCancelar.onclick = null;
        };

        btnConfirmar.onclick = () => {
            fecharModal();
            callbackConfirmar();
        };

        btnCancelar.onclick = fecharModal;

        modal.onclick = (e) => {
            if (e.target === modal) fecharModal();
        };
    }

    // =========================================================================
    // 3. NAVEGAÇÃO, SCROLLSPY & MENU MOBILE
    // =========================================================================
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const aberto = navMenu.classList.toggle("aberto");
            menuToggle.classList.toggle("ativo", aberto);
            menuToggle.setAttribute("aria-expanded", String(aberto));
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("aberto");
                menuToggle.classList.remove("ativo");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove("aberto");
                menuToggle.classList.remove("ativo");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ScrollSpy (Destaque da seção ativa)
    const secoes = document.querySelectorAll("header[id], section[id]");
    window.addEventListener("scroll", () => {
        let topoAtual = window.scrollY + 160;

        secoes.forEach(secao => {
            const id = secao.getAttribute("id");
            const top = secao.offsetTop;
            const altura = secao.offsetHeight;

            if (topoAtual >= top && topoAtual < top + altura) {
                navLinks.forEach(link => {
                    link.classList.remove("ativo");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("ativo");
                    }
                });
            }
        });
    });

    // Botão Voltar ao Topo
    const btnVoltarTopo = document.getElementById("btnVoltarTopo");
    if (btnVoltarTopo) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 380) {
                btnVoltarTopo.classList.add("visivel");
            } else {
                btnVoltarTopo.classList.remove("visivel");
            }
        });

        btnVoltarTopo.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // =========================================================================
    // 4. PALAVRA DO DIA & FERRAMENTAS BÍBLICAS
    // =========================================================================
    const elTema = document.getElementById("devocionalTema");
    const elTitulo = document.getElementById("titulo-palavra");
    const elTexto = document.getElementById("devocionalTexto");
    const elReferencia = document.getElementById("devocionalReferencia");
    const elPrevia = document.getElementById("reflexaoPrevia");
    const elCompletaConteudo = document.getElementById("reflexaoCompletaConteudo");
    const btnToggleReflexao = document.getElementById("btnToggleReflexao");
    const reflexaoCompleta = document.getElementById("reflexaoCompleta");

    function renderizarDevocional(indice) {
        const item = DEVOCIONAIS[indice % DEVOCIONAIS.length];
        if (!item) return;

        if (elTema) elTema.textContent = item.tema;
        if (elTitulo) elTitulo.textContent = item.titulo;
        if (elTexto) elTexto.textContent = item.texto;
        if (elReferencia) elReferencia.textContent = item.referencia;

        if (elPrevia) {
            elPrevia.innerHTML = `<p>${escaparHTML(item.previa)}</p>`;
        }

        if (elCompletaConteudo) {
            const paragrafos = item.completa.map(p => `<p>${escaparHTML(p)}</p>`).join("");
            const pensamentoHTML = item.pensamento 
                ? `<div class="reflexao-pensamento-chave">
                       <span class="pensamento-icone">💡</span>
                       <em>Guarde hoje: ${escaparHTML(item.pensamento)}</em>
                   </div>`
                : "";

            elCompletaConteudo.innerHTML = paragrafos + pensamentoHTML;
        }

        // Recolhe a reflexão ao trocar de versículo
        if (reflexaoCompleta && reflexaoCompleta.classList.contains("aberta")) {
            reflexaoCompleta.classList.remove("aberta");
            if (btnToggleReflexao) {
                btnToggleReflexao.classList.remove("ativo");
                btnToggleReflexao.querySelector(".btn-toggle-texto").textContent = "Ler reflexão completa";
            }
        }
    }

    // Alternar reflexão (Expandir / Recolher)
    if (btnToggleReflexao && reflexaoCompleta) {
        btnToggleReflexao.addEventListener("click", () => {
            const aberta = reflexaoCompleta.classList.toggle("aberta");
            btnToggleReflexao.classList.toggle("ativo", aberta);
            btnToggleReflexao.setAttribute("aria-expanded", String(aberta));
            reflexaoCompleta.setAttribute("aria-hidden", String(!aberta));

            const textoSpan = btnToggleReflexao.querySelector(".btn-toggle-texto");
            if (textoSpan) {
                textoSpan.textContent = aberta ? "Fechar reflexão" : "Ler reflexão completa";
            }
        });
    }

    // Próximo Versículo
    const btnProximoDevocional = document.getElementById("btnProximoDevocional");
    if (btnProximoDevocional) {
        btnProximoDevocional.addEventListener("click", () => {
            indiceDevocionalAtual = (indiceDevocionalAtual + 1) % DEVOCIONAIS.length;
            renderizarDevocional(indiceDevocionalAtual);
            mostrarToast("Novo versículo carregado!", "info", "📖");
        });
    }

    // Copiar Versículo
    const btnCopiarVersiculo = document.getElementById("btnCopiarVersiculo");
    if (btnCopiarVersiculo) {
        btnCopiarVersiculo.addEventListener("click", () => {
            const item = DEVOCIONAIS[indiceDevocionalAtual];
            const textoCompleto = `“${item.texto}” — ${item.referencia}\n\nCaminho com Cristo: Fé e Palavra diária.`;
            
            navigator.clipboard.writeText(textoCompleto)
                .then(() => mostrarToast("Versículo copiado para a área de transferência!", "sucesso", "📋"))
                .catch(() => mostrarToast("Não foi possível copiar automaticamente.", "erro"));
        });
    }

    // Compartilhar WhatsApp
    const btnCompartilharWhatsApp = document.getElementById("btnCompartilharWhatsApp");
    if (btnCompartilharWhatsApp) {
        btnCompartilharWhatsApp.addEventListener("click", () => {
            const item = DEVOCIONAIS[indiceDevocionalAtual];
            const mensagem = `✨ *Palavra do Dia - Caminho com Cristo*\n\n“${item.texto}”\n📖 *${item.referencia}*\n\n_${item.previa}_`;
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
            window.open(url, "_blank");
        });
    }

    // Ouvir Palavra (Leitura de Voz - SpeechSynthesis)
    const btnOuvirVersiculo = document.getElementById("btnOuvirVersiculo");
    let vozFalando = false;

    if (btnOuvirVersiculo && "speechSynthesis" in window) {
        btnOuvirVersiculo.addEventListener("click", () => {
            if (vozFalando) {
                window.speechSynthesis.cancel();
                vozFalando = false;
                btnOuvirVersiculo.querySelector(".btn-texto-curto").textContent = "Ouvir";
                mostrarToast("Áudio pausado.", "info");
                return;
            }

            const item = DEVOCIONAIS[indiceDevocionalAtual];
            const textoParaVoz = `${item.titulo}. Versículo: ${item.texto}. ${item.referencia}. Reflexão: ${item.previa}`;
            
            const utterance = new SpeechSynthesisUtterance(textoParaVoz);
            utterance.lang = "pt-BR";
            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            utterance.onstart = () => {
                vozFalando = true;
                btnOuvirVersiculo.querySelector(".btn-texto-curto").textContent = "Pausar";
                mostrarToast("Reproduzindo reflexão em áudio...", "info", "🔊");
            };

            utterance.onend = () => {
                vozFalando = false;
                btnOuvirVersiculo.querySelector(".btn-texto-curto").textContent = "Ouvir";
            };

            utterance.onerror = () => {
                vozFalando = false;
                btnOuvirVersiculo.querySelector(".btn-texto-curto").textContent = "Ouvir";
            };

            window.speechSynthesis.speak(utterance);
        });
    }

    // Escolhe o versículo do dia baseado no dia do ano
    const diaDoAno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    indiceDevocionalAtual = diaDoAno % DEVOCIONAIS.length;
    renderizarDevocional(indiceDevocionalAtual);


    // =========================================================================
    // 5. MOMENTO DE SILÊNCIO & ORAÇÃO (TIMER MEDITATIVO COM MÚSICA DE FUNDO)
    // =========================================================================
    const timerDisplay = document.getElementById("timerDisplay");
    const timerInstrucao = document.getElementById("timerInstrucao");
    const timerPulso = document.getElementById("timerPulso");
    const btnIniciarTimer = document.getElementById("btnIniciarTimer");
    const btnResetarTimer = document.getElementById("btnResetarTimer");
    const botoesDuracao = document.querySelectorAll(".btn-duracao");

    // Controles de Áudio
    const audioOracao = document.getElementById("audioOracao");
    const btnAudioToggle = document.getElementById("btnAudioToggle");
    const iconeSom = document.getElementById("iconeSom");
    const rotuloSom = document.getElementById("rotuloSom");
    const sliderVolume = document.getElementById("sliderVolume");

    let duracaoSegundos = 60;
    let tempoRestante = 60;
    let timerInterval = null;
    let timerEmExecucao = false;
    let timerEmPausa = false;

    // Estado do Áudio
    let audioMuted = localStorage.getItem("oracaoAudioMuted") === "true";
    let volumeConfigurado = parseFloat(localStorage.getItem("oracaoAudioVolume")) || 0.25;
    let fadeAudioInterval = null;
    let fadeOutJaDisparado = false;

    function formatarTempo(segundos) {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function atualizarUIControlesAudio() {
        if (sliderVolume) sliderVolume.value = volumeConfigurado;
        if (btnAudioToggle) {
            if (audioMuted) {
                btnAudioToggle.classList.add("mutado");
                btnAudioToggle.setAttribute("aria-label", "Ativar música de fundo");
                btnAudioToggle.setAttribute("title", "Música de fundo: Desligada (clique para ativar)");
                if (iconeSom) iconeSom.textContent = "🔇";
                if (rotuloSom) rotuloSom.textContent = "Música: Desligada";
            } else {
                btnAudioToggle.classList.remove("mutado");
                btnAudioToggle.setAttribute("aria-label", "Desativar música de fundo");
                btnAudioToggle.setAttribute("title", "Música de fundo: Ligada (clique para silenciar)");
                if (iconeSom) iconeSom.textContent = "🎵";
                if (rotuloSom) rotuloSom.textContent = "Música: Ligada";
            }
        }
    }

    // FADE IN SUAVE
    function iniciarAudioComFadeIn(duracaoMs = 3500) {
        if (!audioOracao || audioMuted) return;
        clearInterval(fadeAudioInterval);

        audioOracao.volume = 0.01;
        const alvo = volumeConfigurado;
        const passoTempo = 50;
        const passosTotais = duracaoMs / passoTempo;
        const incremento = Math.max(0.005, alvo / passosTotais);

        const playPromise = audioOracao.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                fadeAudioInterval = setInterval(() => {
                    if (audioOracao.volume + incremento < alvo) {
                        audioOracao.volume += incremento;
                    } else {
                        audioOracao.volume = alvo;
                        clearInterval(fadeAudioInterval);
                    }
                }, passoTempo);
            }).catch(erro => {
                console.warn("Reprodução de áudio respeitando autoplay do navegador:", erro);
            });
        }
    }

    // FADE OUT SUAVE
    function finalizarAudioComFadeOut(duracaoMs = 4000, callback) {
        if (!audioOracao) {
            if (callback) callback();
            return;
        }
        clearInterval(fadeAudioInterval);

        const volumeInicial = audioOracao.volume;
        if (volumeInicial <= 0.01 || audioOracao.paused) {
            audioOracao.pause();
            audioOracao.currentTime = 0;
            if (callback) callback();
            return;
        }

        const passoTempo = 50;
        const passosTotais = duracaoMs / passoTempo;
        const decremento = Math.max(0.005, volumeInicial / passosTotais);

        fadeAudioInterval = setInterval(() => {
            if (audioOracao.volume - decremento > 0.01) {
                audioOracao.volume -= decremento;
            } else {
                audioOracao.volume = 0;
                audioOracao.pause();
                audioOracao.currentTime = 0;
                clearInterval(fadeAudioInterval);
                if (callback) callback();
            }
        }, passoTempo);
    }

    function pausarAudioImediato() {
        if (!audioOracao) return;
        clearInterval(fadeAudioInterval);
        audioOracao.pause();
    }

    function retomarAudioImediato() {
        if (!audioOracao || audioMuted) return;
        clearInterval(fadeAudioInterval);
        audioOracao.volume = volumeConfigurado;
        audioOracao.play().catch(e => console.warn(e));
    }

    function resetarAudioCompleto() {
        if (!audioOracao) return;
        clearInterval(fadeAudioInterval);
        audioOracao.pause();
        audioOracao.currentTime = 0;
        audioOracao.volume = volumeConfigurado;
        fadeOutJaDisparado = false;
    }

    // Eventos dos Controles de Áudio
    if (btnAudioToggle) {
        btnAudioToggle.addEventListener("click", () => {
            audioMuted = !audioMuted;
            try {
                localStorage.setItem("oracaoAudioMuted", String(audioMuted));
            } catch (e) {}

            atualizarUIControlesAudio();

            if (timerEmExecucao) {
                if (audioMuted) {
                    pausarAudioImediato();
                    mostrarToast("Música silenciada para o momento de oração.", "info", "🔇");
                } else {
                    retomarAudioImediato();
                    mostrarToast("Música ativada com serenidade.", "info", "🎵");
                }
            }
        });
    }

    if (sliderVolume) {
        sliderVolume.addEventListener("input", (e) => {
            volumeConfigurado = parseFloat(e.target.value);
            try {
                localStorage.setItem("oracaoAudioVolume", String(volumeConfigurado));
            } catch (e) {}

            if (audioOracao && !audioMuted && !audioOracao.paused) {
                audioOracao.volume = volumeConfigurado;
            }
        });
    }

    atualizarUIControlesAudio();

    // Seleção de Duração
    botoesDuracao.forEach(btn => {
        btn.addEventListener("click", () => {
            if (timerEmExecucao) return;
            botoesDuracao.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");
            duracaoSegundos = parseInt(btn.getAttribute("data-segundos"), 10);
            tempoRestante = duracaoSegundos;
            if (timerDisplay) timerDisplay.textContent = formatarTempo(tempoRestante);
            resetarAudioCompleto();
        });
    });

    // Iniciar / Pausar Timer
    if (btnIniciarTimer && timerDisplay) {
        btnIniciarTimer.addEventListener("click", () => {
            if (!timerEmExecucao) {
                // Iniciar ou Retomar
                timerEmExecucao = true;
                btnIniciarTimer.textContent = "⏸ Pausar";
                btnIniciarTimer.classList.remove("btn-primario");
                btnIniciarTimer.classList.add("btn-secundario");
                if (btnResetarTimer) btnResetarTimer.style.display = "inline-flex";
                if (timerPulso) timerPulso.classList.add("respirando");
                if (timerInstrucao) timerInstrucao.textContent = "Respire suavemente e ore a Deus...";

                if (!timerEmPausa) {
                    // Início novo
                    resetarAudioCompleto();
                    iniciarAudioComFadeIn(3500);
                } else {
                    // Retomada da pausa
                    retomarAudioImediato();
                    timerEmPausa = false;
                }

                timerInterval = setInterval(() => {
                    tempoRestante--;
                    timerDisplay.textContent = formatarTempo(tempoRestante);

                    // Fade out suave nos últimos 5 segundos
                    if (tempoRestante <= 5 && !fadeOutJaDisparado) {
                        fadeOutJaDisparado = true;
                        finalizarAudioComFadeOut(4800);
                    }

                    if (tempoRestante <= 0) {
                        clearInterval(timerInterval);
                        timerEmExecucao = false;
                        timerEmPausa = false;
                        if (timerPulso) timerPulso.classList.remove("respirando");
                        if (timerInstrucao) timerInstrucao.textContent = "Momento de oração concluído!";
                        btnIniciarTimer.textContent = "▶ Iniciar Novamente";
                        btnIniciarTimer.classList.add("btn-primario");
                        btnIniciarTimer.classList.remove("btn-secundario");
                        resetarAudioCompleto();
                        mostrarToast("Seu momento de oração foi concluído na paz de Deus!", "sucesso", "🕊️");
                    }
                }, 1000);
            } else {
                // Pausar
                clearInterval(timerInterval);
                timerEmExecucao = false;
                timerEmPausa = true;
                btnIniciarTimer.textContent = "▶ Continuar";
                btnIniciarTimer.classList.add("btn-primario");
                btnIniciarTimer.classList.remove("btn-secundario");
                if (timerPulso) timerPulso.classList.remove("respirando");
                if (timerInstrucao) timerInstrucao.textContent = "Pausado";
                pausarAudioImediato();
            }
        });
    }

    // Resetar Timer
    if (btnResetarTimer) {
        btnResetarTimer.addEventListener("click", () => {
            clearInterval(timerInterval);
            timerEmExecucao = false;
            timerEmPausa = false;
            tempoRestante = duracaoSegundos;
            if (timerDisplay) timerDisplay.textContent = formatarTempo(tempoRestante);
            if (timerPulso) timerPulso.classList.remove("respirando");
            if (timerInstrucao) timerInstrucao.textContent = "Pronto para orar";
            btnIniciarTimer.textContent = "▶ Iniciar Momento de Oração";
            btnIniciarTimer.classList.add("btn-primario");
            btnIniciarTimer.classList.remove("btn-secundario");
            btnResetarTimer.style.display = "none";
            resetarAudioCompleto();
        });
    }


    // =========================================================================
    // 6. BÍBLIA SAGRADA CATÓLICA (LEITOR AVE MARIA • 73 LIVROS)
    // =========================================================================
    const selectLivroBiblia = document.getElementById("selectLivroBiblia");
    const selectCapituloBiblia = document.getElementById("selectCapituloBiblia");
    const inputBuscaLivro = document.getElementById("inputBuscaLivro");
    const leitorTituloCapitulo = document.getElementById("leitorTituloCapitulo");
    const leitorTestamentoInfo = document.getElementById("leitorTestamentoInfo");
    const leitorVersiculosLista = document.getElementById("leitorVersiculosLista");
    const leitorIndicadorCentro = document.getElementById("leitorIndicadorCentro");
    const btnCapituloAnterior = document.getElementById("btnCapituloAnterior");
    const btnCapituloProximo = document.getElementById("btnCapituloProximo");
    const btnAumentarFonte = document.getElementById("btnAumentarFonte");
    const btnDiminuirFonte = document.getElementById("btnDiminuirFonte");
    const indicadorTamanhoFonte = document.getElementById("indicadorTamanhoFonte");
    const btnOuvirCapitulo = document.getElementById("btnOuvirCapitulo");
    const btnCopiarCapitulo = document.getElementById("btnCopiarCapitulo");
    const botoesTabTestamento = document.querySelectorAll(".btn-tab-testamento");
    const botoesTemaLeitura = document.querySelectorAll(".btn-tema-leitura");
    const leitorTextoContainer = document.getElementById("leitorTextoContainer");
    const pillsBibliaRapida = document.querySelectorAll(".pill-biblia-rapida");

    let catalogoLivrosCatolicos = [];
    let cacheLivrosBiblia = {};
    let livroAtualBiblia = null;
    let capituloAtualBiblia = 1;
    let filtroTestamentoBiblia = "todos";
    let vozCapituloTocando = false;
    let tamanhoFonteBibliaPercent = parseInt(localStorage.getItem("bibliaTamanhoFonte") || "100", 10);
    let temaLeituraAtual = localStorage.getItem("bibliaTemaLeitura") || "pergaminho";

    // GERENCIAMENTO DE TEMA DE LEITURA (CLARO PERGAMINHO, ESCURO, SÉPIA)
    function aplicarTemaLeitura(tema) {
        temaLeituraAtual = tema;
        try {
            localStorage.setItem("bibliaTemaLeitura", tema);
        } catch (e) {}

        if (leitorTextoContainer) {
            leitorTextoContainer.classList.remove("tema-pergaminho", "tema-escuro", "tema-sepia");
            leitorTextoContainer.classList.add(`tema-${tema}`);
        }

        botoesTemaLeitura.forEach(btn => {
            const ativo = btn.getAttribute("data-tema") === tema;
            btn.classList.toggle("ativo", ativo);
            btn.setAttribute("aria-pressed", String(ativo));
        });
    }

    botoesTemaLeitura.forEach(btn => {
        btn.addEventListener("click", () => {
            const tema = btn.getAttribute("data-tema");
            aplicarTemaLeitura(tema);
            const nomes = { pergaminho: "Pergaminho Claro", escuro: "Noturno Alto Contraste", sepia: "Sépia Confortável" };
            mostrarToast(`Tema alterado para ${nomes[tema] || tema}.`, "info", "🎨");
        });
    });

    aplicarTemaLeitura(temaLeituraAtual);

    function aplicarTamanhoFonteBiblia(percent) {
        tamanhoFonteBibliaPercent = Math.max(80, Math.min(145, percent));
        try {
            localStorage.setItem("bibliaTamanhoFonte", String(tamanhoFonteBibliaPercent));
        } catch (e) {}

        const escalaRem = (1.05 * (tamanhoFonteBibliaPercent / 100)).toFixed(2);
        document.documentElement.style.setProperty("--tamanho-fonte-biblia", `${escalaRem}rem`);
        if (indicadorTamanhoFonte) {
            indicadorTamanhoFonte.textContent = `${tamanhoFonteBibliaPercent}%`;
        }
    }

    aplicarTamanhoFonteBiblia(tamanhoFonteBibliaPercent);

    if (btnAumentarFonte) {
        btnAumentarFonte.addEventListener("click", () => aplicarTamanhoFonteBiblia(tamanhoFonteBibliaPercent + 10));
    }
    if (btnDiminuirFonte) {
        btnDiminuirFonte.addEventListener("click", () => aplicarTamanhoFonteBiblia(tamanhoFonteBibliaPercent - 10));
    }

    async function inicializarLeitorBiblia() {
        try {
            // Se já carregado via script tag (data/biblia-dados.js), usa diretamente sem bloqueio de CORS (funciona em file:/// e http://)
            if (window.BIBLIA_CATOLICA && Array.isArray(window.BIBLIA_CATOLICA.livros)) {
                catalogoLivrosCatolicos = window.BIBLIA_CATOLICA.livros;
            } else {
                const resp = await fetch("data/biblia/livros.json");
                if (!resp.ok) throw new Error("Não foi possível carregar o índice de livros.");
                catalogoLivrosCatolicos = await resp.json();
            }
            
            povoarSelectLivros();
            
            // Seleciona Salmos 23 por padrão
            const livroPadrao = catalogoLivrosCatolicos.find(l => l.id === "salmos") || catalogoLivrosCatolicos[0];
            if (livroPadrao) {
                selecionarLivroECapitulo(livroPadrao.id, 23);
            }
        } catch (e) {
            console.error("Erro ao carregar Bíblia:", e);
            if (leitorVersiculosLista) {
                leitorVersiculosLista.innerHTML = `
                    <div class="leitor-carregando" style="color: #fca5a5;">
                        <span class="carregando-icone">⚠️</span>
                        <p>Não foi possível carregar o leitor bíblico. Atualize a página.</p>
                    </div>
                `;
            }
        }
    }

    function povoarSelectLivros(termoBusca = "") {
        if (!selectLivroBiblia) return;

        const termo = termoBusca.toLowerCase().trim();
        const livrosFiltrados = catalogoLivrosCatolicos.filter(l => {
            const matchTestamento = filtroTestamentoBiblia === "todos" || l.testamento === filtroTestamentoBiblia;
            const matchBusca = !termo || l.nome.toLowerCase().includes(termo);
            return matchTestamento && matchBusca;
        });

        selectLivroBiblia.innerHTML = "";

        if (livrosFiltrados.length === 0) {
            const opt = document.createElement("option");
            opt.textContent = "Nenhum livro encontrado";
            opt.disabled = true;
            selectLivroBiblia.appendChild(opt);
            return;
        }

        // Agrupa por testamento se estiver em 'todos'
        if (filtroTestamentoBiblia === "todos" && !termo) {
            const grupoAT = document.createElement("optgroup");
            grupoAT.label = "Antigo Testamento (46 livros)";
            const grupoNT = document.createElement("optgroup");
            grupoNT.label = "Novo Testamento (27 livros)";

            livrosFiltrados.forEach(livro => {
                const opt = document.createElement("option");
                opt.value = livro.id;
                opt.textContent = `${livro.nome} (${livro.totalCapitulos} caps)`;
                if (livro.testamento === "Antigo Testamento") {
                    grupoAT.appendChild(opt);
                } else {
                    grupoNT.appendChild(opt);
                }
            });

            selectLivroBiblia.appendChild(grupoAT);
            selectLivroBiblia.appendChild(grupoNT);
        } else {
            livrosFiltrados.forEach(livro => {
                const opt = document.createElement("option");
                opt.value = livro.id;
                opt.textContent = `${livro.nome} (${livro.totalCapitulos} caps)`;
                selectLivroBiblia.appendChild(opt);
            });
        }

        if (livroAtualBiblia) {
            selectLivroBiblia.value = livroAtualBiblia.id;
        }
    }

    function povoarSelectCapitulos(totalCapitulos, capituloSelecionado = 1) {
        if (!selectCapituloBiblia) return;
        selectCapituloBiblia.innerHTML = "";

        for (let i = 1; i <= totalCapitulos; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = `${i}`;
            if (i === capituloSelecionado) opt.selected = true;
            selectCapituloBiblia.appendChild(opt);
        }
    }

    async function carregarDadosLivro(slug) {
        // 1. Memória global via script (file:/// e offline)
        if (window.BIBLIA_CATOLICA && window.BIBLIA_CATOLICA.dados && window.BIBLIA_CATOLICA.dados[slug]) {
            return window.BIBLIA_CATOLICA.dados[slug];
        }

        // 2. Cache interno
        if (cacheLivrosBiblia[slug]) {
            return cacheLivrosBiblia[slug];
        }

        // 3. Fetch sob demanda (HTTP/HTTPS)
        const resp = await fetch(`data/biblia/${slug}.json`);
        if (!resp.ok) throw new Error(`Erro ao baixar livro: ${slug}`);
        const data = await resp.json();
        cacheLivrosBiblia[slug] = data;
        return data;
    }

    async function selecionarLivroECapitulo(slug, numCapitulo = 1, rolarAteTexto = false) {
        const livroInfo = catalogoLivrosCatolicos.find(l => l.id === slug);
        if (!livroInfo) return;

        livroAtualBiblia = livroInfo;
        capituloAtualBiblia = Math.max(1, Math.min(livroInfo.totalCapitulos, numCapitulo));

        if (selectLivroBiblia && selectLivroBiblia.value !== slug) {
            selectLivroBiblia.value = slug;
        }

        povoarSelectCapitulos(livroInfo.totalCapitulos, capituloAtualBiblia);

        if (leitorTituloCapitulo) {
            leitorTituloCapitulo.textContent = `${livroInfo.nome} — Capítulo ${capituloAtualBiblia}`;
        }
        if (leitorTestamentoInfo) {
            leitorTestamentoInfo.textContent = `${livroInfo.testamento} • Tradução Católica Ave Maria`;
        }
        if (leitorIndicadorCentro) {
            leitorIndicadorCentro.textContent = `Capítulo ${capituloAtualBiblia} de ${livroInfo.totalCapitulos}`;
        }

        // Atualizar estado dos botões anterior/próximo
        const indiceLivro = catalogoLivrosCatolicos.indexOf(livroInfo);
        const ehPrimeiro = indiceLivro === 0 && capituloAtualBiblia === 1;
        const ehUltimo = indiceLivro === catalogoLivrosCatolicos.length - 1 && capituloAtualBiblia === livroInfo.totalCapitulos;

        if (btnCapituloAnterior) btnCapituloAnterior.disabled = ehPrimeiro;
        if (btnCapituloProximo) btnCapituloProximo.disabled = ehUltimo;

        // Renderiza Versículos
        if (leitorVersiculosLista) {
            leitorVersiculosLista.innerHTML = `
                <div class="leitor-carregando">
                    <span class="carregando-icone">✝</span>
                    <p>Carregando ${escaparHTML(livroInfo.nome)} ${capituloAtualBiblia}...</p>
                </div>
            `;
        }

        // Se a leitura de voz estava tocando, cancela
        if (vozCapituloTocando && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            vozCapituloTocando = false;
            if (btnOuvirCapitulo) btnOuvirCapitulo.querySelector(".btn-texto-curto").textContent = "Ouvir Capítulo";
        }

        try {
            const dadosLivro = await carregarDadosLivro(slug);
            const dadosCapitulo = dadosLivro.capitulos.find(c => c.capitulo === capituloAtualBiblia) || dadosLivro.capitulos[capituloAtualBiblia - 1];

            if (!dadosCapitulo || !dadosCapitulo.versiculos || dadosCapitulo.versiculos.length === 0) {
                leitorVersiculosLista.innerHTML = `<p class="estado-vazio">Nenhum versículo encontrado para este capítulo.</p>`;
                return;
            }

            leitorVersiculosLista.innerHTML = "";

            dadosCapitulo.versiculos.forEach(v => {
                const item = document.createElement("div");
                item.className = "versiculo-item";
                item.setAttribute("data-versiculo", v.versiculo);

                const textoFormatado = escaparHTML(v.texto);

                item.innerHTML = `
                    <span class="num-versiculo" aria-hidden="true">${v.versiculo}</span>
                    <span class="versiculo-texto">${textoFormatado}</span>
                    <div class="versiculo-acoes-hover">
                        <button type="button" class="btn-versiculo-acao btn-copiar-versiculo-individual" title="Copiar este versículo">
                            📋 Copiar
                        </button>
                        <button type="button" class="btn-versiculo-acao btn-anotar-diario" title="Anotar no Diário Bíblico">
                            📝 Anotar
                        </button>
                    </div>
                `;

                // Botão Copiar Versículo Individual
                const btnCopiar = item.querySelector(".btn-copiar-versiculo-individual");
                btnCopiar.addEventListener("click", () => {
                    const textoCopia = `“${v.texto}” — ${livroInfo.nome} ${capituloAtualBiblia}:${v.versiculo} (Bíblia Ave Maria)`;
                    navigator.clipboard.writeText(textoCopia)
                        .then(() => mostrarToast(`Versículo ${v.versiculo} copiado!`, "sucesso", "📋"))
                        .catch(() => mostrarToast("Não foi possível copiar.", "erro"));
                });

                // Botão Anotar no Diário Bíblico
                const btnAnotar = item.querySelector(".btn-anotar-diario");
                btnAnotar.addEventListener("click", () => {
                    if (campoLivro) campoLivro.value = livroInfo.nome;
                    if (campoCapitulo) campoCapitulo.value = capituloAtualBiblia;
                    if (campoAprendizado) {
                        campoAprendizado.value = `“${v.texto}” (${livroInfo.nome} ${capituloAtualBiblia}:${v.versiculo})\n\nReflexão: `;
                        campoAprendizado.focus();
                    }

                    const secaoDiario = document.getElementById("biblia");
                    if (secaoDiario) {
                        secaoDiario.scrollIntoView({ behavior: "smooth" });
                    }
                    mostrarToast(`Passagem enviada para o Diário Bíblico!`, "sucesso", "📝");
                });

                leitorVersiculosLista.appendChild(item);
            });

            if (rolarAteTexto) {
                const secaoLeitor = document.getElementById("leitorTextoContainer");
                if (secaoLeitor) secaoLeitor.scrollIntoView({ behavior: "smooth", block: "start" });
            }

        } catch (erro) {
            console.error("Erro ao carregar versículos:", erro);
            leitorVersiculosLista.innerHTML = `<p class="estado-vazio" style="color: #fca5a5;">Erro ao carregar o texto. Tente novamente.</p>`;
        }
    }

    // Eventos de Seleção
    if (selectLivroBiblia) {
        selectLivroBiblia.addEventListener("change", (e) => {
            selecionarLivroECapitulo(e.target.value, 1);
        });
    }

    if (selectCapituloBiblia) {
        selectCapituloBiblia.addEventListener("change", (e) => {
            if (livroAtualBiblia) {
                selecionarLivroECapitulo(livroAtualBiblia.id, parseInt(e.target.value, 10));
            }
        });
    }

    if (inputBuscaLivro) {
        inputBuscaLivro.addEventListener("input", (e) => {
            povoarSelectLivros(e.target.value);
        });
    }

    // Abas de Testamento
    botoesTabTestamento.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesTabTestamento.forEach(b => {
                b.classList.remove("ativo");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("ativo");
            btn.setAttribute("aria-selected", "true");
            filtroTestamentoBiblia = btn.getAttribute("data-testamento");
            povoarSelectLivros(inputBuscaLivro ? inputBuscaLivro.value : "");
        });
    });

    // Pílulas de Passagens Frequentes
    pillsBibliaRapida.forEach(pill => {
        pill.addEventListener("click", () => {
            const slug = pill.getAttribute("data-slug");
            const cap = parseInt(pill.getAttribute("data-cap"), 10) || 1;
            selecionarLivroECapitulo(slug, cap, true);
            mostrarToast(`Abrindo ${pill.textContent}...`, "info", "📖");
        });
    });

    // Navegação Anterior / Próximo
    if (btnCapituloAnterior) {
        btnCapituloAnterior.addEventListener("click", () => {
            if (!livroAtualBiblia) return;
            if (capituloAtualBiblia > 1) {
                selecionarLivroECapitulo(livroAtualBiblia.id, capituloAtualBiblia - 1, true);
            } else {
                const idx = catalogoLivrosCatolicos.indexOf(livroAtualBiblia);
                if (idx > 0) {
                    const livroAnterior = catalogoLivrosCatolicos[idx - 1];
                    selecionarLivroECapitulo(livroAnterior.id, livroAnterior.totalCapitulos, true);
                }
            }
        });
    }

    if (btnCapituloProximo) {
        btnCapituloProximo.addEventListener("click", () => {
            if (!livroAtualBiblia) return;
            if (capituloAtualBiblia < livroAtualBiblia.totalCapitulos) {
                selecionarLivroECapitulo(livroAtualBiblia.id, capituloAtualBiblia + 1, true);
            } else {
                const idx = catalogoLivrosCatolicos.indexOf(livroAtualBiblia);
                if (idx < catalogoLivrosCatolicos.length - 1) {
                    const proximoLivro = catalogoLivrosCatolicos[idx + 1];
                    selecionarLivroECapitulo(proximoLivro.id, 1, true);
                }
            }
        });
    }

    // Ouvir Capítulo em Áudio
    if (btnOuvirCapitulo && "speechSynthesis" in window) {
        btnOuvirCapitulo.addEventListener("click", () => {
            if (vozCapituloTocando) {
                window.speechSynthesis.cancel();
                vozCapituloTocando = false;
                btnOuvirCapitulo.querySelector(".btn-texto-curto").textContent = "Ouvir Capítulo";
                mostrarToast("Leitura em áudio pausada.", "info");
                return;
            }

            const versiculosEls = leitorVersiculosLista.querySelectorAll(".versiculo-texto");
            if (versiculosEls.length === 0) return;

            const textoCompleto = `${livroAtualBiblia.nome}, capítulo ${capituloAtualBiblia}. ` + 
                Array.from(versiculosEls).map(el => el.textContent).join(" ");

            const utterance = new SpeechSynthesisUtterance(textoCompleto);
            utterance.lang = "pt-BR";
            utterance.rate = 0.95;

            utterance.onstart = () => {
                vozCapituloTocando = true;
                btnOuvirCapitulo.querySelector(".btn-texto-curto").textContent = "Pausar Leitura";
                mostrarToast(`Reproduzindo ${livroAtualBiblia.nome} ${capituloAtualBiblia}...`, "info", "🔊");
            };

            utterance.onend = () => {
                vozCapituloTocando = false;
                btnOuvirCapitulo.querySelector(".btn-texto-curto").textContent = "Ouvir Capítulo";
            };

            utterance.onerror = () => {
                vozCapituloTocando = false;
                btnOuvirCapitulo.querySelector(".btn-texto-curto").textContent = "Ouvir Capítulo";
            };

            window.speechSynthesis.speak(utterance);
        });
    }

    // Copiar Capítulo Inteiro
    if (btnCopiarCapitulo) {
        btnCopiarCapitulo.addEventListener("click", () => {
            if (!livroAtualBiblia) return;
            const versiculosEls = leitorVersiculosLista.querySelectorAll(".versiculo-item");
            if (versiculosEls.length === 0) return;

            let textoCopia = `📖 ${livroAtualBiblia.nome} — Capítulo ${capituloAtualBiblia} (Bíblia Católica Ave Maria)\n\n`;
            versiculosEls.forEach(item => {
                const num = item.querySelector(".num-versiculo").textContent;
                const txt = item.querySelector(".versiculo-texto").textContent;
                textoCopia += `${num}. ${txt}\n`;
            });
            textoCopia += `\nCaminho com Cristo: Fé, Oração e Sagrada Escritura.`;

            navigator.clipboard.writeText(textoCopia)
                .then(() => mostrarToast(`${livroAtualBiblia.nome} ${capituloAtualBiblia} copiado com sucesso!`, "sucesso", "📋"))
                .catch(() => mostrarToast("Não foi possível copiar o capítulo.", "erro"));
        });
    }

    // Inicia o carregamento da Bíblia
    inicializarLeitorBiblia();


    // =========================================================================
    // 7. DIÁRIO DE LEITURA BÍBLICA (MINHA CAMINHADA)
    // =========================================================================
    const campoLivro = document.getElementById("livro");
    const campoCapitulo = document.getElementById("capitulo");
    const campoAprendizado = document.getElementById("aprendizado");
    const botaoSalvarLeitura = document.getElementById("salvarLeitura");
    const botaoCancelarEdicaoLeitura = document.getElementById("cancelarEdicaoLeitura");
    const listaLeituras = document.getElementById("listaLeituras");
    const buscaLeituras = document.getElementById("buscaLeituras");
    const contagemLeituras = document.getElementById("contagemLeituras");
    const statLeituras = document.getElementById("statLeituras");
    const tituloFormLeitura = document.getElementById("tituloFormLeitura");

    let leituras = carregarDados("leiturasBiblicas");
    let indiceEdicaoLeitura = null;

    // Atalhos de Livros Bíblicos
    document.querySelectorAll(".pill-livro").forEach(pill => {
        pill.addEventListener("click", () => {
            if (campoLivro) {
                campoLivro.value = pill.getAttribute("data-livro");
                if (campoCapitulo) campoCapitulo.focus();
            }
        });
    });

    function renderizarLeituras(termoBusca = "") {
        if (!listaLeituras) return;

        const termo = termoBusca.toLowerCase().trim();
        const itensFiltrados = leituras.filter(item => {
            if (!termo) return true;
            return (item.livro && item.livro.toLowerCase().includes(termo)) ||
                   (item.aprendizado && item.aprendizado.toLowerCase().includes(termo));
        });

        if (contagemLeituras) contagemLeituras.textContent = leituras.length;
        if (statLeituras) statLeituras.textContent = leituras.length;

        if (itensFiltrados.length === 0) {
            listaLeituras.innerHTML = `
                <div class="estado-vazio">
                    <div class="estado-vazio-icone">📖</div>
                    <p>${termo ? "Nenhuma leitura encontrada com esse termo." : "Nenhuma leitura registrada ainda. Adicione sua primeira reflexão acima!"}</p>
                </div>
            `;
            return;
        }

        listaLeituras.innerHTML = "";

        itensFiltrados.forEach((item, indexOriginal) => {
            // Localiza o índice real no array original
            const indiceReal = leituras.indexOf(item);
            const card = document.createElement("div");
            card.className = "registro-card";

            card.innerHTML = `
                <div class="registro-cabecalho">
                    <h4 class="registro-titulo">${escaparHTML(item.livro)} — Cap. ${escaparHTML(item.capitulo)}</h4>
                    <div class="registro-meta-tags">
                        <span class="badge-tag">${escaparHTML(item.data || "Leitura salva")}</span>
                    </div>
                </div>
                <p class="registro-texto">${escaparHTML(item.aprendizado)}</p>
                <div class="registro-acoes">
                    <button type="button" class="btn-card-acao btn-card-editar" data-indice="${indiceReal}">
                        ✎ Editar
                    </button>
                    <button type="button" class="btn-card-acao btn-card-excluir" data-indice="${indiceReal}">
                        🗑 Excluir
                    </button>
                </div>
            `;

            listaLeituras.appendChild(card);
        });

        // Eventos nos botões
        listaLeituras.querySelectorAll(".btn-card-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                iniciarEdicaoLeitura(idx);
            });
        });

        listaLeituras.querySelectorAll(".btn-card-excluir").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                const item = leituras[idx];
                const nome = item ? `${item.livro} ${item.capitulo}` : "esta leitura";
                
                abrirModalConfirmacao(
                    "Excluir Leitura",
                    `Deseja realmente remover o registro bíblico de ${nome}?`,
                    () => {
                        if (indiceEdicaoLeitura === idx) cancelarEdicaoLeitura();
                        leituras.splice(idx, 1);
                        salvarDados("leiturasBiblicas", leituras);
                        renderizarLeituras(buscaLeituras ? buscaLeituras.value : "");
                        mostrarToast("Leitura excluída com sucesso.", "info");
                    },
                    "🗑️"
                );
            });
        });
    }

    function iniciarEdicaoLeitura(indice) {
        const item = leituras[indice];
        if (!item) return;

        indiceEdicaoLeitura = indice;
        if (campoLivro) campoLivro.value = item.livro;
        if (campoCapitulo) campoCapitulo.value = item.capitulo;
        if (campoAprendizado) campoAprendizado.value = item.aprendizado;

        if (tituloFormLeitura) tituloFormLeitura.textContent = "Editar Leitura Bíblica";
        if (botaoSalvarLeitura) botaoSalvarLeitura.textContent = "Salvar alterações";
        if (botaoCancelarEdicaoLeitura) botaoCancelarEdicaoLeitura.style.display = "inline-flex";

        campoLivro.focus();
        campoLivro.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function cancelarEdicaoLeitura() {
        indiceEdicaoLeitura = null;
        if (campoLivro) campoLivro.value = "";
        if (campoCapitulo) campoCapitulo.value = "";
        if (campoAprendizado) campoAprendizado.value = "";

        if (tituloFormLeitura) tituloFormLeitura.textContent = "Nova Leitura Bíblica";
        if (botaoSalvarLeitura) botaoSalvarLeitura.textContent = "Salvar leitura no diário";
        if (botaoCancelarEdicaoLeitura) botaoCancelarEdicaoLeitura.style.display = "none";
    }

    if (botaoCancelarEdicaoLeitura) {
        botaoCancelarEdicaoLeitura.addEventListener("click", cancelarEdicaoLeitura);
    }

    if (botaoSalvarLeitura) {
        botaoSalvarLeitura.addEventListener("click", () => {
            const livro = campoLivro ? campoLivro.value.trim() : "";
            const capitulo = campoCapitulo ? campoCapitulo.value.trim() : "";
            const aprendizado = campoAprendizado ? campoAprendizado.value.trim() : "";

            if (!livro || !capitulo || !aprendizado) {
                mostrarToast("Preencha todos os campos da leitura antes de salvar.", "erro");
                return;
            }

            if (indiceEdicaoLeitura !== null && leituras[indiceEdicaoLeitura]) {
                leituras[indiceEdicaoLeitura].livro = livro;
                leituras[indiceEdicaoLeitura].capitulo = capitulo;
                leituras[indiceEdicaoLeitura].aprendizado = aprendizado;
                mostrarToast("Leitura bíblica atualizada com sucesso!", "sucesso", "📖");
            } else {
                const novaLeitura = {
                    livro,
                    capitulo,
                    aprendizado,
                    data: obterDataHoje()
                };
                leituras.unshift(novaLeitura);
                mostrarToast("Leitura guardada no seu diário espiritual!", "sucesso", "✨");
            }

            salvarDados("leiturasBiblicas", leituras);
            cancelarEdicaoLeitura();
            renderizarLeituras(buscaLeituras ? buscaLeituras.value : "");
        });
    }

    if (buscaLeituras) {
        buscaLeituras.addEventListener("input", (e) => {
            renderizarLeituras(e.target.value);
        });
    }


    // =========================================================================
    // 7. MURAL DE ORAÇÕES (PEDIDOS & GRAÇAS ALCANÇADAS)
    // =========================================================================
    const campoPedidoOracao = document.getElementById("pedidoOracao");
    const selectCategoriaOracao = document.getElementById("categoriaOracao");
    const botaoSalvarOracao = document.getElementById("salvarOracao");
    const botaoCancelarEdicaoOracao = document.getElementById("cancelarEdicaoOracao");
    const listaOracoes = document.getElementById("listaOracoes");
    const contagemOracoes = document.getElementById("contagemOracoes");
    const statOracoes = document.getElementById("statOracoes");
    const statGracas = document.getElementById("statGracas");
    const tituloFormOracao = document.getElementById("tituloFormOracao");
    const botoesFiltroOracao = document.querySelectorAll(".btn-filtro-oracao");

    let oracoes = carregarDados("oracoes");
    let indiceEdicaoOracao = null;
    let filtroOracaoAtual = "todas";

    botoesFiltroOracao.forEach(btn => {
        btn.addEventListener("click", () => {
            botoesFiltroOracao.forEach(b => {
                b.classList.remove("ativo");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("ativo");
            btn.setAttribute("aria-selected", "true");
            filtroOracaoAtual = btn.getAttribute("data-filtro");
            renderizarOracoes();
        });
    });

    function renderizarOracoes() {
        if (!listaOracoes) return;

        const totalGracas = oracoes.filter(o => o.atendida).length;
        if (contagemOracoes) contagemOracoes.textContent = oracoes.length;
        if (statOracoes) statOracoes.textContent = oracoes.length;
        if (statGracas) statGracas.textContent = totalGracas;

        const oracoesFiltradas = oracoes.filter(o => {
            if (filtroOracaoAtual === "em_oracao") return !o.atendida;
            if (filtroOracaoAtual === "graca_alcancada") return o.atendida;
            return true;
        });

        if (oracoesFiltradas.length === 0) {
            listaOracoes.innerHTML = `
                <div class="estado-vazio">
                    <div class="estado-vazio-icone">🙏</div>
                    <p>${filtroOracaoAtual === "graca_alcancada" 
                        ? "Nenhuma graça marcada ainda. Continue orando e confie no agir de Deus!" 
                        : "Nenhuma oração registrada nesta categoria."}</p>
                </div>
            `;
            return;
        }

        listaOracoes.innerHTML = "";

        oracoesFiltradas.forEach(item => {
            const indiceReal = oracoes.indexOf(item);
            const card = document.createElement("div");
            card.className = `registro-card ${item.atendida ? "graca-alcancada" : ""}`;

            card.innerHTML = `
                <div class="registro-cabecalho">
                    <h4 class="registro-titulo">
                        ${item.atendida ? "✓ GRAÇA ALCANÇADA" : "🕯️ EM ORAÇÃO"}
                    </h4>
                    <div class="registro-meta-tags">
                        <span class="badge-tag badge-categoria">${escaparHTML(item.categoria || "Geral")}</span>
                        <span class="badge-tag">${escaparHTML(item.data || "Registrado")}</span>
                    </div>
                </div>
                <p class="registro-texto">${escaparHTML(item.texto)}</p>
                <div class="registro-acoes">
                    <button type="button" class="btn-card-acao btn-card-status" data-indice="${indiceReal}">
                        ${item.atendida ? "↺ Retornar para oração" : "✓ Marcar como graça alcançada"}
                    </button>
                    <button type="button" class="btn-card-acao btn-card-editar" data-indice="${indiceReal}">
                        ✎ Editar
                    </button>
                    <button type="button" class="btn-card-acao btn-card-excluir" data-indice="${indiceReal}">
                        🗑 Excluir
                    </button>
                </div>
            `;

            listaOracoes.appendChild(card);
        });

        // Eventos nos botões das orações
        listaOracoes.querySelectorAll(".btn-card-status").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                alternarStatusOracao(idx);
            });
        });

        listaOracoes.querySelectorAll(".btn-card-editar").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                iniciarEdicaoOracao(idx);
            });
        });

        listaOracoes.querySelectorAll(".btn-card-excluir").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-indice"), 10);
                abrirModalConfirmacao(
                    "Excluir Oração",
                    "Deseja realmente remover esta oração do seu mural?",
                    () => {
                        if (indiceEdicaoOracao === idx) cancelarEdicaoOracao();
                        oracoes.splice(idx, 1);
                        salvarDados("oracoes", oracoes);
                        renderizarOracoes();
                        mostrarToast("Oração removida com sucesso.", "info");
                    },
                    "🗑️"
                );
            });
        });
    }

    function alternarStatusOracao(indice) {
        if (!oracoes[indice]) return;
        oracoes[indice].atendida = !oracoes[indice].atendida;
        salvarDados("oracoes", oracoes);
        renderizarOracoes();

        if (oracoes[indice].atendida) {
            mostrarToast("Glória a Deus! Oração marcada como Graça Alcançada!", "sucesso", "🎉");
        } else {
            mostrarToast("Oração mantida com fé no altar.", "info", "🕯️");
        }
    }

    function iniciarEdicaoOracao(indice) {
        const item = oracoes[indice];
        if (!item) return;

        indiceEdicaoOracao = indice;
        if (campoPedidoOracao) campoPedidoOracao.value = item.texto;
        if (selectCategoriaOracao) selectCategoriaOracao.value = item.categoria || "Espiritualidade";

        if (tituloFormOracao) tituloFormOracao.textContent = "Editar Oração";
        if (botaoSalvarOracao) botaoSalvarOracao.textContent = "Salvar alterações";
        if (botaoCancelarEdicaoOracao) botaoCancelarEdicaoOracao.style.display = "inline-flex";

        campoPedidoOracao.focus();
        campoPedidoOracao.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function cancelarEdicaoOracao() {
        indiceEdicaoOracao = null;
        if (campoPedidoOracao) campoPedidoOracao.value = "";
        if (tituloFormOracao) tituloFormOracao.textContent = "Apresentar Nova Oração";
        if (botaoSalvarOracao) botaoSalvarOracao.textContent = "Colocar em oração";
        if (botaoCancelarEdicaoOracao) botaoCancelarEdicaoOracao.style.display = "none";
    }

    if (botaoCancelarEdicaoOracao) {
        botaoCancelarEdicaoOracao.addEventListener("click", cancelarEdicaoOracao);
    }

    if (botaoSalvarOracao) {
        botaoSalvarOracao.addEventListener("click", () => {
            const texto = campoPedidoOracao ? campoPedidoOracao.value.trim() : "";
            const categoria = selectCategoriaOracao ? selectCategoriaOracao.value : "Espiritualidade";

            if (!texto) {
                mostrarToast("Por favor, escreva sua oração antes de salvar.", "erro");
                return;
            }

            if (indiceEdicaoOracao !== null && oracoes[indiceEdicaoOracao]) {
                oracoes[indiceEdicaoOracao].texto = texto;
                oracoes[indiceEdicaoOracao].categoria = categoria;
                mostrarToast("Oração atualizada com sucesso!", "sucesso", "🙏");
            } else {
                const novaOracao = {
                    texto,
                    categoria,
                    atendida: false,
                    data: obterDataHoje()
                };
                oracoes.unshift(novaOracao);
                mostrarToast("Sua oração foi colocada diante de Deus com fé!", "sucesso", "🙏");
            }

            salvarDados("oracoes", oracoes);
            cancelarEdicaoOracao();
            renderizarOracoes();
        });
    }


    // =========================================================================
    // 8. BACKUP & RESTAURAÇÃO DE DADOS (JSON EXPORT / IMPORT)
    // =========================================================================
    const btnExportarBackup = document.getElementById("btnExportarBackup");
    const inputImportarBackup = document.getElementById("inputImportarBackup");

    if (btnExportarBackup) {
        btnExportarBackup.addEventListener("click", () => {
            const dadosBackup = {
                versao: "2026.1",
                app: "Caminho com Cristo",
                dataExportacao: new Date().toISOString(),
                leiturasBiblicas: leituras,
                oracoes: oracoes
            };

            const jsonStr = JSON.stringify(dadosBackup, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.download = `caminho-com-cristo-backup-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);

            mostrarToast("Backup exportado com sucesso para seu dispositivo!", "sucesso", "📥");
        });
    }

    if (inputImportarBackup) {
        inputImportarBackup.addEventListener("change", (e) => {
            const arquivo = e.target.files[0];
            if (!arquivo) return;

            const leitor = new FileReader();
            leitor.onload = (evento) => {
                try {
                    const dados = JSON.parse(evento.target.result);
                    if (!dados.leiturasBiblicas && !dados.oracoes) {
                        throw new Error("Arquivo de backup inválido.");
                    }

                    abrirModalConfirmacao(
                        "Restaurar Backup",
                        "Deseja importar este backup? Os dados existentes serão combinados com segurança.",
                        () => {
                            if (Array.isArray(dados.leiturasBiblicas)) {
                                leituras = dados.leiturasBiblicas;
                                salvarDados("leiturasBiblicas", leituras);
                            }
                            if (Array.isArray(dados.oracoes)) {
                                oracoes = dados.oracoes;
                                salvarDados("oracoes", oracoes);
                            }

                            renderizarLeituras();
                            renderizarOracoes();
                            mostrarToast("Backup restaurado com êxito!", "sucesso", "📤");
                        },
                        "📤"
                    );
                } catch (erro) {
                    mostrarToast("Erro ao ler o arquivo de backup. Verifique o formato.", "erro");
                }
            };
            leitor.readAsText(arquivo);
            inputImportarBackup.value = "";
        });
    }


    // =========================================================================
    // 9. FUNÇÕES DE PERSISTÊNCIA LOCAL (LOCALSTORAGE SEGURO)
    // =========================================================================
    function carregarDados(chave) {
        try {
            const valor = localStorage.getItem(chave);
            return valor ? JSON.parse(valor) : [];
        } catch (e) {
            console.warn(`Aviso ao ler ${chave} do localStorage:`, e);
            return [];
        }
    }

    function salvarDados(chave, dados) {
        try {
            localStorage.setItem(chave, JSON.stringify(dados));
        } catch (e) {
            console.error(`Erro ao salvar ${chave} no localStorage:`, e);
            mostrarToast("Aviso: o armazenamento local pode estar restrito.", "erro");
        }
    }

    // Inicialização da interface
    renderizarLeituras();
    renderizarOracoes();

});
