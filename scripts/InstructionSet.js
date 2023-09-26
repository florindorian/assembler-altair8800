export default class InstructionSet {
    #regex = [
        // Instrução com 1 parte
        /^(?!(?:J|C|R)(?:NZ|Z|NC|C|PO|PE|P|M)$)([A-Z]{2,4})$/,
        // Instrução com 1 parte, a qual começa com a letra R seguida de uma condição
        /^(R)(NZ|Z|NC|C|PO|PE|P|M)$/,
        // Instrução com 2 partes, com J ou C seguido de uma condição na 1ª e um argumento constante na 2ª
        /^(J|C)(NZ|Z|NC|C|PO|PE|P|M) ([0-9A-F]{4})$/,
        // Instrução com 2 partes genéricas
        /^([A-Z]{2,4}) ([0-9A-F]+)$/,
        // Instrução com 3 partes, sendo que as duas últimas são separadas por vírgula
        /^([A-Z]{2,4}) ([0-9A-F]+),([0-9A-F]+)$/
    ];

    #mnemonics = {
        // 'mnemonic': rule
        'MOV': ['DDD,SSS', '01DDDSSS'],
        'MVI': ['DDD,db', '00DDD110 db'],
        'LXI': ['RP,lb hb', '00RP0001 lb hb'],
        'LDA': ['lb hb', '00111010 lb hb'],
        'STA': ['lb hb', '00110010 lb hb'],
        'LHLD': ['lb hb', '00101010 lb hb'],
        'SHLD': ['lb hb', '00100010 lb hb'],
        'LDAX': ['RP', '00RP1010'], // Considerar a obs *1 e TODO: implementação
        'STAX': ['RP', '00RP0010'], // Considerar a obs *1 e TODO: implementação
        'XCHG': ['', '11101011'],
        'ADD': ['SSS', '10000SSS'],
        'ADI': ['db', '11000110 db'],
        'ADC': ['SSS', '10001SSS'],
        'ACI': ['db', '11001110 db'],
        'SUB': ['SSS', '10010SSS'],
        'SUI': ['db', '11010110 db'],
        'SBB': ['SSS', '10011SSS'],
        'SBI': ['db', '11011110 db'],
        'INR': ['DDD', '00DDD100'],
        'DCR': ['DDD', '00DDD101'],
        'INX': ['RP', '00RP0011'],
        'DCX': ['RP', '00RP1011'],
        'DAD': ['RP', '00RP1001'],
        'DAA': ['', '00100111'],
        'ANA': ['SSS', '10100SSS'],
        'ANI': ['db', '11100110 db'],
        'ORA': ['SSS', '10110SSS'],
        'ORI': ['db', '11110110 db'], // Em http://dunfield.classiccmp.org//r/8080.txt está errado, aqui está corrigido
        'XRA': ['SSS', '10101SSS'],
        'XRI': ['db', '11101110 db'],
        'CMP': ['SSS', '10111SSS'],
        'CPI': ['db', '11111110 db'], // Em http://dunfield.classiccmp.org//r/8080.txt está errado, aqui está corrigido
        'RLC': ['', '00000111'],
        'RRC': ['', '00001111'],
        'RAL': ['', '00010111'],
        'RAR': ['', '00011111'],
        'CMA': ['', '00101111'],
        'CMC': ['', '00111111'],
        'STC': ['', '00110111'],
        'JMP': ['lb hb', '11000011 lb hb'],
        'J': ['ccc,lb hb', '11ccc010 lb hb'],
        'CALL': ['lb hb', '11001101 lb hb'],
        'C': ['ccc,lb hb', '11ccc100 lb hb'],
        'RET': ['', '11001001'],
        'R': ['ccc', '11ccc000'],
        'RST': ['nnn', '11nnn111'],
        'PCHL': ['', '11101001'],
        'PUSH': ['RP', '11RP0101'], // Considerar a obs *2 e TODO: implementação
        'POP': ['RP', '11RP0001'], // Considerar a obs *2 e TODO: implementação
        'XTHL': ['', '11100011'],
        'SPHL': ['', '11111001'],
        'IN': ['pa', '11011011 pa'],
        'OUT': ['pa', '11010011 pa'],
        'EI': ['', '11111011'],
        'DI': ['', '11110011'],
        'HLT': ['', '01110110'],
        'NOP': ['', '00000000']
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