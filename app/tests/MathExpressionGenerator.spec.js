import
{
    getMathExpression,
    clearMathExpression,
    addComponentToMathExpression,
    removeLastComponentFromMathExpression,
} from "~/Model/MathExpressionGenerator";

QUnit.test("Simple math expressions generating", testSimpleMathExpressionGenerating);
QUnit.test("Math expression elements removal test", testRemoveElementsFromMathExpression);

function testSimpleMathExpressionGenerating(assert)
{
    let inputs =
    [
        ['2'],
        ['1', '*', '+', '2'],
        ['1', '+', '+'],
        ['1', '0', '1', '.', '2', '*', '2'],
        ['sin', '.', '1', '2', '3'],
        ['1', '2', '3', '.', '.', '.', '.', '2', '3', '+', '3'],
        ['1', '2', '3', '.', '3'],
        ['1', '.', '4', ' ', '*', '1', '4', '+', '(', '1', '5', '-', '6', ')', '^', '8'],
        '123/0^15!!!13'.split(''),
        '1.2.3.4.5'.split('')
    ];
    let expectedOutputs =
    [
        '2',
        '1 + 2',
        '1 +',
        '101.2 * 2',
        'sin(0.123',
        '123.23 + 3',
        '123.3',
        '1.4 * 14 + (15 - 6)^8',
        '123 / 0^15!!! 13',
        '1.2345'
    ];
    for (let i = 0; i < inputs.length; i++)
    {
        clearMathExpression();
        for (let component of inputs[i])
        {
            addComponentToMathExpression(component);
        }
        assert.deepEqual(
            getMathExpression(),
            expectedOutputs[i]
        )
    }
}
function testRemoveElementsFromMathExpression(assert)
{
    let amountOfElementsRemove = 2;
    let inputs =
    [
        '2 * 2 + 15'.split('')
    ];
    let expectedOutputs =
    [
        '2 * 2'
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        clearMathExpression();
        for (let component of inputs[i])
        {
            addComponentToMathExpression(component);
        }
        for (let i = 0; i < amountOfElementsRemove; i++)
            removeLastComponentFromMathExpression();
        assert.deepEqual(
            getMathExpression(),
            expectedOutputs[i]
        )
    }
}
