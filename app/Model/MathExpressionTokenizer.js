//////////////////////////////////////////////////////////////////////
//Module for splitting a mathematical expression into array of strings
//////////////////////////////////////////////////////////////////////

import {CharType, getCharType} from "~/Model/CharType";

/**
 * Splits math expression to words, numbers and other ASCII-symbols.
 * @param {string} mathExpression
 * @returns {string[]}
 */
export function splitMathExpressionToTokens(mathExpression)
{
    let result = [];
    for (let i = 0; i < mathExpression.length; i++)
    {
        let currChar = mathExpression[i];
        let prevChar = mathExpression[i - 1];
        if (prevChar === undefined)
            prevChar = ' ';
        let currCharType = getCharType(currChar);
        let prevCharType = getCharType(prevChar);
        switch (currCharType)
        {
            case CharType.DIGIT:
                if (prevCharType === CharType.DIGIT ||
                    prevCharType === CharType.DIGIT_DELIMITER)
                {
                  result[result.length - 1] += currChar;
                  break;
                }
                result.push(currChar);
                break;
            case CharType.DIGIT_DELIMITER:
                if (prevCharType === CharType.DIGIT)
                {
                    result[result.length - 1] += '.';
                    break;
                }
                result.push('.');
                break;
            case CharType.LATIN:
                if (prevCharType === CharType.LATIN)
                {
                    result[result.length - 1] += currChar;
                    break;
                }
                result.push(currChar);
                break;
            case CharType.SPACE:
                break;
            default:
                result.push(currChar);
                break;
        }
    }
    return result;
}
