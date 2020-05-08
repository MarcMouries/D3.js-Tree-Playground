var _person = {
    "name": "Person",
    "parent": null,
    "first_name": "John",
    "last_name": "Doe",
    age: 50,
    eye_color: "blue"
};

var person = {
    "parent"       : null,
    "name"         : "root",
    "full name"    : "Eric Fox",
    "Age"          : "44",
    "Race"         : "White",
    "Sex"          : "Male",
    "Hair"         : "Black",
    "Eyes"         : "Brown",
    "Build"        : "Medium",
    "Height"       : "5'8",
    "Weight"       : "180 lbs",
    "Scars & Marks": "has a mole on his right cheek below the eye"
  };


var known_addresses = {
    "name": "Known Addresses",
    "parent": "root",
    children: []
};
var family_members = {
    "name": "Family",
    "parent": "root"
};
var vehicles = {
    "name": "Vehicles",
    "parent": "root"
};
var charges = {
    "name": "Charges",
    "parent": "root"
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