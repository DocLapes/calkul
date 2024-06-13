///////////////////////////////////////////////////////////////////
//module for converting a mathematical expression into postfix form
///////////////////////////////////////////////////////////////////

import { splitMathExpressionToTokens } from "./MathExpressionTokenizer";
import { isDigitDelimiter } from "~/Model/CharType";
import
{
    MathElementType,
    getTypeOfMathElement,
    isMathOperation,
    isPrefixOperation
}
from "~/Model/MathElementType";

function countDecimalDelimiters(token)
{
    let result = 0;
    for (let chr of token)
        if (isDigitDelimiter(chr))
            result++;
    return result;
}

function isUnaryOperation(prevToken)
{
    if (prevToken === undefined)
        return true;
    let prevTokenType = getTypeOfMathElement(prevToken);
    return (prevTokenType === MathElementType.ARITHMETIC_OPERATION) ||
           (prevTokenType === MathElementType.OPENING_BRACKET);
}

function getUnaryVersionOfOperation(operation)
{
    switch (operation)
    {
        case '-':
        case '~':
            return '~';
        case '+':
            return '';
        default:
            return undefined;
    }
}

function extractItemsUntilOpeningBracketFromStack(bracket, stack)
{
    let result = [];
    while (stack.length > 0)
    {
        let token = stack.pop();
        if (token === bracket)
            return result;
        result.push(token);
    }
    //Opening bracket not found
    return false;
}

function isPrefixOperationAtTheEndOfStack(stack)
{
    return (stack.length > 0) && isPrefixOperation(stack.at(-1));
}

function extractAllOperationsFromStack(stack)
{
    let result = [];
    while (stack.length > 0)
    {
        let token = stack.pop();
        if (!isMathOperation(token))
            return false;
        result.push(token);
    }
    return result;
}

function getOperationPriority(operation)
{
    switch (operation)
    {
        case 'sin':
        case 'cos':
            return 11;
        case '~':
            return 10;
        case '!':
        case '^':
            return 8;
        case '*':
        case '/':
            return 7;
        case '+':
        case '-':
            return 6;
        case '(':
            return -1;
        default:
            return undefined;
    }
}

function extractArithmeticAndHighPriorityOperationsFromStack(priorityLimit, stack)
{
    let result = [];
    while (stack.length > 0)
    {
        let token = stack.at(-1);
        let operationPriority = getOperationPriority(token);
        if (operationPriority === undefined)
            throw new DeveloperForgotToWriteImplementationOfMathOperationException(token, []);
        if (operationPriority >= priorityLimit)
        {
            result.push(stack.pop());
            continue;
        }
        break;
    }
    return result;
}

function isPostfixOperationCanGoAfterThisToken(token)
{
    if (token === undefined)
        return false;
    let tokenType = getTypeOfMathElement(token);
    return (tokenType !== MathElementType.OPENING_BRACKET) &&
           (tokenType !== MathElementType.ARITHMETIC_OPERATION) &&
           (tokenType !== MathElementType.PREFIX_OPERATION);
}

export class OpeningBracketExpectedButNotFoundException extends Error
{
    foundedMathElement;
    position;
    constructor (foundedMathElement, position)
    {
        super('ERROR: Opening bracket expected but found "' + foundedMathElement + '" at ' + position);
        this.foundedMathElement = foundedMathElement;
        this.position = position;
    }
}

export class UnknownMathOperationException extends Error
{
    unknownOperation;
    position;
    constructor (unknownOperation, position)
    {
        super('ERROR: Unknown operation ' + unknownOperation + ' at ' + position);
        this.unknownOperation = unknownOperation;
        this.position = position;
    }
}

export class UnpairedBracketsFoundException extends Error
{
    bracket;
    position;
    constructor (bracket = undefined, position = undefined)
    {
        if (bracket === undefined)
            super('Math expression is unpaired');
        else
            super('Found unpaired bracket "' + bracket + '" at ' + position);
        this.bracket = bracket;
        this.position = position;
    }
}

export class UnexpectedMathOperationFoundException extends Error
{
    operation;
    position;
    constructor (operation, position)
    {
        super('Found unexpected math operation "' + operation + '" at ' + position);
        this.operation = operation;
        this.position = position;
    }
}

export class TooManyDecimalDelimitersInNumberFoundException extends Error
{
    mathElement;
    position;
    constructor (mathElement, position)
    {
        super('Found too many decimal delimiters in number "' + mathElement + '" at ' + position);
        this.mathElement = mathElement;
        this.position = position;
    }
}

