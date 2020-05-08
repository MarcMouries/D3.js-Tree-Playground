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
    "type"         : "person",
    "name"         : "Eric Fox",
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

  

  var arrests = {
    "name": "Arrests",
    "parent": "Eric Fox",
    children: []
};

var residences = {
    "name": "Residences",
    "parent": "Eric Fox",
    children: []
};
var family_members = {
    "name": "Family",
    "parent": "Eric Fox"
};
var vehicles = {
    "name": "Vehicles",
    "parent": "Eric Fox"
};
var charges = {
    "name": "Charges",
    "parent": "Eric Fox"
};


var residence_A = {
    "parent": "Known Addresses",
    "name": "179 WALNUT STREET",
    type: "address",
    city: "Douglas",
    state: "MA",
    zip: "11516"
};
var residence_B = {
    "parent": "Known Addresses",
    "name": "179 WALNUT STREET",
    type: "address",
    city: "Douglas",
    state: "MA",
    zip: "11516"
};

residences.children.push(residence_A);
residences.children.push(residence_B);


// the flat data
var flat_tree = [];
flat_tree.push(person);


flat_tree.push(arrests);
flat_tree.push(charges);
flat_tree.push(family_members);
flat_tree.push(residences);
flat_tree.push(vehicles);

