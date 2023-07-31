# TrowelJS - An Easy-to-Use Node Module for Creating Multiples Components


<img width="150" src="./static/resources/trowel.png">


TrowelJS is a Node.js module designed to simplify the process of generating various pre-builds-components directly within your code. These components are called `Bricks`.

At the moment, it supports only form creation. The module provides a straightforward and intuitive API to create and customize forms effortlessly.

<sub>
<a href="https://www.flaticon.com/free-icons/trowel" title="trowel icons"><i>Trowel icons created by Freepik - Flaticon</i></a>
</sub>

### 🚧 Work In Progress 🚧
More bricks coming soon...

## Example Usage

Here's an example of how you can use TrowelJS to create a form:

```javascript
const trowel = require('troweljs');

trowel.createForm("#form", {
  fields: [
    { fields: ['firstname', { name: 'lastname', label: "Your lastname" }] },
    { name: 'email', type: 'textarea' },
    { fields: ['address', 'city', { name: 'state', label: "State name" }] },
    { name: "number", type: 'number' }
  ],
  submit: {
    name: "Validate",
    handler: (data) => {
      console.log(data);
    },
    checkers: [
      {
        condition: (values => {
          return !values.find(e => e.name == 'email').value;
        }),
        message: "Field email empty !",
        messageTimeMs: 5000,
        type: "info"
      },
      {
        condition: (values => {
          return !values.find(e => e.name == 'lastname').value;
        }),
        message: "Field lastname empty !",
        messageTimeMs: 5000,
        type: "warning"
      },
      {
        condition: (values => {
          return !values.find(e => e.name == 'address').value;
        }),
        message: "Field address empty !",
        type: "error",
        blocking: false
      },
    ]
  }
});
```

## Installation

~~You can install TrowelJS using npm:~~

```
npm install troweljs
```
⚠️ NPM NOT YET AVAILIBLE ⚠️

Clone this repo and use test folder with static http-server instead.

## Getting Started

To get started, import the module into your project:

```javascript
const trowel = require('troweljs');
```

Then, you can create and customize forms in your code using the `createForm` function as shown in the example above.

## Documentation

The `createForm` function is the main function used to generate and render a form within a specified container. It takes two parameters:

1. `container`: The container element or selector where the form will be rendered. It can be either an HTML element or a valid CSS selector representing the container element.

2. `options`: An object of type `FormOptions`, containing the configuration options for creating the form. The `FormOptions` type includes properties for defining the form's fields, default label type, and submit action.

You can use these tables as a reference to understand the parameters and their types when using the `createForm` function in TrowelJS.


### createForm Function Properties

