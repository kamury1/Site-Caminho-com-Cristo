const botaoReflexao = document.querySelector(".botao-reflexao");
const reflexaoCompleta = document.querySelector(".reflexao-completa");

botaoReflexao.addEventListener("click", function () {

    reflexaoCompleta.classList.toggle("aberta");

    if (reflexaoCompleta.classList.contains("aberta")) {
        botaoReflexao.textContent = "Fechar reflexão ↑";
    } else {
        botaoReflexao.textContent = "Ler reflexão →";
    }

});

const botaoSalvar = document.querySelector("#salvarLeitura");
const campoLivro = document.querySelector("#livro");
const campoCapitulo = document.querySelector("#capitulo");
const campoAprendizado = document.querySelector("#aprendizado");
const listaLeituras = document.querySelector("#listaLeituras");

let leituras = JSON.parse(localStorage.getItem("leiturasBiblicas")) || [];

function mostrarLeituras() {

    if (leituras.length === 0) {
        listaLeituras.innerHTML = `
            <p class="sem-leituras">
                Nenhuma leitura registrada ainda.
            </p>
        `;
        return;
    }

    listaLeituras.innerHTML = "";

leituras.forEach(function (leitura, indice) {

    listaLeituras.innerHTML += `
<div class="leitura-registrada">
    <h4>${leitura.livro} — Capítulo ${leitura.capitulo}</h4>
    <p>${leitura.aprendizado}</p>

    <button class="botao-editar" onclick="editarLeitura(${indice})">
        Editar
    </button>

    <button class="botao-excluir" onclick="excluirLeitura(${indice})">
        Excluir
    </button>
</div>
    `;

});


}

botaoSalvar.addEventListener("click", function () {

    const livro = campoLivro.value.trim();
    const capitulo = campoCapitulo.value.trim();
    const aprendizado = campoAprendizado.value.trim();

    if (livro === "" || capitulo === "" || aprendizado === "") {
        alert("Preencha todos os campos antes de salvar.");
        return;
    }

    const novaLeitura = {
        livro: livro,
        capitulo: capitulo,
        aprendizado: aprendizado
    };

    leituras.push(novaLeitura);

    localStorage.setItem(
        "leiturasBiblicas",
        JSON.stringify(leituras)
    );

    mostrarLeituras();

    campoLivro.value = "";
    campoCapitulo.value = "";
    campoAprendizado.value = "";
});

mostrarLeituras();

function excluirLeitura(indice) {

    leituras.splice(indice, 1);

    localStorage.setItem(
        "leiturasBiblicas",
        JSON.stringify(leituras)
    );

    mostrarLeituras();
}

function editarLeitura(indice) {

    const leitura = leituras[indice];

    campoLivro.value = leitura.livro;
    campoCapitulo.value = leitura.capitulo;
    campoAprendizado.value = leitura.aprendizado;

    leituras.splice(indice, 1);

    localStorage.setItem(
        "leiturasBiblicas",
        JSON.stringify(leituras)
    );

    mostrarLeituras();

    campoLivro.focus();
}

const botaoSalvarOracao = document.querySelector("#salvarOracao");
const campoPedidoOracao = document.querySelector("#pedidoOracao");
const listaOracoes = document.querySelector("#listaOracoes");

let oracoes = JSON.parse(localStorage.getItem("oracoes")) || [];

function mostrarOracoes() {

    if (oracoes.length === 0) {
        listaOracoes.innerHTML = `
            <p class="sem-oracoes">
                Nenhuma oração registrada ainda.
            </p>
        `;
        return;
    }

    listaOracoes.innerHTML = "";

    oracoes.forEach(function (oracao, indice) {

        listaOracoes.innerHTML += `
            <div class="oracao-registrada ${oracao.atendida ? "oracao-atendida" : ""}">
                <p>${oracao.texto}</p>

                <button onclick="marcarOracaoAtendida(${indice})">
                    ${oracao.atendida ? "Graça alcançada 🙏" : "Marcar como atendida"}
                </button>

                <button onclick="excluirOracao(${indice})">
                    Excluir
                </button>
            </div>
        `;
    });
}

botaoSalvarOracao.addEventListener("click", function () {

    const texto = campoPedidoOracao.value.trim();

    if (texto === "") {
        alert("Escreva seu pedido de oração antes de salvar.");
        return;
    }

    const novaOracao = {
        texto: texto,
        atendida: false
    };

    oracoes.push(novaOracao);

    localStorage.setItem(
        "oracoes",
        JSON.stringify(oracoes)
    );

    campoPedidoOracao.value = "";

    mostrarOracoes();
});

function marcarOracaoAtendida(indice) {

    oracoes[indice].atendida = !oracoes[indice].atendida;

    localStorage.setItem(
        "oracoes",
        JSON.stringify(oracoes)
    );

    mostrarOracoes();
}

function excluirOracao(indice) {

    oracoes.splice(indice, 1);

    localStorage.setItem(
        "oracoes",
        JSON.stringify(oracoes)
    );

    mostrarOracoes();
}

mostrarOracoes();