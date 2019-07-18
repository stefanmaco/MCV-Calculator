// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const CHANGE_CALCULATOR_METHOD = 'CHANGE_CALCULATOR_METHOD';
export const CHANGE_EQUATION = 'CHANGE_EQUATION';

export function changeCalculatorMethod(method) {
  return {
    type: CHANGE_CALCULATOR_METHOD,
    method
  };
}

export function changeEquation(obj) {
  return {
    type: CHANGE_EQUATION,
    expression: obj.expression,
    minVal: parseFloat(obj.minVal),
    maxVal: parseFloat(obj.maxVal)
  };
}
