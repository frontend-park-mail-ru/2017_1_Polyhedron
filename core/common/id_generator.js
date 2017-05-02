'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function getIdGenerator() {
    let id = 0;
    return () => ++id;
}
exports.getIdGenerator = getIdGenerator;
//# sourceMappingURL=id_generator.js.map