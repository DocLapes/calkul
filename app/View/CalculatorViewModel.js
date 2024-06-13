import { Observable } from '@nativescript/core';

import
{
    clearMathExpression,
    getMathExpression,
    removeLastComponentFromMathExpression,
    addComponentToMathExpression
}
from "~/Model/MathExpressionGenerator";
import {
    AttemptToCalculateFactorialOfFloatNumberException,
    AttemptToCalculateFactorialOfNegativeNumberException,
    calculateValueFromMathExpression,
    NotEnoughBinaryMathOperatorsForCalculationException, NotEnoughNumbersToExecuteMathOperationException
} from "~/Model/MathExpressionValueCalculator";
import
{
    Dialogs
} from "@nativescript/core";
import {
    DeveloperForgotToWriteImplementationOfMathOperationException,
    OpeningBracketExpectedButNotFoundException,
    TooManyDecimalDelimitersInNumberFoundException,
    UnexpectedDecimalDelimiterPositionException,
    UnexpectedMathOperationFoundException,
    UnknownMathOperationException,
    UnpairedBracketsFoundException
} from "~/Model/MathExpressionConverterToPostfixForm";

const viewModel = new Observable();
const CURRENT_MATH_EXPRESSION_PROPERTY_NAME = 'currentMathExpression';
const PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME = 'previousMathExpression';

function ClearMathExpression()
{
    clearMathExpression();
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, '');
    viewModel.set(PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME, '');
}

function RemoveLastElementFromMathExpression()
{
    removeLastComponentFromMathExpression();
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
}

function AddElementToMathExpression(args)
{
    addComponentToMathExpression(args.object.mathElement);
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
}

function DisplayErrorMessage(message)
{
    //TODO Replace standard popup with custom
    Dialogs.alert({
        title: 'Ошибка',
        message: message,
        okButtonText: 'Ок',
        cancelable: true
    });
}

function EvaluateMathExpression()
{
    let answer = 0;
    try
    {
        answer = calculateValueFromMathExpression(getMathExpression())
                .toString()
                .replace('.', ',');
    }
    catch (e)
    {
        //TODO Mark positions of error with red color
        if (e instanceof NotEnoughBinaryMathOperatorsForCalculationException)
            DisplayErrorMessage('Не хватает бинарных операций в ' + e.amountOfPlacesWhereNeedBinaryOperator + ' местах, чтобы полностью высчитать значение введённого выражения.');
        else if (e instanceof UnknownMathOperationException)
            DisplayErrorMessage('Введена неизвестная математическая операция "' + e.unknownOperation + '", начинающаяся с ' + (e.position + 1) + '-го символа.');
        else if (e instanceof UnexpectedMathOperationFoundException)
            DisplayErrorMessage('Операция "' + e.operation + '", начинающаяся с ' + (e.position + 1) + '-го символа, находится не к месту.');
        else if (e instanceof DeveloperForgotToWriteImplementationOfMathOperationException)
            DisplayErrorMessage('Извините, но мы пока что не можем посчитать это выражение, так как разработчик забыл реализовать операцию "' + e.operator + '".');
        else if (e instanceof UnpairedBracketsFoundException)
        {
            if (e.bracket === undefined)
                DisplayErrorMessage('В математическом выражений не хватает закрывающих скобок.');
            else
                DisplayErrorMessage('Попалась закрывающая скобка "' + e.bracket + '" на ' + (e.position + 1) + ' символе, однако открывающей скобки нет.');
        }
        else if (e instanceof OpeningBracketExpectedButNotFoundException)
            DisplayErrorMessage('Ожидалась открывающая скобка у ' + (e.position + 1) + '-го символа, но был найден другой математический элемент: "' + e.foundedMathElement + '".');
        else if (e instanceof TooManyDecimalDelimitersInNumberFoundException)
            DisplayErrorMessage('В числе "' + e.mathElement +'", начинающегося с ' + (e.position + 1) + '-го символа, слишком много разделителей целой и дробной части.');
        else if (e instanceof UnexpectedDecimalDelimiterPositionException)
            DisplayErrorMessage('В числе "' + e.mathElement + '" разделитель целой и дробной части находится в самом начале или в самом конце числа.');
        else if (e instanceof AttemptToCalculateFactorialOfFloatNumberException)
            DisplayErrorMessage('Для вычисления этого выражения необходимо посчитать факториал дробного числа, но эта программа этого делать пока что не умеет.');
        else if (e instanceof AttemptToCalculateFactorialOfNegativeNumberException)
            DisplayErrorMessage('Для вычисления этого выражения необходимо посчитать факториал отрицательного числа, однако факториал отрицательного числа не определён');
        else if (e instanceof NotEnoughNumbersToExecuteMathOperationException)
            DisplayErrorMessage('Математическому оператору "' + e.mathOperation + '" не хватает чисел для применения.');
        return;
    }
    viewModel.set(PREVIOUS_MATH_EXPRESSION_PROPERTY_NAME, getMathExpression());
    viewModel.set(CURRENT_MATH_EXPRESSION_PROPERTY_NAME, answer);
    clearMathExpression();
    addComponentToMathExpression(answer.toString());
}

export function getCalculatorViewModel()
{
    viewModel.currentMathExpression = '';
    viewModel.ClearMathExpression = ClearMathExpression;
    viewModel.RemoveLastElementFromMathExpression = RemoveLastElementFromMathExpression;
    viewModel.AddElementToMathExpression = AddElementToMathExpression;
    viewModel.EvaluateMathExpression = EvaluateMathExpression;

    return viewModel;
}
