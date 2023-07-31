import trowel from '../node_modules/troweljs/dist/index.js';


//dom loaded 
document.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');

    trowel.createForm("#form", {
        fields: [{ fields: ['firstname', { name: 'lastname', label: "Nom de famille", }] }, { name: 'email', type: 'textarea' }, { fields: ['address', 'city', { name: 'state', label: "Etat" }] }, { name: "number", type: 'number' }],
        submit: {
            name: "Valider",
            handler: (data) => {
                console.log(data);
            },
            checkers: [
                {
                    condition: (values => {
                        return !values.find(e => e.name == 'email').value
                    }),
                    message: "Field Email empty !",
                    messageTimeMs: 5000,
                    type: "info"
                },
                {
                    condition: (values => {
                        return !values.find(e => e.name == 'lastname').value
                    }),
                    message: "Field Lastname empty !",
                    messageTimeMs: 5000,
                    type: "warning"
                },
                {
                    condition: (values => {
                        return !values.find(e => e.name == 'address').value
                    }),
                    message: "Field address empty !",
                    type: "error",
                    blocking: false
                },
            ]


        }
    })
});