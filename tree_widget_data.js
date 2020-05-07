var person = {
    "name": "Person",
    "parent": null,
    "first_name": "John",
    "last_name": "Doe",
    age: 50,
    eye_color: "blue"
};

var known_addresses = {
    "name": "Known Addresses",
    "parent": "Person",
    children: []
};
var family_members = {
    "name": "Family",
    "parent": "Person"
};
var vehicles = {
    "name": "Vehicles",
    "parent": "Person"
};
var charges = {
    "name": "Charges",
    "parent": "Person"
};


var known_address_A = {
    "parent": "Known Addresses",
    "name": "179 WALNUT STREET",
    type: "address",
    city: "Douglas",
    state: "MA",
    zip: "11516"
};
var known_address_B = {
    "parent": "Known Addresses",
    "name": "179 WALNUT STREET",
    type: "address",
    city: "Douglas",
    state: "MA",
    zip: "11516"
};

known_addresses.children.push(known_address_A);
known_addresses.children.push(known_address_B);


// the flat data
var flat_tree = [];
flat_tree.push(person);
flat_tree.push(known_addresses);
flat_tree.push(family_members);
flat_tree.push(vehicles);
flat_tree.push(charges);