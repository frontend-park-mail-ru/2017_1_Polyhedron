'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function getIdGenerator() {
    var id = 0;
    return function () { return ++id; };
}
exports.getIdGenerator = getIdGenerator;
//# sourceMappingURL=id_generator.js.map