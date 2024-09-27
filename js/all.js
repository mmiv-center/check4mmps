var $result = null;

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

var seriesObject = {};

function validate(seriesObject) {
	// inspect the seriesObject and update the assessment

	var oked = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="green" class="bi bi-check" viewBox="0 0 16 16" title="Assessment OK">	<path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>  </svg>&nbsp;';
	var failed = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-bug" viewBox="0 0 16 16" title="Assessment found errors"> <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>  </svg>&nbsp;';

	// check for StudyDate
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {

		if (typeof seriesObject[entry]["StudyDate"] == "undefined" || seriesObject[entry]["StudyDate"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "StudyDate missing"]
		}
	}
	jQuery('#icon-study-date').children().remove();
	jQuery('#icon-study-date').text("");
	jQuery('#icon-study-date').append( (inspect?oked:failed) );
	jQuery('#collapseOne').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseOne').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseOne').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}

	// check for UIDs
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {

		if (typeof seriesObject[entry]["StudyInstanceUID"] == "undefined" || seriesObject[entry]["StudyInstanceUID"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "StudyInstanceUID missing"]
		}
		if (typeof seriesObject[entry]["SeriesInstanceUID"] == "undefined" || seriesObject[entry]["SeriesInstanceUID"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "SeriesInstanceUID missing"]
		}
		if (typeof seriesObject[entry]["SOPInstanceUID"] == "undefined" || seriesObject[entry]["SOPInstanceUID"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "SOPInstanceUID missing"]
		}
	}
	jQuery('#icon-unique-identifiers').children().remove();
	jQuery('#icon-unique-identifiers').text("");
	jQuery('#icon-unique-identifiers').append( (inspect?oked:failed) );
	jQuery('#collapseTwo').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseTwo').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseTwo').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}

	// check for CSA (if MRI and SIEMENS)
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {
		if (seriesObject[entry]["Manufacturer"] == "SIEMENS" && seriesObject[entry]["Modality"] == "MR" ) {
			if (typeof seriesObject[entry]["CSAImageHeaderInfo"] == "undefined" || seriesObject[entry]["CSAImageHeaderInfo"].length == 0) {
				inspect = false;
				failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "CSAImageHeaderInfo missing"]
			}
			if (typeof seriesObject[entry]["CSASeriesHeaderInfo"] == "undefined" || seriesObject[entry]["CSASeriesHeaderInfo"].length == 0) {
				inspect = false;
				failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "CSASeriesHeaderInfo missing"]
			}
		}
	}
	jQuery('#icon-csa').children().remove();
	jQuery('#icon-csa').text("");
	jQuery('#icon-csa').append( (inspect?oked:failed) );
	jQuery('#collapseThree').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseThree').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok, or no SIEMENS MRI series could be found.</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseThree').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}

	// check for Manufacturer
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {
		if (typeof seriesObject[entry]["Manufacturer"] == "undefined" || seriesObject[entry]["Manufacturer"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "Manufacturer missing"]
		}
	}
	jQuery('#icon-manufacturer').children().remove();
	jQuery('#icon-manufacturer').text("");
	jQuery('#icon-manufacturer').append( (inspect?oked:failed) );
	jQuery('#collapseFour').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseFour').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseFour').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}

	// check for PatientID PatientName
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {
		if (typeof seriesObject[entry]["PatientID"] == "undefined" || seriesObject[entry]["PatientID"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "PatientID missing"]
		}
		if (typeof seriesObject[entry]["PatientName"] == "undefined" || seriesObject[entry]["PatientName"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "PatientName missing"]
		}
	}
	jQuery('#icon-patientid-patientname').children().remove();
	jQuery('#icon-patientid-patientname').text("");
	jQuery('#icon-patientid-patientname').append( (inspect?oked:failed) );
	jQuery('#collapseFive').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseFive').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseFive').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}

	// check for SeriesDescription
	var inspect = true;
	var failedList = {};
	for (var entry in seriesObject) {
		if (typeof seriesObject[entry]["SeriesDescription"] == "undefined" || seriesObject[entry]["SeriesDescription"].length == 0) {
			inspect = false;
			failedList[entry+seriesObject[entry]["SeriesInstanceUID"]] = [entry, seriesObject[entry]["SeriesInstanceUID"], "SeriesDescription missing"]
		}
	}
	jQuery('#icon-series-description').children().remove();
	jQuery('#icon-series-description').text("");
	jQuery('#icon-series-description').append( (inspect?oked:failed) );
	jQuery('#collapseSix').find('div.failed_list').children().remove();
	if (Object.keys(failedList).length == 0) {
		jQuery('#collapseSix').find('div.failed_list').append("<div class=\"alert alert-success\" role=\"alert\">All series appear to be ok</div>");
	} else {
		var issues_found = "";
		var keys = Object.keys(failedList);
		for (var i = 0; i < keys.length; i++) {
			var entry = failedList[keys[i]][0];
			issues_found += "<li><span>PatientID: " + seriesObject[entry]["PatientID"] + "</span> <span>SeriesNumber: " + seriesObject[entry]["SeriesNumber"] + "</span>" + " <span>Reason: " + failedList[keys[i]][2] + "</li>";
		}
		jQuery('#collapseSix').find('div.failed_list').append("<ul>" + issues_found + "</ul>");
	}


}

