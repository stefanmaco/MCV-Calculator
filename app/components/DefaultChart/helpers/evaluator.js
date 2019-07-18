/**
 * evaluates the reverse polish notation string
 * @param ts string of rpn equation
 * @returns {Number/NaN} result of calculus
 */
const rpnEvaluator = (ts, s = []) => {
  ts.split(' ').forEach(t => {
    if (!isNaN(t)) {
      s.push(t);
      return;
    }
    let l1 = s.splice(-2, 1)[0];
    let operation = t;
    let l2 = s.pop();
    if (operation === '^') {
      let result = Math.pow(l1, l2);
      s.push(result);
      return;
    }
    if (operation === '--') {
      operation = '*-1+';
    }
    let result = eval(l1 + ' ' + operation + ' ' + l2);
    s.push(result);
  });
  return s[0];
};

/**
 * converts infix to postfix
 * @param tokens array of tokens
 * @returns postfix of tokenised equation
 */
const shuntingYard = tokens => {
  var outputQueue = '';
  var operatorStack = [];
  var operators = {
    '^': {
      precedence: 4,
      associativity: 'Right'
    },
    '/': {
      precedence: 3,
      associativity: 'Left'
    },
    '*': {
      precedence: 3,
      associativity: 'Left'
    },
    '+': {
      precedence: 2,
      associativity: 'Left'
    },
    '-': {
      precedence: 2,
      associativity: 'Left'
    }
  };
  tokens.forEach((token, i) => {
    if (token.type === 'literal' || token.type === 'variable') {
      outputQueue += token.value + ' ';
    } else if ('^*/+-'.indexOf(token.value) !== -1) {
      var o1 = token.value;
      var o2 = operatorStack[operatorStack.length - 1];
      while (
        '^*/+-'.indexOf(o2) !== -1 &&
        ((operators[o1].associativity === 'Left' && operators[o1].precedence <= operators[o2].precedence) ||
          (operators[o1].associativity === 'Right' && operators[o1].precedence < operators[o2].precedence))
      ) {
        outputQueue += operatorStack.pop() + ' ';
        o2 = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(o1);
    } else if (token.value === '(') {
      operatorStack.push(token.value);
    } else if (token.value === ')') {
      while (operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue += operatorStack.pop() + ' ';
      }
      operatorStack.pop();
    }
  });
  while (operatorStack.length > 0) {
    outputQueue += operatorStack.pop() + ' ';
  }
  // console.log(outputQueue);
  return outputQueue;
};

const evaluator = tokens => {
  // console.log(tokens);
  let result = rpnEvaluator(shuntingYard(tokens));
  // console.log(result);
  return { error: false, message: '', result };
};

export default evaluator;
