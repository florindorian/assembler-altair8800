import InstructionSet from "./InstructionSet.js";
import MemoryMonitor from "./MemoryMonitor.js";

export default class Translator {
    #instructionSet
    #memoryMonitor
    #machineCode

    constructor() {
        this.#instructionSet = new InstructionSet();
        this.#memoryMonitor = new MemoryMonitor();
        this.#machineCode = "";
    }

    traduzir(linhas) {
        this.#machineCode = "";

        // Loop para fazer a primeira etapa de tradução, a qual só não faz a codificação de labels
        for (let linha of linhas) {
            let instrucao, label;

            // Separa a label da instrução
            let label_inst = this.separarLabel(linha);
            if (label_inst.length > 1) {
                //Caso exista tanto a label quanto a instrução
                instrucao = label_inst[1];
                label = label_inst[0];
            } else {
                //Caso não haja label
                instrucao = label_inst[0];
                label = "";
            }
            instrucao = instrucao.trim(); //Retira espaços em branco no início e no fim da instrução
            label = label.trim(); //Retira espaços em branco no início e no fim da label

            // Se houver uma label, o memoryMonitor irá registrá-la.
            if (label !== "") {
                this.#memoryMonitor.linkarLabel(label);
            }

            // Se a instrução não for vazia:
            if (instrucao !== "") {
                // Etapas fundamentais para a tradução:
                let linhaDividida = this.agrupar(instrucao);
                let gruposCodificados = this.codificarArgs(linhaDividida);
                let stringBase = this.interpolar(gruposCodificados);
                let linhaHex = this.converterParaHex(stringBase);
                this.#machineCode += linhaHex + " ";

                this.#memoryMonitor.observar(linhaHex);
            }
        }
        
        // Loop para codificar as labels restantes no código pelos respectivos endereços que referenciam
        let references = this.#memoryMonitor.references;
        for (let ref in references) {
            this.#machineCode = this.#machineCode.replaceAll(ref, references[ref])
        }
        console.log(this.#memoryMonitor.references);
        return this.#machineCode;
    }

    agrupar(linha) {
        //Estrutura que armazena o formato da instrução contida em "linha" e seus campos
        let linhaDividida = { "regex": "", "grupos": null };

        for (let regex of this.#instructionSet.regex) {
            linhaDividida.grupos = linha.match(regex); //Identifica qual o formato da instrução entre os 4 pré-definidos

            //Se a linha lida é válida, ou seja, corresponde a nenhuma das regex:
            if (linhaDividida.grupos !== null) {
                linhaDividida.regex = regex;
                break; //Regex achada, logo não precisa analisar as outras
            }
        }

        if (linhaDividida.grupos === null) {
            return null; //Caso em que a linha lida não é válida, devido não ter correspondido a nenhuma regex
        } else {
            return linhaDividida;
        }
    }

    codificarArgs(linhaDividida) {
        const qtdGrupos = linhaDividida.grupos.length - 1;
        let grupo2, grupo3, grupo1;

        if (qtdGrupos > 1) {
            let regex = this.#instructionSet.regex;
            let registers = this.#instructionSet.registers;
            let regPairs = this.#instructionSet.regPairs;
            let conditions = this.#instructionSet.conditions;

            grupo1 = linhaDividida.grupos[1];
            grupo2 = linhaDividida.grupos[2];
            if (qtdGrupos > 2) {
                grupo3 = linhaDividida.grupos[3];
            }

            //Analisando os 4 formatos possíveis de instruções com base nas respectivas regex
            if (linhaDividida.regex === regex[4] || linhaDividida.regex === regex[5]) {
                // REGEX 4 e 5: Aplicar codificações para: registers, regPair
                // CODIFICANDO CONSTANTES
                if (grupo1 === "RST") {
                    //Caso seja o argumento da instrução RST, ou seja, 1,2,3,...,7
                    let zerosEsquerda = "";
                    if (parseInt(grupo2, 10) < 2) {
                        zerosEsquerda = "00";
                    } else if (parseInt(grupo2, 10) < 4) {
                        zerosEsquerda = "0";
                    }
                    // Completa com zeros à esquerda caso o número binário não tenha 3 dígitos no total
                    grupo2 = zerosEsquerda + parseInt(grupo2, 10).toString(2);
                }

                // CODIFICANDO REGISTRADORES
                if (grupo2 in registers) {
                    grupo2 = registers[grupo2]; //register: code
                }
                if (grupo3 in registers && qtdGrupos > 2) {
                    grupo3 = registers[grupo3]; //register: code
                }

                // CODIFICANDO PARES DE REGISTRADORES
                if (grupo2 in regPairs) {
                    grupo2 = regPairs[grupo2]; //regPair: code
                }
            } else if (linhaDividida.regex === regex[1] || linhaDividida.regex === regex[2] || linhaDividida.regex === regex[3]) {
                // REGEX 1 e 2: Aplicar codificações para: condições
                // REGEX 3: A codificação dos argumentos será feita posteriormente com o MemoryMonitor
                // CODIFICANDO CONDIÇÕES
                if (grupo2 in conditions) {
                    grupo2 = conditions[grupo2]; //condition: code
                }
            }
            // REGEX 0: não precisa ser tratada, porque não possui argumentos

            linhaDividida.grupos[2] = grupo2;
            if (qtdGrupos > 2) {
                linhaDividida.grupos[3] = grupo3;
            }
        }
        return linhaDividida;
    }

    interpolar(gruposCodificados) {
        let str = '', grupo;
        let mnemonics = this.#instructionSet.mnemonics;

        //Se o mnemônico contido no grupo de captura 1 de fato é um dos mnemônicos do assembly do conjunto de instruções:
        if (gruposCodificados.grupos[1] in mnemonics) {
            //Usa o mnemônico da instrução passada para obter a regra de inserção dos argumentos no código de máquina
            let regra = mnemonics[gruposCodificados.grupos[1]]; //mnemonic: rule
            let lacunas = regra[0].split(","); //Todos os argumentos precisam ser inseridos em "lacunas" no código de máquina, as quais podem ser identificadas pela variável lacuna

            str = regra[1]; //a string-molde será armazenada em str
            if (lacunas[0] !== '') {
                //Se existem argumentos para serem inseridos no código de máquina:
                for (let i = 0; i < lacunas.length; i++) {
                    grupo = gruposCodificados.grupos[i + 2];
                    let res_match = grupo.match(/^[0-9A-F]{4}$/); //Serve para verificar se grupo contém realmente um endereço, isto, é se não é uma label
                    if (lacunas[i] === "lb hb" && res_match !== null) {
                        //Inverte o argumento hblb e transforma em: lb hb
                        grupo = grupo.replace(grupo, grupo.substring(2) + ' ' + grupo.substring(0, 2));
                    }
                    //Substitui a lacuna pelo argumento correspondente
                    str = str.replace(lacunas[i], grupo);
                }
            }
        }
        return str;
    }

    converterParaHex(stringBase) {
        let binario = stringBase.substring(0, 8);
        //parseInt(binario, 2) converte "binario" para decimal, e toString(16) o converte para hexadecimal em UpperCase
        let hexadecimal = parseInt(binario, 2).toString(16).toUpperCase();
        if (parseInt(binario, 2) < 16) {
            //Números menores que até quinze podem ser representados com um único algarismo hexadecimal, o que não é desejável
            hexadecimal = '0' + hexadecimal;
        }
        return stringBase.replace(binario, hexadecimal);
    }

    separarLabel(linha) {
        let label_inst = linha.split(":");
        return label_inst;
    }
}