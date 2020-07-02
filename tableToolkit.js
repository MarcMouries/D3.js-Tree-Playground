/**
 * 
 */
var tableToolkit = {

	/**
	 * Create a tableless container for the data specified
	 * 
	 * @param {*} table_class the css class for the table
	 * @param {*} data contains the data to be presented in the form
	 * @param {*} fields_header 
	 * @param {*} fields_content 
	 * @param {*} fields_footer 
	 * @returns Document
	 */
	createTable: function (
		table_class, data, fields_header, fields_content, fields_footer, nb_of_columns) {

		var html = "<table class=" + table_class + ">";

		// HEADER
		var print_field_name = false;
		html += this._printFields(data, fields_header, "thead",  print_field_name, nb_of_columns);

		// FIELDS
		print_field_name = true;
		html += this._printFields(data, fields_content, "tbody", print_field_name, nb_of_columns);

		// FOOTER
		html += this._printFields(data, fields_footer, "tfoot", print_field_name, nb_of_columns);

		html += "</table>";
		return html;
	},


	// print the list of fields from the data in the container specified
	_printFields: function (data, field_list, container, print_field_name, nb_of_columns) {

		var html = "";
		html += "<" + container + ">";

		var number_of_fields = field_list.length;
		var number_of_col = (print_field_name ? 2 * number_of_fields : number_of_fields);
		var number_of_row = Math.round(number_of_col /nb_of_columns );
		// there is at leat one row
		if (number_of_row <1) { number_of_row ++;}
		var number_of_field_per_row = Math.round(number_of_fields / number_of_row);

		var field_data_id = 1;
		var row_number = 1;
		for (;row_number <= number_of_row; row_number++) {
			//console.log(" ROW " + row_number + "/" + number_of_row);
			var column_start = "";
			var column_end = "";
			if (container == "thead") {
				column_start = "<th";
				column_end = "</th>";
			} else {
				column_start = "<td";
				column_end = "</td>";
			}
			html += "<tr>";

			var nb_col_printed = 1;
			for (var field_number=1; field_number <= number_of_field_per_row; field_number++) {
				// no more data
				if (field_data_id > number_of_fields) {
					continue;
				}

				var field = field_list[field_data_id-1];
				//console.log( "   FIELD " + field_data_id  + "/" + number_of_fields);

				var field_name = field;
				if (print_field_name) {
					html += column_start + ">" + field_name + column_end;
					//console.log("     col " + nb_col_printed + "/" + nb_cols_in_table	+ " "  + field_name );
					nb_col_printed++;
				}
				var field_value = data[field];

				//console.log("     col " + nb_col_printed + "/" + nb_cols_in_table	+ " "   + field_value );

				//  & 
				var last_field =  (field_data_id == number_of_fields);
				var more_column_to_fill = (nb_col_printed < nb_of_columns);
				if (last_field && more_column_to_fill) {
					var colspan = (nb_of_columns - nb_col_printed) + 1;
					//console.log("     colspan=" + colspan);
					html += column_start + " colspan=" + colspan;
				} else {
					html += column_start;
				}
				html += ">" + field_value + column_end;
				nb_col_printed++;
				field_data_id++;
			}
			html += "</tr>";
		}
		html += "</" + container + ">";
		return html;
	}

}