(function (scope) {
    var Emmiter = function () {
        this.handlersStack = {};
    }
    
    Emmiter.prototype.on = function (name, cb) {
        if (!this.handlersStack[name]) {
            this.handlersStack[name] = [];
        }
        this.handlersStack[name].push(cb);
    }
    
    Emmiter.prototype.emit = function (name, eventData) {
        if (!this.handlersStack[name]) return;
        this.handlersStack[name].forEach(function (handler) {
            handler(eventData);
        });
    }
    
    scope.emitter = new Emmiter();
})(window);


// Promisify SCJSL
require('etc/modules/require-promise.js', function (err, exports) {
    if (err) throw new Error(err);
    window.promiseRequire = exports.promiseRequire;
    window.emitter.emit('proto-init', null);
});


// test-component initialisation
// if document isnt contain any .js-replace-text nodes
// component wont be loaded
window.emitter.on('proto-init', function () {
    // Now check our HTML for containing some microformat and make stuff
    var replaceTextElements = document.querySelectorAll('.js-replace-text');
    if (!replaceTextElements.length) return;

    // Example with using promises
    promiseRequire('etc/modules/test-component.js')
    .then(function (module) {
        module.replace(replaceTextElements)
    })
    .catch(function (err) {
        console.error('something went wrong!');
    });
});

// test module scope mutation
// spoiler: mutation (we can create sigletons too easy, also)
window.emitter.on('proto-init', function () {
    promiseRequire('etc/modules/is-mutable.js')
    .then(function (module) {
        console.log(module.test(2))
    })
    .then(function () {
        return promiseRequire('etc/modules/is-mutable.js')
    })
    .then(function (module) {
        console.log(module.test(2))
    });
});
