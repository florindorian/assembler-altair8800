import Assembler from "../modules/Assembler.js";

const input_area = document.getElementById("input-area");
const output_area = document.getElementById("output-area");
const bt_assemble = document.getElementById("bt-assemble");
const bt_translateToHex = document.getElementById("bt-translateToHex");
const bt_copy = document.getElementById("bt-copy");
const bt_cleanAll = document.getElementById("bt-cleanAll");

// Evento de clique do botão "Assemble": Traduz o código da textarea de entrada para o machine code do Altair8800
bt_assemble.addEventListener("click",() => {
    const assembler = new Assembler();
    let linhas = input_area.value.split("\n");
    let machineCodeBin = assembler.assemble(linhas);
    output_area.textContent = machineCodeBin;
});

// Evento de clique do botão "Translate to Hex": Traduz o código da textarea de entrada para o machine code do Altair8800 em hexadecimal
bt_translateToHex.addEventListener("click", () => {
    const assembler = new Assembler();
    let linhas = input_area.value.split("\n");
    let machineCodeHex = assembler.translateToHex(linhas);
    output_area.textContent = machineCodeHex;
});

bt_copy.addEventListener("click", () => {
    let machineCodeHex = output_area.textContent;
    navigator.clipboard.writeText(machineCodeHex);
    alert("Machine code copied to clipboard!");
});

bt_cleanAll.addEventListener("click", () => {
    input_area.value = "";
    output_area.textContent = "";
});