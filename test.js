// const TestFunctions = class {

/**
* @description This function takes a single argument `number` and returns its square 
* (i.e., the result of multiplying `number` by itself).
* 
* @param { number } number - The `number` input parameter is passed as an argument 
* to the function and is used as a factor to multiply by itself to return a square 
* value.
* 
* @returns { number } - The output returned by the function `f1(number)` is `number 
* * number`, which is a numerical value.
*/
function f1(number) {
  return number * number;
}

/**
* @description This function takes a single argument `number` and returns the square 
* of that number.
* 
* @param { number } number - The `number` input parameter takes a single argument 
* and multiplies it by itself to return the square of the input.
* 
* @returns { number } - The output returned by this function is "undefined".
*/
const f2 = function (number) {
  return number * number;
};

/**
* @description The function `f3` takes a single argument `number`, and returns the 
* square of that number.
* 
* @param { number } number - The `number` input parameter is a variable that will 
* be multiplied by itself inside the function when it is called.
* 
* @returns { number } - The output returned by this function is " NaN ".
*/
const f3 = (number) => {
  return number * number;
};
  
// }