export class UnexpectedDecimalDelimiterPositionException extends Error
{
    mathElement;
    delimiterPosition;
    constructor (mathElement, delimiterPosition)
    {
        super('Unexpected decimal delimiter in number "' + mathElement + '" at ' + delimiterPosition + ' at ' + delimiterPosition);
        this.mathElement = mathElement;
        this.delimiterPosition = delimiterPosition;
    }
}

export class DeveloperForgotToWriteImplementationOfMathOperationException extends Error
{
    operator;
    mathExpression;
    constructor (operator, mathExpression)
    {
        super('The developer forgot to write the implementation of ' + operator + ' operator');
        this.operator = operator;
        this.mathExpression = mathExpression;
    }
}

/**
 * Generates postfix expression from given math expression
 * @param {string} mathExpression
 * @throws {UnknownMathOperationException}
 * @throws {UnexpectedMathOperationFoundException}
 * @throws {DeveloperForgotToWriteImplementationOfMathOperationException}
 * @throws {UnpairedBracketsFoundException}
 * @throws {OpeningBracketExpectedButNotFoundException}
 * @throws {TooManyDecimalDelimitersInNumberFoundException}
 * @throws {UnexpectedDecimalDelimiterPositionException}
 * @returns {string[]}
 */
export function generatePostfixFormFromMathExpression(mathExpression)
{
    let tokens = splitMathExpressionToTokens(mathExpression);
    let result = [];
    let stack = [];
    let temp = [];
    let isOpeningBracketRequired = false;
    let charPosition = 0;
    for (let i = 0; i < tokens.length; i++)
    {
        let tokenType = getTypeOfMathElement(tokens[i]);
        if(isOpeningBracketRequired && (tokenType !== MathElementType.OPENING_BRACKET))
            throw new OpeningBracketExpectedButNotFoundException(tokens[i], charPosition);
        isOpeningBracketRequired = false;
        switch (tokenType)
        {
            case MathElementType.NUMBER:
                if (countDecimalDelimiters(tokens[i]) > 1)
                    throw new TooManyDecimalDelimitersInNumberFoundException(tokens[i], charPosition);
                if (isDigitDelimiter(tokens[i][0]))
                    throw new UnexpectedDecimalDelimiterPositionException(tokens[i], charPosition);
                if (isDigitDelimiter(tokens[i].at(-1)))
                    throw new UnexpectedDecimalDelimiterPositionException(tokens[i], charPosition + tokens[i].length - 1);
                result.push(tokens[i]);
                break;
            case MathElementType.POSTFIX_OPERATION:
                if (!isPostfixOperationCanGoAfterThisToken(tokens[i - 1]))
                    throw new UnexpectedMathOperationFoundException(tokens[i], charPosition);
                result.push(tokens[i]);
                break;
            case MathElementType.PREFIX_OPERATION:
                isOpeningBracketRequired = (tokens[i] === 'cos') ||
                                           (tokens[i] === 'sin');
                stack.push(tokens[i]);
                break;
            case MathElementType.OPENING_BRACKET:
                stack.push(tokens[i]);
                break;
            case MathElementType.CLOSING_BRACKET:
                temp = extractItemsUntilOpeningBracketFromStack('(', stack);
                if (temp === false)
                    throw new UnpairedBracketsFoundException(tokens[i], charPosition);
                if (isPrefixOperationAtTheEndOfStack(stack))
                    temp.push(stack.pop());
                result = result.concat(temp);
                break;
            case MathElementType.ARITHMETIC_OPERATION:
                if (isUnaryOperation(tokens[i - 1]))
                {
                    let token = getUnaryVersionOfOperation(tokens[i]);
                    if (token === undefined)
                        throw new UnexpectedMathOperationFoundException(tokens[i], charPosition);
                    if (token !== '')
                        stack.push(token);
                    break;
                }
                if (isPrefixOperation(tokens[i - 1]))
                    throw new UnexpectedMathOperationFoundException(tokens[i], charPosition);
                let operationPriority = getOperationPriority(tokens[i]);
                if (operationPriority === undefined)
                    throw new DeveloperForgotToWriteImplementationOfMathOperationException(tokens[i], tokens);
                try
                {
                    temp = extractArithmeticAndHighPriorityOperationsFromStack
                    (
                        operationPriority,
                        stack
                    );
                }
                catch (err)
                {
                    if (err.name === 'DeveloperForgotToWriteImplementationOfMathOperationException')
                        err.mathExpression = tokens;
                    throw err;
                }
                result = result.concat(temp);
                stack.push(tokens[i]);
                break;
            case MathElementType.UNKNOWN:
                throw new UnknownMathOperationException(tokens[i], charPosition);
        }
        charPosition += tokens[i].length;
    }
    temp = extractAllOperationsFromStack(stack);
    if (temp === false)
        throw new UnpairedBracketsFoundException();
    return result.concat(temp);
}
