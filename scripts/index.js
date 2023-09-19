import Translator from "./Translator.js";

const bt_traduzir = document.getElementById("bt-traduzir");
const input_area = document.getElementById("input-area");
const output_area = document.getElementById("output-area");

bt_traduzir.onclick = () => {
    const translator = new Translator();
    let linhas = input_area.value.split("\n");
    let codigoMaquina = '';
    
    for (let linha of linhas) {
        codigoMaquina += translator.traduzir(linha) + ' ';
    }
    output_area.textContent = codigoMaquina;
}