// This function iterates through dataSet recursively and adds new HTML strings
// to the output array passed into it
function dumpDataSet(dataSet, output) {
	
	// we need to check the following tags
	// UIDs, SeriesDescription, StudyDate, PatientName, PatientID and Manufacturer 
	var validElementNames = {
		"x00100010": "PatientName", // needed
		"x00100020": "PatientID", // needed
		"x00100030": "PatientBirthDate",
		"x00100040": "Sex",
		"x00101010": "Age",
		"x00200011": "SeriesNumber",
		"x0020000e": "SeriesInstanceUID", // needed
		"x0008103e": "SeriesDescription", // needed
		"x0020000d": "StudyInstanceUID", // needed
		"x00080018": "SOPInstanceUID", // needed
		"x00080020": "StudyDate",        // needed
		"x00080030": "StudyTime",
		//"x00200013": "InstanceNumber",
		//"x00201041": "SliceLocation",
		"x00180024": "SequenceName",
		"x00180020": "ScanningSequence",
		"x00180021": "SequenceVariant",
		"x00180022": "ScanOptions",
		//"x00180023": "MRAcquisitionType",
		"x00080090": "ReferringPhysician",
		"x00291008": "CSAImageHeaderType",
		"x00291009": "CSAImageHeaderVersion",
		"x00291010": "CSAImageHeaderInfo",
		"x00291018": "CSASeriesHeaderType",
		"x00291019": "CSASeriesHeaderVersion",
		"x00291020": "CSASeriesHeaderInfo",
		"x00080060": "Modality", // needed
		"x00080070": "Manufacturer" // needed
	};
	var validElements = Object.keys(validElementNames);
	
	var captureValues = {};
	
	// the dataSet.elements object contains properties for each element parsed.  The name of the property
	// is based on the elements tag and looks like 'xGGGGEEEE' where GGGG is the group number and EEEE is the
	// element number both with lowercase hexadecimal letters.  For example, the Series Description DICOM element 0008,103E would
	// be named 'x0008103e'.  Here we iterate over each property (element) so we can build a string describing its
	// contents to add to the output array
	try {
		for (var propertyName in dataSet.elements) {
			if (!validElements.includes(propertyName))
				continue;
			
			var element = dataSet.elements[propertyName];
			
			// The output string begins with the element tag, length and VR (if present).  VR is undefined for
			// implicit transfer syntaxes
			var text = "<span class='" + validElementNames[propertyName] + "'>" + validElementNames[propertyName] + ": ";
			//text += " length=" + element.length;
			
			//if (element.hadUndefinedLength) {
			//    text += " <strong>(-1)</strong>";
			//}
			//text += "; ";
			
			//if (element.vr) {
			//    text += " VR=" + element.vr + "; ";
			//}
			
			var color = 'black';
			var title = "";
			
			// Here we check for Sequence items and iterate over them if present.  items will not be set in the
			// element object for elements that don't have SQ VR type.  Note that implicit little endian
			// sequences will are currently not parsed.
			if (element.items) {
				output.push('<li>' + text + '</li>');
				output.push('<ul>');
				
				// each item contains its own data set so we iterate over the items
				// and recursively call this function
				var itemNumber = 0;
				element.items.forEach(function (item) {
					output.push('<li>Item #' + itemNumber++ + ' ' + item.tag + '</li>')
					output.push('<ul>');
					dumpDataSet(item.dataSet, output);
					output.push('</ul>');
				});
				output.push('</ul>');
			} else if (element.fragments) {
				output.push('<li>' + text + '</li>');
				output.push('<ul>');
				
				// each item contains its own data set so we iterate over the items
				// and recursively call this function
				var itemNumber = 0;
				element.fragments.forEach(function (fragment) {
					var basicOffset;
					if(element.basicOffsetTable) {
						basicOffset = element.basicOffsetTable[itemNumber];
					}
					
					var str = '<li>Fragment #' + itemNumber++ + ' offset = ' + fragment.offset;
					str += '(' + basicOffset + ')';
					str += '; length = ' + fragment.length + '</li>';
					output.push(str);
				});
				output.push('</ul>');
			} else {
				// if the length of the element is less than 128 we try to show it.  We put this check in
				// to avoid displaying large strings which makes it harder to use.
				//if (element.length < 128) {
					// Since the dataset might be encoded using implicit transfer syntax and we aren't using
					// a data dictionary, we need some simple logic to figure out what data types these
					// elements might be.  Since the dataset might also be explicit we could be switch on the
					// VR and do a better job on this, perhaps we can do that in another example
					
					// First we check to see if the element's length is appropriate for a UI or US VR.
					// US is an important type because it is used for the
					// image Rows and Columns so that is why those are assumed over other VR types.
					//if (element.length === 2) {
						// text += " (" + dataSet.uint16(propertyName) + ")";
					//} else if (element.length === 4) {
						// text += " (" + dataSet.uint32(propertyName) + ")";
					//}
					
					// Next we ask the dataset to give us the element's data in string form.  Most elements are
					// strings but some aren't so we do a quick check to make sure it actually has all ascii
					// characters so we know it is reasonable to display it.
					var str = dataSet.string(propertyName);
					var stringIsAscii = isASCII(str);
					
					if (stringIsAscii) {
						// the string will be undefined if the element is present but has no data
						// (i.e. attribute is of type 2 or 3 ) so we only display the string if it has
						// data.  Note that the length of the element will be 0 to indicate "no data"
						// so we don't put anything here for the value in that case.
						if (typeof str !== "undefined") {
							if (validElementNames[propertyName] == "SeriesInstanceUID") {
								captureValues["SeriesInstanceUID"] = str;
							}
							if (validElementNames[propertyName] == "StudyInstanceUID") {
								captureValues["StudyInstanceUID"] = str;
							}
							if (validElementNames[propertyName] == "SOPInstanceUID") {
								captureValues["SOPInstanceUID"] = str;
							}
							if (validElementNames[propertyName] == "SeriesDescription") {
								captureValues["SeriesDescription"] = str;
							}
							if (validElementNames[propertyName] == "SeriesNumber") {
								captureValues["SeriesNumber"] = str;
							}
							if (validElementNames[propertyName] == "SequenceName") {
								captureValues["SequenceName"] = str;
							}
							if (validElementNames[propertyName] == "Modality") {
								captureValues["Modality"] = str;
							}
							if (validElementNames[propertyName] == "StudyDate") {
								captureValues["StudyDate"] = str;
							}
							if (validElementNames[propertyName] == "PatientID") {
								captureValues["PatientID"] = str;
							}
							if (validElementNames[propertyName] == "PatientName") {
								captureValues["PatientName"] = str;
							}
							if (validElementNames[propertyName] == "Manufacturer") {
								captureValues["Manufacturer"] = str;
							}
							// CSAImageHeaderInfo
							if (validElementNames[propertyName] == "CSAImageHeaderInfo") {
								captureValues["CSAImageHeaderInfo"] = str.length;
							}
							// CSASeriesHeaderInfo
							if (validElementNames[propertyName] == "CSASeriesHeaderInfo") {
								captureValues["CSASeriesHeaderInfo"] = str.length;
							}
							
						    text += '"' + safetext(str.slice(0,128)) + '"';
						}
					} else {
						if (element.length !== 2 && element.length !== 4) {
							color = '#C8C8C8';
							// If it is some other length and we have no string
							text += "<i>binary data</i>";
						}
					}
					
					if (element.length === 0) {
						color = '#C8C8C8';
						title = "no value stored in DICOM header";
					}
					
				/*} else {
					color = '#C8C8C8';
					
					// Add text saying the data is too long to show...
					text += "<i>data too long to show</i>";
				}*/
				// finally we add the string to our output array surrounded by li elements so it shows up in the
				// DOM as a list
				output.push('<li style="color:' + color + ';" ' + (title!=""?'title="' + title + '"':"") + '>' + text + '</li>');
				
			}
		}
	} catch(err) {
		var ex = {
			exception: err,
			output: output
		}
		throw ex;
	}
	if (typeof captureValues["SeriesInstanceUID"] !== "undefined"){
		if (typeof seriesObject[captureValues["SeriesInstanceUID"]] == "undefined") {
			seriesObject[captureValues["SeriesInstanceUID"]] = { 
				"Files": 0, 
				"SeriesNumber": captureValues["SeriesNumber"], 
				"SeriesDescription": captureValues["SeriesDescription"], 
				"SequenceName": (typeof captureValues["SequenceName"] == "undefined"?"missing":captureValues["SequenceName"]), 
				"Modality": captureValues["Modality"], 
				"PatientID": captureValues["PatientID"], 
				"PatientName": captureValues["PatientName"], 
				"StudyDate": captureValues["StudyDate"],
				"Manufacturer": captureValues["Manufacturer"],
				"SeriesInstanceUID": captureValues["SeriesInstanceUID"],
				"StudyInstanceUID": captureValues["StudyInstanceUID"],
				"SOPInstanceUID": captureValues["SOPInstanceUID"],
				"CSASeriesHeaderInfo": captureValues["CSASeriesHeaderInfo"],
				"CSAImageHeaderInfo": captureValues["CSAImageHeaderInfo"]
			};
		}
		seriesObject[captureValues["SeriesInstanceUID"]]["Files"] += 1;
	}
}

