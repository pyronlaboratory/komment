class TestFunctions {

/**
* @description The function f1(number) takes a single input parameter "number", and 
* returns the value of "number" multiplied by itself.
* 
* @param { number } number - The `number` input parameter is not used at all. The 
* function simply returns its argument multiplied by itself.
* 
* @returns { number } - The output returned by the function `f1(number)` is `number 
* * number`, which is always a positive number.
*/
f1(number) {
  return number * number;
};
  
/**
* @description The function f2 takes a single argument number and returns the result 
* of multiplying number by itself.
* 
* f2(x) = x^2
* 
* @param { number } number - In the given function `f2`, the `number` input parameter 
* is a variable that takes on the value of an input argument when the function is called.
* 
* @returns { number } - The output returned by the function `f2` is `undefined`.
*/
f2 = function (number) {
  return number * number;
};
  
/**
* @description The function `f3` takes a single argument `number`, and returns its 
* square (i.e., the product of `number` multiplied by itself).
* 
* @param { number } number - The `number` input parameter is passed as an argument 
* to the function and is multiplied by itself inside the function to return a value.
* 
* @returns { number } - The output returned by the function `f3` is `0`, because 
* there is no number passed as an argument to the function.
*/
f3 = (number) => {
  return number * number;
};
  
}