| Parameter | Type            | Description                                                                                                                     |
|-----------|-----------------|---------------------------------------------------------------------------------------------------------------------------------|
| container | string \| HTMLElement | The container element or selector where the form will be rendered. It can be either an HTML element or a valid CSS selector. |
| options   | [FormOptions](#formoptions-properties)     | An object containing the configuration options for creating the form.                                                            |


### FormOptions Properties

| Property        | Type                    | Explanation                                                                                                                     |
|-----------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| fields          | ([Field](#field-properties) \| FieldContainer)[] | An array of fields or field containers that define the structure of the form. Field containers allow grouping multiple fields. Field can be and object or a simple string representing the field name, in which case the value of type is "text" by default. |
| globalLabels    | LabelType \| undefined  | (Optional) The default label type for all fields. It can be "none", "default", or "placeholder".                              |
| submit          | [SubmitAction](#submit-action-properties) \| undefined | (Optional) An object representing the submit action properties.                                                               

### Field Properties


| Property        | Type                      | Explanation                                                                                                       |
|-----------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| name            | string                    | The name of the field, used as the identifier for the field.                                                     |
| type            | [typeField](#typefield-possibles-values)                 | The type of the field (e.g., text, checkbox, select, etc.).                                                       |
| classes         | string[]                  | (Optional) An array of CSS class names to apply custom styles to the field.                                       |
| id              | string                    | (Optional) The HTML element ID for the field.                                                                     |
| defaultValue    | string                    | (Optional) The default value to be displayed in the field.                                                        |
| placeholder     | string                    | (Optional) A placeholder text to show in the field when it is empty.                                              |
| label           | string                    | (Optional) The label text to display alongside the field.                                                         |
| options         | { name: string, value: string }[] \| string[] | (Needed if type is "select", optional else) An array of objects representing options for a select field. TrowelJS allows you to define selectable choices either as an array of strings (where name and value are the same) or as an array of objects (specifying separate name and value properties)        |
| onChange        | (event: Event) => string \| void    | (Optional) A function called when the field's value changes. It can return a string or nothing (void).        |
| onFocus         | (event: Event) => string \| void    | (Optional) A function called when the field receives focus. It can return a string or nothing (void).          |
| onBlur          | (event: Event) => string \| void    | (Optional) A function called when the field loses focus. It can return a string or nothing (void).            |

`Field` can be a simple string representing the field name, in which case the value of type is "text" by default.

The `Field` type represents a single form field and its associated properties. You can use these properties to customize the behavior and appearance of each field when creating forms with TrowelJS.

By using the `FieldContainer`, you can nest multiple fields. It allows you to create more complex forms with organized groupings, improving the overall user experience.


```javascript

// Create a form for personal information
trowel.createForm("#personal-info-form", {
  fields: [
    // FieldContainer for first name and last name
    {
      fields: [
        { name: 'firstname', type: 'text', label: 'First Name' },
        { name: 'lastname', type: 'text', label: 'Last Name' }
      ]
    },
    { name: 'email', type: 'email', label: 'Email Address' },
    { name: 'address', type: 'textarea', label: 'Address' },
    { name: 'city', type: 'text', label: 'City' },
    { name: 'state', type: 'text', label: 'State' },
    { name: 'zip', type: 'number', label: 'Zip Code' }
  ],
  submit: {
    // Add submits infos
  }
});
```

In the above example, we used a `FieldContainer` to group the first name and last name fields together. This creates a logical separation of fields in the form while maintaining a clean and organized structure.


### Submit Action Properties

| Property        | Type                    | Explanation                                                                                          |
|-----------------|-------------------------|------------------------------------------------------------------------------------------------------|
| action          | string \| undefined     | (Optional) The URL or action to be performed when the form is submitted.                             |
| name            | string                  | The label or text for the submit button.                                                             |
| handler         | (values: [submitValue](#submitvalue-properties)[]) => void \| undefined | (Optional) A function called when the form is submitted. It receives an array of submit values as input. |
| checkers        | [CheckerSubmit](#checker-properties)[] \| undefined | (Optional) An array of checker objects to validate the form before submission.                      |

### Checker Properties

| Property        | Type                    | Explanation                                                                                     |
|-----------------|-------------------------|-------------------------------------------------------------------------------------------------|
| type            | CheckerType \| undefined | (Optional) The type of the checker, which can be "error", "info", or "warning".                 |
| condition       | (values: [submitValue](#submitvalue-properties)[]) => boolean | A function that evaluates the condition for the checker. It receives an array of submit values as input and returns a boolean value. |
| message         | string \| undefined     | (Optional) The message to be displayed if the condition of the checker is met.                   |
| messageTimeMs   | number \| undefined     | (Optional) The time in milliseconds for displaying the message.                                 |
| messageColor    | string \| undefined | (Optional) The color of the message. Represented as a valid CSS color value                                                             |
| blocking        | boolean \| undefined    | (Optional) Determines if the checker should block form submission on failure. Default: true for "error" type checkers, false otherwise. |


### submitValue Properties

| Property | Type   | Explanation                                                                              |
|----------|--------|------------------------------------------------------------------------------------------|
| name     | string | The name of the submit value, which corresponds to the `name` property of the field.    |
| type     | [typeField](#typefield-possibles-values)  | The type of the submit value, which corresponds to the `type` property of the field.    |
| value    | string | The value of the submit value, which represents the user-inputted value of the field.   |

The `submitValue` type represents a single form field's value when the form is submitted. It contains the `name`, `type`, and `value` properties, providing information about the field that was submitted and its corresponding value.

You can use this table as a reference to understand the properties of the `submitValue` objects received by the `handler` function when the form is submitted.

### typeField Possibles Values

typeField in TrowelJS represents the HTML input type attribute values for form fields.

Here is the list of possible values:

```
| Type             | Description                        |
|------------------|------------------------------------|
| text             | Single-line text input             |
| search           | Search input                       |
| tel              | Telephone number input             |
| url              | URL input                          |
| email            | Email address input                |
| datetime         | Date and time input                |
| date             | Date input                         |
| month            | Month input                        |
| week             | Week input                         |
| time             | Time input                         |
| datetime-local   | Local date and time input          |
| number           | Number input                       |
| range            | Slider input                       |
| color            | Color picker input                 |
| password         | Password input (hidden text)       |
| file             | File upload input                  |
| checkbox         | Checkbox input                     |
| radio            | Radio button input                 |
| textarea         | Multiline text input               |
| select           | Dropdown select input              |
```

### Styling Bricks

To add styles and enhance the appearance of your bricks, you can import the TrowelJS CSS file into your website's CSS file. Here's how you can do it:

1. Assuming you have installed TrowelJS using npm, ensure that the TrowelJS package is available in your project's `node_modules` folder.

2. Create or open your website's main CSS file.

3. Import the TrowelJS styles by adding the following lines to your CSS file according to the bricks you want to customize:

#### Forms
   ```css
   @import url('../node_modules/troweljs/static/styles/form.css');
   ```

By importing the TrowelJS CSS, you can easily apply predefined styles to your bricks. 

However, TrowelJS allows further customization to tailor the bricks to your specific needs. Feel free to explore other CSS rules and classes provided by TrowelJS to customize various bricks elements further.

## Contributing

If you find any issues or have ideas for improvements, feel free to contribute!

## License

TrowelJS is licensed under the [MIT License](https://github.com/yourusername/troweljs/blob/main/LICENSE).
```
Feel free to customize the example usage and add more sections or details based on your project's requirements. Don't forget to replace the placeholders (e.g., `yourusername`, `ColorGamut`, and `https://example.com/troweljs-logo.png`) with the appropriate information and URLs for your project.