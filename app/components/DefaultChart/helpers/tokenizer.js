/**
 * Tokenizes the equation string
 * @param call tokenize function with the equation string as param
 * @return array of array of literals, variables and operators
 */
export default class Tokenizer {
  constructor() {
    this.allowedFunctions = ['sqrt'];
  }

  /**
   * verify is found function is valid
   * @param variable fn to be verified
   * @returns {boolean}
   */
  isFunction = variable => {
    return this.allowedFunctions.indexOf(variable) !== -1;
  };
  /**
   * adding some extra null operations in order to get rid of other validations
   * @param input equation string as default
   * @returns {string} modified equation
   */
  ensureExpressionFormat = input => {
    input = '0+' + input + '+';
    input = input.replace(/\(/g, '(0+');
    return input;
  };
  /**
   * verify if number of opening paranthesis matches the number of closing paranthesis
   * @param expresion the equation string
   * @returns {boolean}
   */
  verifyIntegrityOfExpression = expresion => {
    return (expresion.match(/\(/g) || []).length === (expresion.match(/\)/g) || []).length;
  };
  /**
   * converts a function to a mathematical operation
   * @param fn function string with its literal included eg. sqrt(4)
   * @returns {{integrity: boolean, structure: Array}} integrity will return true if it's variable is valid and structure will be the new array of tokens which will replace the function token
   */
  reduceFunction = fn => {
    let fnTokens = [];
    let valueFound = /\(.*\)$/.exec(fn)[0];
    valueFound = valueFound.substring(1, valueFound.length - 1);
    let tokenizedValue = this.tokenize(valueFound);
    if (tokenizedValue.error) {
      return { integrity: false, message: tokenizedValue.message, structure: [] };
    }
    tokenizedValue.structure.unshift({ type: 'leftParanthesis', value: '(' });
    tokenizedValue.structure.unshift({ type: 'leftParanthesis', value: '(' });
    tokenizedValue.structure.push({ type: 'rightParanthesis', value: ')' });
    tokenizedValue.structure.push({ type: 'operator', value: '^' });
    tokenizedValue.structure.push({ type: 'literal', value: '0.5' });
    tokenizedValue.structure.push({ type: 'rightParanthesis', value: ')' });
    return { integrity: true, structure: tokenizedValue.structure };

    if (/sqrt\(([0-9.]*|x)\)/.test(fn)) {
      // if sqrt is found it will replace it with pow 0.5
      fnTokens.push({ type: 'leftParanthesis', value: '(' });
      if (valueFound === 'x') {
        fnTokens.push({ type: 'variable', value: valueFound });
        valueFound = true;
      }
      if (!isNaN(valueFound)) {
        fnTokens.push({ type: 'literal', value: valueFound });
        valueFound = true;
      }
      fnTokens.push({ type: 'operator', value: '^' });
      fnTokens.push({ type: 'literal', value: '0.5' });
      fnTokens.push({ type: 'rightParanthesis', value: ')' });
    }
    if (valueFound !== true) {
      return { integrity: false, structure: [] };
    }
    return { integrity: true, structure: fnTokens };
  };
  /**
   * for each character it will return it's type
   * @param ch the character to be verified
   * @returns {string} type of character
   */
  getCharacterType = ch => {
    if (ch === '.') return 'comma';
    if (/\d/.test(ch)) return 'digit';
    if (/[a-z]/i.test(ch)) return 'letter';
    if (/\+|-|\*|\/|\^/.test(ch)) return 'operator';
    if (ch === '(') return 'leftParanthesis';
    if (ch === ')') return 'rightParanthesis';
  };
  /**
   * converts the character type to token type
   * @param chType type of character
   * @returns {string} type of token
   */
  convertCharacterTypeForStructure = chType => {
    if (chType === 'comma') return 'literal';
    if (chType === 'digit') return 'literal';
    if (chType === 'letter') return 'variable';
    if (chType === 'operator') return 'operator';
    if (chType === 'leftParanthesis') return 'leftParanthesis';
    if (chType === 'rightParanthesis') return 'rightParanthesis';
  };
  /**
   * verifies the compatibility of the current token with the previous one
   * @param obj {Object} prevChType: previous token type, prevChValue: previous token value, currentChType: current token type, currentChValue: current token value
   * @returns {*}
   */
  verifyIntegrity = obj => {
    let prevChType = obj.prevChType;
    let currentChType = obj.currentChType;
    let prevChValue = obj.prevChValue;
    let currentChValue = obj.currentChValue;
    if (currentChType === 'literal') {
      if (prevChType === 'variable') {
        return {
          state: false,
          message: 'Unexpected literal near variable.'
        }; // literal near variable is forbidden
      }
    }
    if (currentChType === 'variable') {
      if (prevChType === 'literal') {
        return {
          state: false,
          message: 'Unexpected literal near variable.'
        }; // literal near variable is forbidden
      }
    }
    if (currentChType === 'operator') {
      if (prevChType === 'operator' && (currentChValue !== '-' || prevChValue.length !== 1)) {
        return {
          state: false,
          message: 'Unexpected operator ' + prevChValue + currentChValue
        }; // operator near operator is forbidden if the second one is not "-"
      }
      if (prevChType === 'leftParanthesis' && currentChValue !== '-') {
        return {
          state: false,
          message: 'Unexpected operator after left paranthesis.'
        }; // operator near left paranthesis is forbidden as in sanitising we put "0+" after "(" so we won't have a unary minus here
      }
    }
    if (currentChType === 'leftParanthesis') {
      if (prevChType === 'rightParanthesis') {
        return {
          state: false,
          message: 'Unexpected left paranthesis after right paranthesis.'
        };
      }
      if (prevChType === 'literal') {
        return {
          state: false,
          message: 'Unexpected left paranthesis after literal.'
        }; // literal after left paranthesis is forbidden
      }
      if (prevChType === 'variable' && !this.isFunction(prevChValue)) {
        return {
          state: false,
          message: 'Unexpected left paranthesis after variable ' + prevChValue + '.'
        }; // left paranthesis after variable is forbidden
      }
    }
    if (currentChType === 'rightParanthesis') {
      if (prevChType === 'leftParanthesis') {
        return {
          state: false,
          message: 'Unexpected right paranthesis after left paranthesis.'
        }; // paranthesis without anything inside are not allowed
      }
      if (prevChType === 'operator') {
        return {
          state: false,
          message: 'Unexpected right paranthesis after operator.'
        }; // right paranthesis after operator is forbidden
      }
    }
    return { state: true, message: '' };
  };
  /**
   * additional integrity check for literals and values
   * @param token {Object} with type and value keys
   * @returns {Object} state: {Boolean} returns true if is valid, message: {String} return the error message if is invalid
   */
  verifyTokenIntegrity = token => {
    if (token.type === 'literal') {
      if (isNaN(token.value)) {
        return {
          state: false,
          message: 'Unexpected literal ' + token.value + '.'
        };
      }
    }
    if (token.type === 'value') {
      if (token.value !== 'x' && !this.isFunction(token.value)) {
        return {
          state: false,
          message: 'Unexpected function ' + token.value + '.'
        };
      }
    }
    return { state: true, message: '' };
  };
  /**
   * creates the structure of tokens object and gets rid of operators like "+-", it converts them to separate tokens
   * @param structure {Array} objects of tokens parsed which will contain functions and operators like "+-"
   * @returns {{integrity: {state: boolean}, structure: Array}} integrity is true if the tokens structure is valid, and structure will contain the tokenized equation
   */
  createTokensStructure = structure => {
    let tokens = [];
    let integrityChecked = { state: true };
    let functionFound = false;
    let functionBody = '';
    let functionOpenedParanthesis = 0;
    structure.forEach(token => {
      if (!integrityChecked.state) {
        return;
      }
      integrityChecked = this.verifyTokenIntegrity(token);
      if (integrityChecked) {
        if (functionFound) {
          // if(!(functionBody.match(/\(/g) || []).length || !(functionBody.match(/\(/g) || []).length){ // the function still doesn't have a body
          //   functionBody += token.value;
          //   functionOpenedParanthesis += (token.value.match(/\(/g) || []).length;
          //   functionOpenedParanthesis -= (token.value.match(/\)/g) || []).length;
          //   return;
          // }

          functionBody += token.value;
          functionOpenedParanthesis += (token.value.match(/\(/g) || []).length;
          functionOpenedParanthesis -= (token.value.match(/\)/g) || []).length;

          if (!functionOpenedParanthesis) {
            let functionTokens = this.reduceFunction(functionBody);
            integrityChecked.state = functionTokens.integrity;
            if (!integrityChecked.state) {
              integrityChecked.message = functionTokens.message;
            }
            functionTokens.structure.forEach(fnToken => {
              tokens.push(fnToken);
            });
            functionFound = false;
            functionBody = '';
          }
          return;
        }
        if (token.type === 'literal') {
          // if (functionFound) {
          //   // if it's inside a function store the data
          //   functionBody += token.value;
          //   return;
          // }
          tokens.push(token);
        }
        if (token.type === 'operator') {
          // if (functionFound) {
          //   // if it's inside a function store the data
          //   functionBody += token.value;
          //   return;
          // }
          if (token.value.length === 1) {
            // if the operator contains only one character add it to the tokens object
            tokens.push(token);
          } else {
            // if the operator contains more characters it will be considered an unary minus, split the operations structure
            tokens.push({
              type: 'operator',
              value: token.value.charAt(0)
            });
            tokens.push({ type: 'leftParanthesis', value: '(' });
            tokens.push({ type: 'literal', value: '-1' });
            tokens.push({ type: 'rightParanthesis', value: ')' });
            tokens.push({ type: 'operator', value: '*' });
          }
        }
        if (token.type === 'leftParanthesis') {
          let needed = token.value.length;
          // if (functionFound) {
          //   // in case a function is opened consider this the start of it's content
          //   needed--;
          //   functionBody += '(';
          // }
          for (let i = 0; i < needed; i++) {
            tokens.push({ type: 'leftParanthesis', value: '(' });
          }
        }
        if (token.type === 'rightParanthesis') {
          let needed = token.value.length;
          // if (functionFound) {
          //   // in case a function is found consider this the end of it's content
          //
          //   console.log(needed);
          //
          //   for (let i = 0; i < needed; i++) {
          //     functionBody += ')';
          //   }
          //   functionFound = false;
          //   needed--;
          //   let functionTokens = this.reduceFunction(functionBody);
          //   integrityChecked.state = fcunctionTokens.integrity;
          //   integrityChecked.message = 'Invalid function found ' + functionBody;
          //   functionTokens.structure.forEach(fnToken => {
          //     tokens.push(fnToken);
          //   });
          //   functionBody = '';
          // }
          for (let i = 0; i < needed; i++) {
            tokens.push({ type: 'rightParanthesis', value: ')' });
          }
        }
        if (token.type === 'variable') {
          if (token.value === 'x') {
            tokens.push(token);
          } else {
            functionFound = true;
            functionBody = token.value;
          }
        }
      }
    });
    return { integrity: integrityChecked, structure: tokens };
  };
  /**
   * it will tokenize the equation string
   * @param chArray array of the equation characters
   * @returns {{integrity: boolean, message: *, structure: Array}} integrity will be true if the equation string is valid, message will return the error message, structure will be the tokens object
   */
  createTheOperationStructure = chArray => {
    let structure = [];
    let storedType = '';
    let storedItem = '';
    let integrityChecked = { state: true };
    chArray.forEach((ch, index) => {
      if (!integrityChecked.state) {
        return;
      }
      let chType = this.convertCharacterTypeForStructure(ch.type);
      if (storedType === '') {
        // if there is nothing yet we should init
        storedItem += ch.value;
        storedType = chType;
        return;
      }
      integrityChecked = this.verifyIntegrity({
        prevChType: storedType,
        currentChType: chType,
        prevChValue: storedItem,
        currentChValue: ch.value
      });
      if (!integrityChecked.state) {
        console.error(index);
        console.error(chArray[index]);
      }
      if (storedType !== chType) {
        // different types
        structure.push({ type: storedType, value: storedItem });
        storedItem = ch.value;
        storedType = chType;
        return;
      }
      // same types, just append the value
      storedItem += '' + ch.value;
    });
    if (!integrityChecked.state) {
      return {
        integrity: false,
        message: integrityChecked.message,
        structure: []
      };
    }
    // console.error(structure);
    let tokensStructure = this.createTokensStructure(structure);
    return {
      integrity: tokensStructure.integrity.state,
      message: tokensStructure.integrity.message,
      structure: tokensStructure.structure
    };
  };
  /**
   * primary function to be called to tokenise an equation
   * @param input {String} equation string
   * @returns {{error: {Boolean},  message: {String}, structure: {Array}} error will return true if the equation is not valid, message will contain the error message, structure will contain the tokens
   */
  tokenize = input => {
    let result = [];
    input = input.replace(/\s+/g, '');
    if (!this.verifyIntegrityOfExpression(input)) {
      return { error: true, message: 'Invalid expression.', structure: [] };
    }
    input = this.ensureExpressionFormat(input);
    input = input.split('');
    input.forEach(ch => {
      result.push({ type: this.getCharacterType(ch), value: ch });
    });
    let structure = this.createTheOperationStructure(result);
    // console.log(structure);
    // console.log(structure.structure);
    if (!structure.integrity) {
      return { error: true, message: structure.message, structure: [] };
    }
    return { error: false, message: '', structure: structure.structure };
  };
}
