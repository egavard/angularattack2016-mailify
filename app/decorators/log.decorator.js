"use strict";
/**
 * Created by egavard on 14/05/16.
 */
function log() {
    return function (target, key, descriptor) {
        if (descriptor) {
            return {
                value: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    var a = args.map(function (a) { return JSON.stringify(a); }).join();
                    var result = descriptor.value.apply(this, args);
                    console.log(key + "(" + a + ")");
                    return result;
                }
            };
        }
    };
}
exports.log = log;
//# sourceMappingURL=log.decorator.js.map