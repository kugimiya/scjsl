var test = 5

exports.test = function (number) {
    console.log(test)
    test = number;
    return number + test;
}