// TODO: parse module path ('./foo/bar.js' same as 'foo/bar.js')
// TODO: messages and errors handling

/**
 * SCJSL
 * Simple CommonJS Loader
 */
(function (options) {
    var states = ['UNSENT', 'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'];
    var modules = {};

    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        if (obj instanceof Date)
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }

        return temp;
    }

    function evalFunction (body) {
        return '(function (exports) {\n'
            + body
            + '\n'
            + 'return exports;})({});';
    }

    function xhrReadyStateChangeHandler (path, xhr, cb) {
        return function xhrReadyStateChangeHandlerInner () {
            if (options.logNet) console.log(
                'REQUIRE: ' + path + ' : STATE CHANGED TO "' + states[xhr.readyState] + '"'
            );

            if ((xhr.readyState == 4) && (xhr.status == 200 || xhr.status == 304)) {
                var exports = eval( evalFunction( xhr.responseText ) );

                if (options.cache) {
                    modules[path] = clone(exports);
                }

                cb(null, exports);
            }
        }
    }

    function xhrError (path, xhr, cb) {
        return function xhrErrorInner (ev) {
            cb(ev, null);
        }
    }

    function require (path, cb) {
        if (!path) {
            throw new Error('require function should pass `path` variable')
        }

        if (options.cache && (typeof modules[path] != typeof undefined)) {
            cb(null, modules[path]);
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', options.urlBase + path, options.async);
        xhr.onreadystatechange = xhrReadyStateChangeHandler(path, xhr, cb);
        xhr.onerror = xhrError(path, xhr, cb);
        xhr.send();
    }

    options.window.require = require;
})({
    async: true,
    cache: true,
    urlBase: location.href,
    logNet: true,
    window: window
});