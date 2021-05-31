/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */

'use strict';


const math = {};
/**
 * Calculates the linearly interpolated value of x between a and b.
 *
 * @param {number} a Number
 * @param {number} b Number
 * @param {number} x Value to be interpolated.
 * @return {number} Interpolated value.
 */
math.lerp = function (a, b, x) {
    return a + x * (b - a);
};
export default math;