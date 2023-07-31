type typeField = "text" | "search" | "tel" | "url" | "email" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "password" | "file" | "checkbox" | "radio" | "textarea" | "select";
type LabelType = "none" | "default" | "placeholder";
type CheckerType = "error" | "info" | "warning";
type Field = {
    "name": string;
    "type": typeField;
    "classes"?: string[];
    "id"?: string;
    "defaultValue"?: string;
    "placeholder"?: string;
    "label"?: string;
    "options"?: {
        name: string;
        value: string;
    }[] | string[];
    "onChange"?: (event: Event) => string | void;
    "onFocus"?: (event: Event) => string | void;
    "onBlur"?: (event: Event) => string | void;
} | string;
type FieldContainer = {
    fields: Field[];
};
type submitValue = {
    "name": string;
    "type": typeField;
    "value": string;
};
type CheckerSubmit = {
    type?: CheckerType;
    condition: (values: submitValue[]) => boolean;
    message?: string;
    messageTimeMs?: number;
    messageColor?: ColorGamut;
    blocking?: boolean;
};
type FormOptions = {
    fields: (Field | FieldContainer)[];
    globalLabels?: LabelType;
    submit?: {
        "action"?: string;
        "name": string;
        "handler"?: (values: submitValue[]) => void;
        "checkers"?: CheckerSubmit[];
    };
};
declare class Form {
    formContainer: HTMLElement;
    fields: (Field | FieldContainer)[];
    globalLabels: LabelType;
    submit: {
        action?: string | undefined;
        name: string;
        handler?: ((values: submitValue[]) => void) | undefined;
        checkers?: CheckerSubmit[] | undefined;
    } | undefined;
    constructor(container: HTMLElement, options: FormOptions);
    create(): void;
    addFieldToContainer(field: Field, fieldContainer: HTMLElement): void;
}
export { FormOptions, Form };
