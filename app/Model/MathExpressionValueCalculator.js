////////////////////////////////////////////////////////////
//Module for calculating a value from a math expression
////////////////////////////////////////////////////////////
import
{
    generatePostfixFormFromMathExpression,
    DeveloperForgotToWriteImplementationOfMathOperationException,
}
from "./MathExpressionConverterToPostfixForm";

import
{
    isNumber,
    isPostfixOperation,
    isPrefixOperation,
    isArithmeticOperation
} from "~/Model/MathElementType";

function isBinaryOperation(token)
{
    return isArithmeticOperation(token);
}

function isUnaryOperation(token)
{
    return isPostfixOperation(token) || isPrefixOperation(token);
}

function factorial(n)
{
    n = +n;
    if (isNaN(n))
        return NaN;
    if (n === Infinity)
        return Infinity;
    //Factorial of float is undefined (in this application)
    if (!Number.isInteger(n))
        throw new AttemptToCalculateFactorialOfFloatNumberException();
    //Factorial of negative integer is undefined
    if(n < 0)
        throw new AttemptToCalculateFactorialOfNegativeNumberException();
    let result = 1;
    while(n > 1)
    {
        result *= n;
        n--;
    }
    return result;
}

function calculateBinaryExpression(a, b, operation)
{
    switch (operation)
    {
        case '-':
            return +a - +b;
        case '+':
            return +a + +b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        case '^':
            return Math.pow(a, b);
        default:
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(operation, '');
    }
}

function calculateUnaryExpression(a, operation)
{
    switch (operation)
    {
        case 'sin':
            return Math.sin(a);
        case 'cos':
            return Math.cos(a);
        case '~':
            return -a;
        case '!':
            return factorial(a);
        default:
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(operation, '');
    }
}

export class AttemptToCalculateFactorialOfNegativeNumberException extends Error { }

export class AttemptToCalculateFactorialOfFloatNumberException extends Error { }

export class NotEnoughBinaryMathOperatorsForCalculationException extends Error
{
    amountOfPlacesWhereNeedBinaryOperator;
    constructor(amountOfPlacesWhereNeedBinaryOperator)
    {
        super('There are not enough binary operators in ' + amountOfPlacesWhereNeedBinaryOperator + ' places to fully calculate a mathematical expression');
        this.amountOfPlacesWhereNeedBinaryOperator = amountOfPlacesWhereNeedBinaryOperator;
    }
}

export class NotEnoughNumbersToExecuteMathOperationException extends Error
{
    mathOperation;
    constructor(mathOperation)
    {
        if (mathOperation === '~')
            mathOperation = '-';
        super('There are not enough numbers to execute math operation "' + mathOperation + '"');
        this.mathOperation = mathOperation;
    }
}

/**
 * Calculates value of math expression
 * @param {string} expression
 * @throws {UnknownMathOperationException}
 * @throws {UnexpectedMathOperationFoundException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {OpeningBracketExpectedButNotFoundException}
 * @throws {TooManyDecimalDelimitersInNumberFoundException}
 * @throws {UnexpectedDecimalDelimiterPositionException}
 * @throws {NotEnoughBinaryMathOperatorsForCalculationException}
 * @throws {AttemptToCalculateFactorialOfFloatNumberException}
 * @throws {AttemptToCalculateFactorialOfNegativeNumberException}
 * @returns {number}
 */
export function calculateValueFromMathExpression(expression)
{
    let tokens = generatePostfixFormFromMathExpression(expression);
    let stack = [];
    let a = 0;
    let b = 0;
    let result = 0;
    for (let i = 0; i < tokens.length; i++)
    {
        if (isNumber(tokens[i]))
        {
            stack.push(tokens[i]);
            continue;
        }
        if (isBinaryOperation(tokens[i]))
        {
            if (stack.length < 2)
                throw new NotEnoughNumbersToExecuteMathOperationException(tokens[i]);
            b = stack.pop();
            a = stack.pop();
            result = calculateBinaryExpression(a, b, tokens[i]);
            stack.push(result);
            continue;
        }
        if (isUnaryOperation(tokens[i]))
        {
            if (stack.length === 0)
                throw new NotEnoughNumbersToExecuteMathOperationException(tokens[i]);
            a = stack.pop();
            result = calculateUnaryExpression(a, tokens[i]);
            stack.push(result);
        }
    }
    //If user entered just unary plus, for example
    if (stack.length === 0)
        return 0;
    if (stack.length > 1)
        throw new NotEnoughBinaryMathOperatorsForCalculationException(stack.length - 1);
    return stack[0];
}
