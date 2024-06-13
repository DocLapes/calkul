import { getCalculatorViewModel } from './CalculatorViewModel';

export function onNavigatingTo(args) 
{
    const page = args.object
    page.bindingContext = getCalculatorViewModel();
}