var safetext = function(text){
	var table = {
		'<': 'lt',
		'>': 'gt',
		'"': 'quot',
		'\'': 'apos',
		'&': 'amp',
		'\r': '#10',
		'\n': '#13'
	};
	if (typeof text == 'undefined') {
		return "";
	}
	
	return text.toString().replace(/[<>"'\r\n&]/g, function(chr){
		return '&' + table[chr] + ';';
	});
};

// parse the DOM to get a JSON of events and characters
function createJSONStructure() {
	var s = {
		participants: {}, // characters are the participants (PatientID)
		events: [] // events are the individual series (participant ids) by event (in order of display)
	};
	var _events = {};
	jQuery('#results ul.image').each(function() {
		var patientid = jQuery(this).find('span.PatientID').text();
		if (typeof s.participants[patientid] == 'undefined') {
			var k = patientid.replace('PatientID: ', "").replace(/\"/g, "");
			s.participants[k] = {
				id: k,
				patientid: k,
				affiliation: "light"
			};
		}
	});
	
	// now create the events
	// we need to sort the  events as well, the order is kept in the visualization
	jQuery('#results ul.image').each(function() {
		var patientid = jQuery(this).find('span.PatientID').text();
		patientid = patientid.replace('PatientID: ', "").replace(/\"/g, "");
		
		var sequencename = jQuery(this).find('span.SequenceName').text();
		sequencename = sequencename.replace('SequenceName: ', "").replace(/\"/g, "");
		
		var seriesnumber = jQuery(this).find('span.SeriesNumber').text();
		seriesnumber = seriesnumber.replace('SeriesNumber: ', "").replace(/\"/g, "");	
		
		var referringphysician = jQuery(this).find('span.ReferringPhysician').text();
		referringphysician = referringphysician.replace('ReferringPhysician: "EventName:', "").replace(/\"/g, "");	
		
		// an event is the same sequence name and series number at a given referring physician event
		var event_name = sequencename + "_" + seriesnumber + "_" + referringphysician;
		var ev = {
			'sequencename': sequencename,
			'seriesnumber': seriesnumber,
			'event': referringphysician,
			'patientid': patientid,
			'event_name': event_name
		};
		
		if (typeof _events[event_name] == 'undefined') {
			_events[event_name] = [ev];
		} else {
			var found = false;
			for (var i = 0; i < _events[event_name].length; i++) {
				if (_events[event_name][i].patientid == patientid) {
					found = true;
					break;
				}
			}	    
			if (!found)
				_events[event_name].push(ev);
		}
	});
	// an array of arrays
	_events = Object.values(_events);
	
	// now sort the events by event and seriesnumber
	_events.sort(function(a, b) {
		var aa = a[0]; // all the events in this list share the seriesnumber and event name
		var bb = b[0];
		if (parseInt(aa.event) == parseInt(bb.event)) {
			// if its the same event sort by series number
			return parseInt(aa.seriesnumber) - parseInt(bb.seriesnumber);
		}
		return parseInt(aa.event) - parseInt(bb.event);	
	});
	
	for (var i = 0; i < _events.length; i++) {
		var ss = { 'participants' : [],
			'event': _events[i][0].event,
			'seriesnumber': _events[i][0].seriesnumber
		};
		for (var j = 0; j < _events[i].length; j++) {
			ss.participants.push(_events[i][j].patientid);
		}
		s.events.push(ss);
	}
	
	s.participants = Object.values(s.participants);
	return s;
}

var lazyLoadingLimit = 10000;

jQuery(document).ready(function() {
	// Handle file upload logic
	$result = $("#results");
	
	let detailsList = [];
	
	$('#file').on('change', function (e) {
		e.preventDefault();
		jQuery('#results').children().remove();
		jQuery('#results').html("");
		var numFilesTotal = 0;
		
		// Closure to capture the file information.
		function handleFile(f) {
			var $title = $("<i>", {
				text : f.name
			});
			var $fileContent = $("<ul>");
			$result.append($title);
			$result.append($fileContent);
			
			var dateBefore = new Date();
			let counter = 0;
			
			JSZip.loadAsync(f).then(function(zip) {
				var dateAfter = new Date();
				$title.append($("<span>", {
					"class": "small",
					text:" (loaded in " + (dateAfter - dateBefore) + "ms)"
				}));
				numFilesTotal = numFilesTotal + Object.keys(zip.files).length;
				jQuery('#stat').html("Number of DICOM files: <span id='loadingCounter'>0</span>/" + numFilesTotal + " (<span id='errorCounter'>0</span> non-DICOM files ignored), Number of series: <span id='number-series'>0</span>");
				
				zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
				    var sanID = zipEntry.name.replace(/\//g, "_").replace(/\./g, "_").replace(/[^A-Za-z0-9]/g, "_");
					
					// append only first 10 entries
					if (counter < lazyLoadingLimit) {
						$fileContent.append("<li class='image-group' id='" + sanID + "'>[" + (counter+1) + "] "+ zipEntry.name + "</li>");
					}
					
					(function(nam, zipEntryName, counter) {
						zipEntry.async("uint8array").then(function(data) {
							// console.log("we received the data for " + nam + " - size: " + data.length);
							// parse the data and get all the DICOM tags here... or just one of them...
							var dataSet = null;
							try {
								dataSet = dicomParser.parseDicom(data);
							} catch(e) {
								// found an issue with this file, broken DICOM?
								// console.log("broken file?");
								var errorCounter = parseInt(jQuery("#errorCounter").text());
								errorCounter = errorCounter + 1;
								jQuery("#errorCounter").text(errorCounter);
								var loadingCounter = parseInt(jQuery("#loadingCounter").text());
								if (loadingCounter + errorCounter >= numFilesTotal) {
									jQuery('#done').html("Import finished.");
								}
								return;
							}
							var output = [];
							dumpDataSet(dataSet, output);
							
							if (counter < lazyLoadingLimit) {
								jQuery('#' + sanID).append('<ul class="image">' + output.join('') + '</ul>');
							} else {
								detailsList.push({
									'sanID': nam,
									'zipEntryName': zipEntryName,
									'htmlElem': output.join(''),
									'num': counter+1
								});
							}
							
							// update the seriesObject visual
							jQuery("#series-results").children().remove();
							var ks = Object.keys(seriesObject);
							ks.sort(function(a,b) {
								if (seriesObject[a]["PatientID"] < seriesObject[b]["PatientID"])
									return -1;
								if (seriesObject[a]["PatientID"] > seriesObject[b]["PatientID"])
									return 1;
								if (parseInt(seriesObject[a]["StudyInstanceUID"]) < parseInt(seriesObject[b]["StudyInstanceUID"]))
									return -1;
								if (parseInt(seriesObject[a]["StudyInstanceUID"]) > parseInt(seriesObject[b]["StudyInstanceUID"]))
									return 1;
								if (parseInt(seriesObject[a]["SeriesNumber"]) < parseInt(seriesObject[b]["SeriesNumber"]))
									return -1;
							});
							jQuery('#number-series').text(ks.length);
							//alert(safetext('A newline: \n see?'));
							
							// 
							validate(seriesObject);
							var colors = [ "#fbb4ae",	"#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"];
							var StudyInstanceUIDs = [];
							for (var i = 0; i < ks.length; i++) {
								if (StudyInstanceUIDs.indexOf(seriesObject[ks[i]]["StudyInstanceUID"]) == -1)
									StudyInstanceUIDs.push(seriesObject[ks[i]]["StudyInstanceUID"]);
							}
							//StudyInstanceUIDs = Object.keys(StudyInstanceUIDs); // .sort();
							for (var i = 0; i < ks.length; i++) {
								var sanSeriesInstanceUID = ks[i].replace(/\//g, "_").replace(/\./g, "_");
								
								jQuery('#series-results').append(`<div class="col-sm-12 col-lg-3 col-md-4 series" 
                                                                           id="ser-${sanSeriesInstanceUID}" style="background-color: ${colors[(StudyInstanceUIDs.indexOf(seriesObject[ks[i]]["StudyInstanceUID"])) % colors.length]};">
								     <div class="modality">${seriesObject[ks[i]]["Modality"]}</div>
								     <div class="studydate">${seriesObject[ks[i]]["StudyDate"]}</div>
									 <div class="patientid">PatientID: ${safetext(seriesObject[ks[i]]["PatientID"])}</div>
									 <div class="series_description" title="SeriesDescription">${safetext(seriesObject[ks[i]]["SeriesDescription"])}&nbsp;</div>
								     <div class="num_files">Number of files: ${seriesObject[ks[i]]["Files"]}</div>
								     <div class="series_number">${seriesObject[ks[i]]["SeriesNumber"]}</div>
								     <div class="sequence_name">SequenceName: ${seriesObject[ks[i]]["SequenceName"]}</div>
								     </div>`
								);
							}
							//console.log("finished on zip file");
							
							var loadingCounter = parseInt(jQuery("#loadingCounter").text());
							loadingCounter = loadingCounter + 1;
							jQuery("#loadingCounter").text(loadingCounter);
							
							// detect when we are ready... have looked at all files
							var errorCounter = parseInt(jQuery("#errorCounter").text());
							if (loadingCounter + errorCounter >= numFilesTotal) {
								jQuery('#done').html("import finished");
							}
						});
					})(sanID, zipEntry.name, counter);
					counter++;
				});
			}, function (e) {
				$result.append($("<div>", {
					"class" : "alert alert-danger",
					text : "Error reading " + f.name + ": " + e.message
				}));
			});
		}
		
		seriesObject = {};
		var files = e.target.files;
		for (var i = 0; i < files.length; i++) {
			jQuery('#done').html("start importing...");
			handleFile(files[i]);
		}	
	});
	
	// lazy load next `lazyLoadingLimit` number of entries
	$(window).scroll(function() {
		const scrollHeight = $(document).height();
		const scrollPosition = $(window).height() + $(window).scrollTop();
		
		if ((scrollHeight - scrollPosition) < 10) {
			const nextList = detailsList.splice(0, lazyLoadingLimit); // detailsList.slice(0, lazyLoadingLimit);
			nextList.map(function(elem) {
				var e = jQuery("<li class='image-group' id='" + elem['sanID'] + "'>[" + elem['num'] + "] " + elem['zipEntryName'] + '<ul class="image">' + elem['htmlElem'] + '</ul>' + "</li>");
				$('#results > ul').append(e);	
				//$('#results > ul').append("<li class='image-group' id='" + elem['sanID'] + "'>[" + elem['num'] + "] " + elem['zipEntryName'] + "</li>");
				//$('#' + elem['sanID']).append('<ul class="image">' + elem['htmlElem'] + '</ul>');
			});
			
		}
		
		if (scrollPosition > 1200) {
			$("#go-up-arrow").show();
		} else {
			$("#go-up-arrow").hide();
		}
	});
	
	jQuery(':file').on('fileselect', function(event, numFiles, label) {
		
		var input = $(this).parents('.input-group').find(':text'),
		log = numFiles > 1 ? numFiles + ' files selected' : label;
		
		if( input.length ) {
			input.val(log);
		} else {
			if( log ) alert(log);
		}
		
	});
	jQuery('#toggle-details').on('click', function() {
		var shown = true;
		if (jQuery('#results').is(":hidden")) {
			jQuery('#toggle-details').text("Hide Details");
			shown = false;
		}
		if (shown) {
			jQuery('#toggle-details').text("Show Details");
			jQuery('#results').hide();
		} else {
			jQuery('#results').show();
		}
	});

});
		
// This code will attach `fileselect` event to all file inputs on the page
$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    loadingCounter = 0;
    input.trigger('fileselect', [numFiles, label]);
});
