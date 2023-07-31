import { Form } from "./Form.js";
const trowel = {
    createForm: (querySelector, options) => {
        const container = document.querySelector(querySelector);
        if (!container) {
            throw new Error("Container not found");
        }
        return new Form(container, options);
    }
};
export default trowel;
