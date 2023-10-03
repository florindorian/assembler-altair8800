import Translator from "./Translator.js";

const input_area = document.getElementById("input-area");
const output_area = document.getElementById("output-area");
const bt_traduzir = document.getElementById("bt-traduzir");
const bt_copy = document.getElementById("bt-copy");
const bt_cleanAll = document.getElementById("bt-cleanAll");

// Evento de clique do botão "Traduzir": Traduz o código da textarea de entrada para o machine code do Altair8800
bt_traduzir.onclick = () => {
    const translator = new Translator();
    let linhas = input_area.value.split("\n");
    let machineCode = translator.traduzir(linhas);
    output_area.textContent = machineCode;
}

bt_copy.onclick = () => {
    let machineCode = output_area.textContent;
    navigator.clipboard.writeText(machineCode);
    alert("Machine code copied to clipboard!");
}

bt_cleanAll.onclick = () => {
    input_area.value = "";
    output_area.value = "";
}