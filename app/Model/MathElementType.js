/////////////////////////////////////////////////////////////
//A subsystem for determining the type of math string-element
/////////////////////////////////////////////////////////////

import {isDigit, isDigitDelimiter} from "~/Model/CharType";

export class MathElementType
{
    static NUMBER = 0;
    static ARITHMETIC_OPERATION = 1
    static POSTFIX_OPERATION = 2;
    static PREFIX_OPERATION = 3;
    static OPENING_BRACKET = 4;
    static CLOSING_BRACKET = 5;
    static UNKNOWN = 6;
}

/**
 * Checks if the string is a number
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isNumber(mathElement)
{
    if (isDigitDelimiter(mathElement))
        return false;
    if (mathElement === 'Infinity')
        return true;
    if (mathElement === 'NaN')
        return true;
    for (let chr of mathElement)
        if ((!isDigit(chr)) && (!isDigitDelimiter(chr)))
            return false;
    return true;
}

/**
 * Checks if the string is a closing bracket
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isClosingBracket(mathElement)
{
    return mathElement === ')';
}

/**
 * Checks if the string is an opening bracket
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isOpeningBracket(mathElement)
{
    return mathElement === '(';
}

/**
 * Checks if the string is an arithmetic operation
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isArithmeticOperation(mathElement)
{
    return (mathElement === '+') ||
           (mathElement === '-') ||
           (mathElement === '*') ||
           (mathElement === '/') ||
           (mathElement === '^');
}

/**
 * Checks if the string is a postfix operation
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isPostfixOperation(mathElement)
{
    return mathElement === '!';
}

/**
 * Checks if the string is a prefix operation
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isPrefixOperation(mathElement)
{
    return (mathElement === 'sin') ||
           (mathElement === 'cos') ||
           (mathElement === '~');      //Unary minus
}

/**
 * Checks if the string is a math operation
 * @param {string} mathElement
 * @returns {boolean}
 */
export function isMathOperation(mathElement)
{
    return isArithmeticOperation(mathElement) ||
           isPostfixOperation(mathElement) ||
           isPrefixOperation(mathElement);
}

/**
 * Determines the type of math element
 * @param {string} mathElement
 * @returns {number}
 */
export function getTypeOfMathElement(mathElement)
{
    if (isNumber(mathElement))
        return MathElementType.NUMBER;
    if (isArithmeticOperation(mathElement))
        return MathElementType.ARITHMETIC_OPERATION;
    if (isPostfixOperation(mathElement))
        return MathElementType.POSTFIX_OPERATION;
    if (isPrefixOperation(mathElement))
        return MathElementType.PREFIX_OPERATION;
    if (isOpeningBracket(mathElement))
        return MathElementType.OPENING_BRACKET;
    if (isClosingBracket(mathElement))
        return MathElementType.CLOSING_BRACKET;
    return MathElementType.UNKNOWN;
}
