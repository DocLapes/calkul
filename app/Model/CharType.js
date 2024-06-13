/////////////////////////////////////////////////////
//A subsystem for determining the type of a character
/////////////////////////////////////////////////////

//Emulating enum type
export class CharType
{
    static LATIN = 0;
    static DIGIT = 1;
    static DIGIT_DELIMITER = 2
    static SPACE = 3;
    static OTHER = 4;
}

/**
 * Checks if the character is a latin character
 * @param {string} chr
 * @returns {boolean}
 */
export function isLatin(chr)
{
    return ((chr >= 'a') && (chr <= 'z')) ||
           ((chr >= 'A') && (chr <= 'Z'));
}

/**
 * Checks if the character is a digit
 * @param {string} chr
 * @returns {boolean}
 */
export function isDigit(chr)
{
    return (chr >= '0') && (chr <= '9');
}

/**
 * Checks if the character is a whitespace
 * @param {string} chr
 * @returns {boolean}
 */
export function isSpace(chr)
{
    return (chr === ' ') ||
           (chr === String.fromCharCode(9)) ||    //TAB
           (chr === String.fromCharCode(10)) ||   //Line Feed
           (chr === String.fromCharCode(13)) ||   //Vertical TAB
           (chr === String.fromCharCode(15));     //Carriage Return
}

/**
 * Checks if the character is a digit delimiter
 * @param {string} chr
 * @returns {boolean}
 */
export function isDigitDelimiter(chr)
{
    return (chr === '.') || (chr === ',');
}

/**
 * Determines the type of character
 * @param {string} chr
 * @returns {number}
 */
export function getCharType(chr)
{
    if(isLatin(chr))
        return CharType.LATIN;
    if(isDigit(chr))
        return CharType.DIGIT;
    if(isDigitDelimiter(chr))
        return CharType.DIGIT_DELIMITER;
    if(isSpace(chr))
        return CharType.SPACE;
    return CharType.OTHER;
}
