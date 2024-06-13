import { calculateValueFromMathExpression } from "~/Model/MathExpressionValueCalculator";

QUnit.test("Simple math expressions evaluating", testSimpleMathExpressionEvaluating)
QUnit.test("Regular math expressions evaluating", testRegularMathExpressionEvaluating)
QUnit.test("Complex math expressions evaluating", testComplexMathExpressionEvaluating)
QUnit.test('Math expressions with float answer', testMathExpressionsWithFloatAnswer);

function testSimpleMathExpressionEvaluating(assert)
{
    let inputs =
    [
        '2',
        '0',
        '2 + 2',
        '1 * 2',
        '1++',
        '1 + 3 * 2',
        '3!*8',
        '2 * 2 * 2 ^ 3',
        '1.02 * 2'
    ];
    let expectedOutputs =
    [
        2,
        0,
        4,
        2,
        1,
        7,
        48,
        32,
        2.04
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            calculateValueFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testRegularMathExpressionEvaluating(assert)
{
    let inputs =
    [
        '3^2 +4      -15',
    ];
    let expectedOutputs =
    [
        -2
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            calculateValueFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testComplexMathExpressionEvaluating(assert)
{
    let inputs =
    [
        '15/(7-(1+1))*3-(2+(1+1))*15/(7-(200+1))*3-(2+(1+1))*(15/(7-(1+1))*3-(2+(1+1))+15/(7-(1+1))*3-(2+(1+1)))'
    ];
    let expectedOutputs =
    [
        -30.0721649484536082
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            calculateValueFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}

function testMathExpressionsWithFloatAnswer(assert)
{
    let inputs =
    [
        'sin(2) * cos(2)',
        '13^2.03',
        '13^-2.03',
        '13^--2.03',
    ];
    let expectedOutputs =
    [
        -0.37840124765396416,
        182.51770748794763,
        0.0054789204497653135,
        182.51770748794763,
    ]
    for (let i = 0; i < inputs.length; i++)
    {
        assert.deepEqual(
            calculateValueFromMathExpression(inputs[i]),
            expectedOutputs[i],
            "Error"
        );
    }
}
