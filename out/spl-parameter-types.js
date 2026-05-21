"use strict";
/**
 * SPL Command Parameter Type Definitions
 * Shared types used by both spl-commands-database and spl-command-parameters
 * This file exists to avoid circular dependencies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterType = void 0;
/**
 * Parameter type classification for SPL command arguments
 */
var ParameterType;
(function (ParameterType) {
    /** Named parameter with key=value syntax (e.g., maxlines=10) */
    ParameterType["NAMED"] = "named";
    /** Positional parameter that must appear in specific order (e.g., <field>) */
    ParameterType["POSITIONAL"] = "positional";
    /** Field reference that doesn't use key=value syntax */
    ParameterType["FIELD"] = "field";
    /** Clause keyword (e.g., AS, BY, OVER, WHERE) */
    ParameterType["CLAUSE"] = "clause";
    /** Multiple values allowed (e.g., field list) */
    ParameterType["MULTI_VALUE"] = "multi_value";
})(ParameterType || (exports.ParameterType = ParameterType = {}));
//# sourceMappingURL=spl-parameter-types.js.map