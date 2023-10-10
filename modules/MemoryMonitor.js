export default class MemoryMonitor {
    // Instruction Location Counter (ILC) aqui foi definido como Next Void Address (NVA)
    #nextVoidAddress
    // Tabela de Símbolos
    #references

    constructor() {
        this.#nextVoidAddress = 0;
        this.#references = {};
    }

    atualizarNVA (linhaHex) {
        let bytes = linhaHex.split(" ");
        let parcelaCorrecao = 0;
        for (let byte of bytes) {
            if (byte.match(/^[0-9A-F]{2}$/) === null) {
                parcelaCorrecao = 1;
            }
        }
        this.#nextVoidAddress += bytes.length + parcelaCorrecao;
    }

    registrarLabel(label) {
        // Obtém a posição do próximo endereço vazio e converte para hexadecimal
        let endHex = this.#nextVoidAddress.toString(16).toUpperCase();

        // Ajusta o valor do endereço em hexadecimal para o formato HHHH, onde H é um algarismo hexadecimal
        if (this.#nextVoidAddress < 16) {
            endHex = "000" + endHex;
        } else if (this.#nextVoidAddress < 16**2) {
            endHex = "00" + endHex;
        } else if (this.#nextVoidAddress < 16**3) {
            endHex = "0" + endHex;
        }
        // Inverte o padrão hblb e transforma em: lb hb (hb: high byte; lb: low byte)
        let endInvertido = endHex.replace(endHex, endHex.substring(2) + ' ' + endHex.substring(0, 2));
        this.#references[label] = endInvertido;
    }

    // ACESSOR METHODS
    get nextVoidAddress() {
        return this.#nextVoidAddress;
    }

    get references() {
        return this.#references;
    }
}