import
{
    generatePostfixFormFromMathExpression,
    UnknownMathOperationException,
    UnpairedBracketsFoundException,
    UnexpectedMathOperationFoundException,
    OpeningBracketExpectedButNotFoundException,
    TooManyDecimalDelimitersInNumberFoundException,
    UnexpectedDecimalDelimiterPositionException
} from "~/Model/MathExpressionConverterToPostfixForm";

QUnit.test("Simple math expressions converting", testSimpleMathExpressionConverting);
QUnit.test("Regular math expressions converting", testRegularMathExpressionConverting);
QUnit.test("Complex math expressions converting", testComplexMathExpressionConverting);

QUnit.test("Converting wrong paired math expressions", testConvertingWrongPairedMathExpressions);
QUnit.test("Converting math expressions with not paired operations", testConvertingMathExpressionsWithNotPairedOperations);
QUnit.test("Converting math expressions that contains unknown math operation", testConvertingMathExpressionsThatContainsUnknownMathOperation);
QUnit.test("Unexpected math operations in expression", testUnexpectedMathOperationsInExpression);
QUnit.test('Converting math expression that contains floats with too many decimal delimiters', testTooManyDecimalDelimiters);
QUnit.test('Converting math expression that contains floats with decimal delimiters at start or at end of float', testUnexpectedDecimalDelimiters);

function testSimpleMathExpressionConverting(assert)
{
    let inputs =
    [
        '2 + 2',
        '(2 + 2)',
        '1 + (2 + 3)',
        'cos(1)',
        'sin(1) + cos(1)',
        'sin(2 + 3)',
        'sin(1)!',
        'sin(1)! + cos(1)!',
        '2^2',
        '(220 + 130)^2',
        '-2 + 1 - 2',
        '+2 + 1 + 2 + (+2)',
        '2 * + 3',
        '-2 * 3',
        'sin(-3)',
        '--2',
        '---2',
        '+++++++++++2',
        '123.5 + 36.1',
        'sin(15.24) * 13.14 ^ 2.14'
    ];
    let expectedOutputs =
    [
        ['2', '2', '+'],
        ['2', '2', '+'],
        ['1', '2', '3', '+', '+'],
        ['1', 'cos'],
        ['1', 'sin', '1', 'cos', '+'],
        ['2', '3', '+', 'sin'],
        ['1', '!', 'sin'],
        ['1', '!', 'sin', '1', '!', 'cos', '+'],
        ['2', '2', '^'],
        ['220', '130', '+', '2', '^'],
        ['2', '~', '1', '+', '2', '-'],
        ['2', '1', '+', '2', '+', '2', '+'],
        ['2', '3', '*'],
        ['2', '~', '3', '*'],
        ['3', '~', 'sin'],
        ['2', '~', '~'],
        ['2', '~', '~', '~'],
        ['2'],
        ['123.5', '36.1', '+'],
        ['15.24', 'sin', '13.14', '2.14', '^', '*']
    ];
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            generatePostfixFormFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testRegularMathExpressionConverting(assert)
{
    let inputs =
    [
        '(1 - 5)',
        '(1 - 5)^2',
        '2 / (1 - 5)^2',
        '4 * 2 / (1 - 5)^2',
        '3 + 4 * 2 / (1 - 5)^2',
        '3216^2 +4      -15',
    ];
    let expectedOutputs =
    [
        '1 5 -'.split(' '),
        '1 5 - 2 ^'.split(' '),
        '2 1 5 - 2 ^ /'.split(' '),
        '4 2 * 1 5 - 2 ^ /'.split(' '),
        '3 4 2 * 1 5 - 2 ^ / +'.split(' '),
        '3216 2 ^ 4 + 15 -'.split(' ')
    ];
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            generatePostfixFormFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testComplexMathExpressionConverting(assert)
{
    let inputs =
    [
        '3 * ((-25 - 10 * -2 ^ 2 / 4) * (4 + 5)) / 2',
        '15/(7-(1+1))*3-(2+(1+1))*15/(7-(200+1))*3-(2+(1+1))*(15/(7-(1+1))*3-(2+(1+1))+15/(7-(1+1))*3-(2+(1+1)))'
    ];
    let expectedOutputs =
    [
        '3 25 ~ 10 2 ~ 2 ^ * 4 / - 4 5 + * * 2 /'.split(' '),
        '15 7 1 1 + - / 3 * 2 1 1 + + 15 * 7 200 1 + - / 3 * - 2 1 1 + + 15 7 1 1 + - / 3 * 2 1 1 + + - 15 7 1 1 + - / 3 * + 2 1 1 + + - * -'.split(' ')
    ];
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            generatePostfixFormFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testConvertingMathExpressionsWithNotPairedOperations(assert)
{
    let inputs =
    [
        'sin 1',
        'sin 1!',
        '(cos )2',
        'sin cos 2',
        'sin!'
    ];
    let expectedException = OpeningBracketExpectedButNotFoundException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}

function testConvertingWrongPairedMathExpressions(assert)
{
    let inputs =
    [
        '2)',
        '((())))',
        '('
    ];
    let expectedException = UnpairedBracketsFoundException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}

function testConvertingMathExpressionsThatContainsUnknownMathOperation(assert)
{
    let inputs =
    [
        'what(3)',
        'jiofqjnfoq2ifh30nf2q3qf jq29 jrfq2 n0239 jfq2',
        '.....',
        '123 . 3',
        '(123 + 3).'
    ];
    let expectedException = UnknownMathOperationException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}

function testUnexpectedMathOperationsInExpression(assert)
{
    let inputs =
    [
        '2****3',
        '2/*3',
        '!!!!',
        '!+',
        '!1',
    ];
    let expectedException = UnexpectedMathOperationFoundException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}
function testTooManyDecimalDelimiters(assert)
{
    let inputs =
        [
            '123.3.3 + 1',
            '1.1.1.1.1',
        ];
    let expectedException = TooManyDecimalDelimitersInNumberFoundException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}

function testUnexpectedDecimalDelimiters(assert)
{
    let inputs =
        [
            '13213. + 31',
            '.12312 + 145'
        ];
    let expectedException = UnexpectedDecimalDelimiterPositionException;
    for (let i = 0; i < inputs.length; i++)
    {
        assert.throws(
            function ()
            {
                generatePostfixFormFromMathExpression(inputs[i]);
            },
            expectedException
        );
    }
}
