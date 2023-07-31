import {FormOptions, Form} from "./Form.js";


const trowel = {
    createForm: (querySelector: string, options: FormOptions) => {
        const container: HTMLElement | null = document.querySelector(querySelector);
        if (!container) {
            throw new Error("Container not found");
        }
        return new Form(container, options);
    }
}

export default trowel;