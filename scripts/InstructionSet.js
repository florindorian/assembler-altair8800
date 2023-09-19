export default class InstructionSet {
    #regex = [
        // Instrução com 1 campo
        /^([A-Z]{2,4})$/,
        // Instrução com 2 campos, sendo que a inicial do primeiro campo é J, C ou R e o complemento é NZ|Z|NC|C|PO|PE|P|M
        /^((?:J|C|R))((?:NZ|Z|NC|C|PO|PE|P|M)) ([0-9A-Z]{4})$/,
        // Instrução com 2 campos genéricos
        /^([A-Z]{2,4}) ([0-9A-Z]{1,})$/,
        // Instrução com 3 campos, sendo que os dois últimos são separados por vírgula
        /^([A-Z]{2,4}) ([0-9A-Z]{1,}),([0-9A-Z]{1,})$/
    ];

    #mnemonics = {
        // 'mnemonic': rule
        'MOV': ['DDD,SSS', '01DDDSSS'],
        'MVI': ['DDD,db', '00DDD110 db'],
        'LXI': ['RP,lb hb', '00RP0001 lb hb'],
        'STA': ['lb hb', '00110010 lb hb'],
        'J': ['ccc,lb hb', '11ccc010 lb hb'],
        'ANI': ['db', '11100110 db'],
        'RST': ['nnn', '11nnn111'],
        'IN': ['pa', '11011011 pa'],
        'RET': ['', '11001001'],
        'HLT': ['', '01110110'],
        'INR': ['DDD', '00DDD100'],
        'LDA': ['lb hb', '00111010 lb hb'],
        'ADD': ['SSS', '10000SSS']
    }

    #registers = {
        'A': '111',
        'B': '000',
        'C': '001',
        'D': '010',
        'E': '011',
        'H': '100',
        'L': '101',
        'M': '110'
    }

    #regPairs = {
        'BC': '00',
        'DE': '01',
        'HL': '10',
        'SP': '11'
    }

    #conditions = {
        'NZ': '000',
        'Z': '001',
        'NC': '010',
        'C': '011',
        'PO': '100',
        'PE': '101',
        'P': '110',
        'M': '111'
    }

    constructor() {}

    // ACCESSOR METHODS
    get regex() {
        return this.#regex;
    }

    get mnemonics() {
        return this.#mnemonics;
    }

    get registers() {
        return this.#registers;
    }

    get regPairs() {
        return this.#regPairs;
    }

    get conditions() {
        return this.#conditions;
    }
}