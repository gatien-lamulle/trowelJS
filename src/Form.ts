type typeField =
  | "text"
  | "search"
  | "tel"
  | "url"
  | "email"
  | "datetime"
  | "date"
  | "month"
  | "week"
  | "time"
  | "datetime-local"
  | "number"
  | "range"
  | "color"
  | "password"
  | "file"
  | "checkbox"
  | "radio"
  | "textarea"
  | "select";

type LabelType = "none" | "default" | "placeholder";

type CheckerType = "error" | "info" | "warning"

type Field = {
  "name": string;
  "type": typeField;
  "classes"?: string[];
  "id"?: string;
  "defaultValue"?: string;
  "placeholder"?: string;
  "label"?: string;
  "options"?: { name: string; value: string }[] | string[];
  "onChange"?: (event: Event) => string | void;
  "onFocus"?: (event: Event) => string | void;
  "onBlur"?: (event: Event) => string | void;
} | string;

type FieldContainer = {
  fields: Field[]
}

type submitValue = {
  "name": string;
  "type": typeField;
  "value": string;
};

type CheckerSubmit = {
  type?: CheckerType //default error
  condition: (values: submitValue[]) => boolean;
  message?: string;
  messageTimeMs?: number;
  messageColor?: string;
  blocking?: boolean; // default: if messageType=="error" then blocking=true else blocking=false
}

type FormOptions = {
  fields: (Field|FieldContainer)[];
  globalLabels?: LabelType;
  submit?: {
    "action"?: string;
    "name": string;
    "handler"?: (values: submitValue[]) => void;
    "checkers"?: CheckerSubmit[];
  };
};

class Form {
  formContainer: HTMLElement;
  fields: (Field|FieldContainer)[];
  globalLabels: LabelType;
  submit: {
    action?: string | undefined;
    name: string;
    handler?: ((values: submitValue[]) => void) | undefined;
    checkers?: CheckerSubmit[] | undefined;
  } | undefined;

  constructor(container: HTMLElement, options: FormOptions) {
    this.formContainer = container;
    this.fields = options.fields;
    this.globalLabels = options.globalLabels || "default";
    this.submit = options.submit;
    this.create();
  }

  create() {
    let currentContainer: HTMLElement = this.formContainer;
    const buttonSubmit = document.createElement("button");
    if (this.submit && this.submit.action) {
      const form = document.createElement("form");
      form.setAttribute("action", this.submit.action);
      this.formContainer.appendChild(form);
      currentContainer = form;
    }
    currentContainer.classList.add('form-default-container');
    buttonSubmit.setAttribute(
      "type",
      this.submit && this.submit.action ? "submit" : "button",
    );
    buttonSubmit.innerText = this.submit ? this.submit.name : "Submit";
    if (this.submit && (this.submit.handler || (this.submit.checkers && this.submit.checkers.length > 0))) {
      buttonSubmit.addEventListener("click", () => {
        let values: submitValue[] = [];
        Array.from(
          this.formContainer.querySelectorAll(
            "input, textarea, select",
          ) as NodeListOf<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >,
        ).map((node) => {
          values.push({
            name: node.name,
            value: node.value,
            type: node.type as typeField,
          });
        });
        let timeouts = []
        for (let checker of this.submit!.checkers!) {
          if (checker.condition(values)) {
            if (checker.message) {
              let checkerMessage = document.getElementById("checker-msg");
              checkerMessage!.innerHTML = checker.message!;
              checkerMessage!.hidden = false;
              checkerMessage!.style.color = checker.messageColor ? checker.messageColor : 
                (checker.type === "info" ? "#47ab00" : (checker.type === "warning" ? "#f6c724" : "#e56565"))
              if (checker.messageTimeMs) {
                timeouts.push(setTimeout(() => {
                  checkerMessage!.innerHTML = "";
                  checkerMessage!.hidden = true;
                }, checker.messageTimeMs!));
              } else {
                timeouts.forEach(e => clearTimeout(e));
              }
            }
            if (checker.blocking || (checker.blocking === undefined && (checker.type === "error" || checker.type === undefined))) {
              return;
            }
          }
        }
        this.submit!.handler!(values);
      });
    }
    for (let field of this.fields) {
      const fieldContainer = document.createElement("div");
      fieldContainer.classList.add('field-container');
      if ((field as FieldContainer).fields) {
        for (let f of (field as FieldContainer).fields) {
        this.addFieldToContainer(f, fieldContainer);
        }
      } else {
        this.addFieldToContainer(field as Field, fieldContainer);
      }
      currentContainer.appendChild(fieldContainer);
    }
    buttonSubmit.classList.add('btn-submit')
    const checkerMessage = document.createElement('p');
    checkerMessage.classList.add("checker-message");
    checkerMessage.id = "checker-msg"
    checkerMessage.hidden = true;
    currentContainer.appendChild(checkerMessage);
    currentContainer.appendChild(buttonSubmit);
  }

