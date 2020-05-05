/**
 * 
 */
var treeDataToolkit = {

    convertFlatRelationshipsToTree: function(flat_tree){

    // create a name: node map
    var dataMap = flat_tree.reduce(function(map, node) {
        map[node.name] = node;
        return map;
    }, {});

// create the tree array
var treeData = [];
flat_tree.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});


        return treeData;
    }
}


