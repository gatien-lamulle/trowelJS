"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Form_js_1 = require("./Form.js");
const trowel = {
    createForm: (querySelector, options) => {
        const container = document.querySelector(querySelector);
        if (!container) {
            throw new Error("Container not found");
        }
        return new Form_js_1.Form(container, options);
    }
};
exports.default = trowel;
