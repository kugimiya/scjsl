exports.promiseRequire = function (path) {
    return new Promise(function (resolve, reject) {
        require(path, function (err, exports) {
            if (err) reject(err);
            resolve(exports);
        })
    })
}