// Array para armazenar os nomes dos amigos
let amigos = [];

function adicionarAmigo() {
    const input = document.getElementById('amigo');
    const nome = input.value.trim();
    
    // Validações
    if (nome === '') {
        alert('Por favor, digite um nome válido!');
        return;
    }
    
    if (amigos.includes(nome)) {
        alert('Este nome já foi adicionado!');
        input.value = '';
        return;
    }
    
    // Adiciona o nome ao array
    amigos.push(nome);
    
    // Limpa o input
    input.value = '';
    
    // Atualiza a lista visual
    atualizarLista();
    
    // Limpa resultados anteriores
    limparResultados();
}

function atualizarLista() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    
    amigos.forEach((nome, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${nome}</span>
            <button onclick="removerAmigo(${index})" class="button-remove" aria-label="Remover ${nome}">
                ❌
            </button>
        `;
        lista.appendChild(li);
    });
}

function removerAmigo(index) {
    const nomeRemovido = amigos[index];
    amigos.splice(index, 1);
    atualizarLista();
    limparResultados();
    
    // Feedback visual
    console.log(`${nomeRemovido} foi removido da lista`);
}

function sortearAmigo() {
    const resultado = document.getElementById('resultado');
    
    // Validação: precisa ter pelo menos 2 pessoas
    if (amigos.length < 2) {
        alert('É necessário pelo menos 2 amigos para fazer o sorteio!');
        return;
    }
    
    // Limpa resultados anteriores
    resultado.innerHTML = '';
    
    // Realiza o sorteio
    const pares = realizarSorteio();
    
    // Exibe os resultados
    exibirResultados(pares);
}

function realizarSorteio() {
    let tentativas = 0;
    const maxTentativas = 100;
    
    while (tentativas < maxTentativas) {
        const embaralhados = [...amigos];
        
        // Algoritmo Fisher-Yates para embaralhar
        for (let i = embaralhados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [embaralhados[i], embaralhados[j]] = [embaralhados[j], embaralhados[i]];
        }
        
        // Verifica se alguém tirou a si mesmo
        let sorteioValido = true;
        for (let i = 0; i < amigos.length; i++) {
            if (amigos[i] === embaralhados[i]) {
                sorteioValido = false;
                break;
            }
        }
        
        if (sorteioValido) {
            // Cria os pares
            const pares = amigos.map((pessoa, index) => ({
                pessoa: pessoa,
                amigoSecreto: embaralhados[index]
            }));
            return pares;
        }
        
        tentativas++;
    }
    
    // Se não conseguir após muitas tentativas, usa método alternativo
    return sorteioAlternativo();
}

function sorteioAlternativo() {
    const pares = [];
    const disponiveis = [...amigos];
    
    for (let i = 0; i < amigos.length; i++) {
        const pessoa = amigos[i];
        let opcoes = disponiveis.filter(nome => nome !== pessoa);
        
        // Se é a última pessoa e só sobrou ela mesma, troca com o anterior
        if (opcoes.length === 0) {
            const ultimoPar = pares[pares.length - 1];
            pares[pares.length - 1] = { pessoa: ultimoPar.pessoa, amigoSecreto: pessoa };
            pares.push({ pessoa: pessoa, amigoSecreto: ultimoPar.amigoSecreto });
            break;
        }
        
        const indiceEscolhido = Math.floor(Math.random() * opcoes.length);
        const amigoEscolhido = opcoes[indiceEscolhido];
        
        pares.push({ pessoa: pessoa, amigoSecreto: amigoEscolhido });
        
        // Remove o escolhido da lista de disponíveis
        const indiceRemover = disponiveis.indexOf(amigoEscolhido);
        disponiveis.splice(indiceRemover, 1);
    }
    
    return pares;
}

function exibirResultados(pares) {
    const resultado = document.getElementById('resultado');
    
    pares.forEach(par => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${par.pessoa}</strong> → ${par.amigoSecreto}`;
        resultado.appendChild(li);
    });
    
    // Scroll suave até os resultados
    resultado.scrollIntoView({ behavior: 'smooth' });
}

function limparResultados() {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';
}

// Permite adicionar nomes com a tecla Enter
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('amigo');
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarAmigo();
        }
    });
    
    // Foco inicial no input
    input.focus();
});
