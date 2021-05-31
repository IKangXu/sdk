/*
 * 作者：zhuwz
 * 日期：2018-12-03 21:39:39.
 */
'use strict';

const array = {};

/**
 * Compare function for array sort that is safe for numbers.
 * @param {*} a The first object to be compared.
 * @param {*} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second.
 */
array.numberSafeCompareFunction = function (a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
};
/**
 * Performs a binary search on the provided sorted list and returns the index of the item if found. If it can't be found it'll return -1.
 *
 * @param {Array.<*>} haystack Items to search through.
 * @param {*} needle The item to look for.
 * @param {Function=} opt_comparator Comparator function.
 * @return {number} The index of the item if found, -1 if not.
 */
array.binarySearch = function (haystack, needle, opt_comparator) {
    var mid, cmp;
    var comparator = opt_comparator || array.numberSafeCompareFunction;
    var low = 0;
    var high = haystack.length;
    var found = false;

    while (low < high) {
        /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
         * to double (which gives the wrong results). */
        mid = low + (high - low >> 1);
        cmp = +comparator(haystack[mid], needle);

        if (cmp < 0.0) { /* Too low. */
            low = mid + 1;

        } else { /* Key found or too high */
            high = mid;
            found = !cmp;
        }
    }

    /* Key not found. */
    return found ? low : ~low;
};

/**
 * 把第二个值添加至数组
 * @param arr {Array} 数组
 * @param data {Array} 添加的对象
 */
array.extend = function (arr, data) {
    let i;
    const extension = Array.isArray(data) ? data : [data];
    const length = extension.length;
    for (i = 0; i < length; i++) {
        arr[arr.length] = extension[i];
    }
    return 0;
};

export default array;
