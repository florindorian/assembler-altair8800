import Translator from "./Translator.js";

const bt_traduzir = document.getElementById("bt-traduzir");
const input_area = document.getElementById("input-area");
const output_area = document.getElementById("output-area");

// Evento de clique do botão "Traduzir": Traduz o código da textarea de entrada para o machine code do Altair8800
bt_traduzir.onclick = () => {
    const translator = new Translator();
    let linhas = input_area.value.split("\n");
    let machineCode = translator.traduzir(linhas);
    output_area.textContent = machineCode;
}