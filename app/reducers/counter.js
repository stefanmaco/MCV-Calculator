// @flow
import update from "object-update";
import { CHANGE_CALCULATOR_METHOD, CHANGE_EQUATION } from "../actions/counter";
import type { Action } from "./types";

const utils = {
  methodUsed: "default",
  expression: "sqrt(x+7+sqrt(16))^2 --1 - -4 +(x^2)",
  minVal: -10,
  maxVal: 11
};

export default function counter(state: object = utils, action: Action) {
  switch (action.type) {
    case CHANGE_CALCULATOR_METHOD:
      return update(state, { methodUsed: action.method });
    case CHANGE_EQUATION:
      return update(state, { expression: action.expression, minVal: action.minVal, maxVal: action.maxVal });
    default:
      return state;
  }
}
