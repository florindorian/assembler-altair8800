export default class MemoryMonitor {
    #nextVoidAdrress
    #references

    constructor() {
        this.#nextVoidAdrress = 0;
        this.#references = {};
    }

    observar (linhaHex) {
        let bytes = linhaHex.split(" ");
        let parcelaCorrecao = 0;
        for (let byte of bytes) {
            if (byte.match(/^[0-9A-F]{2}$/) === null) {
                parcelaCorrecao = 1;
            }
        }
        this.#nextVoidAdrress += bytes.length + parcelaCorrecao;
    }

    linkarLabel(label) {
        // Obtém a posição do próximo endereço vazio e converte para hexadecimal
        let endHex = this.#nextVoidAdrress.toString(16).toUpperCase();

        // Ajusta o valor do endereço em hexadecimal para o formato HHHH, onde H é um algarismo hexadecimal
        if (this.#nextVoidAdrress < 16) {
            endHex = "000" + endHex;
        } else if (this.#nextVoidAdrress < 16**2) {
            endHex = "00" + endHex;
        } else if (this.#nextVoidAdrress < 16**3) {
            endHex = "0" + endHex;
        }
        // Inverte o padrão hblb e transforma em: lb hb (hb: high byte; lb: low byte)
        let endInvertido = endHex.replace(endHex, endHex.substring(2) + ' ' + endHex.substring(0, 2));
        this.#references[label] = endInvertido;
    }

    // ACESSOR METHODS
    get nextVoidAddress() {
        return this.#nextVoidAdrress;
    }

    get references() {
        return this.#references;
    }
}