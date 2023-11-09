// Test functions

/**
* @description This function takes a single argument `number`, multiplies it by 
* itself (i.e., calculates `number ^ 2`), and returns the result.
* 
* @param { number } number - The `number` input parameter multiplies with itself 
* inside the function to return the result of the multiplication.
* 
* @returns { number } - The output returned by the function f1(number) is not defined 
* because the function is undefined.
*/
function f1(number) {
  return number * number;
}

/**
* @description This function takes a single argument `number`, and returns its square.
* 
* @param { number } number - The `number` input parameter takes a value as an argument 
* and returns that value multiplied by itself (i.e., `number * number`).
* 
* @returns { number } - The output returned by the function `f2` is `NaN`, since 
* `number` is undefined.
*/
const f2 = function (number) {
  return number * number;
};