  addFieldToContainer(field: Field, fieldContainer: HTMLElement) {
    let labelContainer = null;
    if (typeof field === "string") {
      const fieldElement = document.createElement("input");
      fieldElement.name = field;
      if (this.globalLabels === "default") {
        labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container");
        const label = document.createElement("label");
        label.innerText = field;
        label.htmlFor = field;
        fieldElement.id = field;
        // fieldContainer.appendChild(label);
        labelContainer.appendChild(label);
      } else if (this.globalLabels === "placeholder") {
        fieldElement.placeholder = field;
      }
      if (labelContainer) {
        labelContainer.appendChild(fieldElement);
        fieldContainer.appendChild(labelContainer);
      } else {
        fieldContainer.appendChild(fieldElement);
      }
    } else {
      field = (field as Field)
      if (typeof field === 'string') return
      let fieldElement:
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      switch (field.type) {
        case "textarea":
          fieldElement = document.createElement("textarea");
          if (field.defaultValue) fieldElement.innerText = field.defaultValue;
          break;
        case "select":
          if (!field.options || field.options.length === 0) {
            throw new Error("Options needed for 'select' type field");
          }
          fieldElement = document.createElement("select");
          for (let opt of field.options!) {
            let option = document.createElement("option");
            if (typeof opt === "string") {
              option.innerText = opt;
              option.value = opt;
            } else {
              option.innerText = opt.name;
              option.value = opt.value;
            }
            if (field.defaultValue && field.defaultValue === option.value) {
              option.selected = true;
            }
            fieldElement.appendChild(option);
          }
          break;
        default:
          fieldElement = document.createElement("input");
          fieldElement.type = field.type;
          if (field.defaultValue) fieldElement.value = field.defaultValue;
          break;
      }
      fieldElement.name = field.name;
      if (this.globalLabels === "default" || field.label) {
        labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container");
        const label = document.createElement("label");
        label.innerText = field.label || field.name;
        label.htmlFor = field.name;
        fieldElement.id = field.name;
        labelContainer.appendChild(label);
      } else if ((this.globalLabels === "placeholder" || field.placeholder) && !(fieldElement instanceof HTMLSelectElement)) {
        fieldElement.placeholder = field.placeholder || field.name;
      }
      if (field.classes) fieldElement.classList.add(...field.classes);
      if (field.id && !(this.globalLabels === "default" || field.label)) fieldElement.id = field.id;
      if (field.onChange) fieldElement.onchange = field.onChange;
      if (field.onBlur) fieldElement.onblur = field.onBlur;
      if (field.onFocus) fieldElement.onfocus = field.onFocus;
      if (labelContainer) {
        labelContainer.appendChild(fieldElement);
        fieldContainer.appendChild(labelContainer);
      } else {
        fieldContainer.appendChild(fieldElement);
      }
    }
  }

}

export {
  FormOptions,
  Form
}

// {
//   fields:
//   [{
//     name,
//   }];
// }
