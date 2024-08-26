window.onload = function() {
    const grammarSelect = document.getElementById("grammar");
    const resultDiv = document.getElementById("generatedSentence");

    function parseGrammar(grammarString) {
        const [startSymbol, productionsString] = grammarString.split("::=").map(s => s.trim());
        const productions = {};
        
        productionsString.split("|").forEach(production => {
            const parts = production.trim().split(" ");
            const left = startSymbol;
            if (!productions[left]) {
                productions[left] = [];
            }
            productions[left].push(parts.join(" "));
        });

        return { startSymbol, productions };
    }

    function isTerminal(symbol, productions) {
        return !productions[symbol];
    }

    function generateSentence(grammar) {
        let stack = [grammar.startSymbol];
        let output = "";
        let iterationLimit = 100;
        let iterations = 0;

        while (stack.length > 0) {
            if (iterations++ > iterationLimit) {
                console.warn("Limite de iterações atingido. A derivação foi interrompida.");
                break;
            }

            let top = stack.pop();
            console.log("Elemento no topo da pilha:", top);

            if (isTerminal(top, grammar.productions)) {
                output += top;
                console.log(top, "é terminal, adicionando à saída");
            } else {
                let productionOptions = grammar.productions[top];
                if (productionOptions) {
                    let randomIndex = Math.floor(Math.random() * productionOptions.length);
                    let chosenProduction = productionOptions[randomIndex];
                    console.log("Produção não-terminal escolhida:", chosenProduction);

                    for (let i = chosenProduction.length - 1; i >= 0; i--) {
                        stack.push(chosenProduction[i]);
                    }
                } else {
                    console.error("Nenhuma produção encontrada para o não-terminal:", top);
                }
            }
        }

        return output;
    }

    document.getElementById("generateSentence").onclick = function() {
        const selectedGrammar = grammarSelect.value;
        const parsedGrammar = parseGrammar(selectedGrammar);
        const generatedSentence = generateSentence(parsedGrammar);
        resultDiv.textContent = generatedSentence;
    };
};
