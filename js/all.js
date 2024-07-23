var $result = null;

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

var seriesObject = {};

// This function iterates through dataSet recursively and adds new HTML strings
// to the output array passed into it
function dumpDataSet(dataSet, output) {
	
	var validElementNames = {
		"x00100010": "PatientName",
		"x00100020": "PatientID",
		"x00100030": "PatientBirthDate",
		"x00100040": "Sex",
		"x00101010": "Age",
		"x00200011": "SeriesNumber",
		"x0020000e": "SeriesInstanceUID",
		"x0008103e": "SeriesDescription",
		"x0020000d": "StudyInstanceUID",
		"x00080020": "StudyDate",
		"x00080030": "StudyTime",
		"x00200013": "InstanceNumber",
		"x00201041": "SliceLocation",
		"x00180024": "SequenceName",
		"x00180020": "ScanningSequence",
		"x00180021": "SequenceVariant",
		"x00180022": "ScanOptions",
		"x00180023": "MRAcquisitionType",
		"x00080090": "ReferringPhysician"
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
				if (element.length < 128) {
					// Since the dataset might be encoded using implicit transfer syntax and we aren't using
					// a data dictionary, we need some simple logic to figure out what data types these
					// elements might be.  Since the dataset might also be explicit we could be switch on the
					// VR and do a better job on this, perhaps we can do that in another example
					
					// First we check to see if the element's length is appropriate for a UI or US VR.
					// US is an important type because it is used for the
					// image Rows and Columns so that is why those are assumed over other VR types.
					if (element.length === 2) {
						// text += " (" + dataSet.uint16(propertyName) + ")";
					} else if (element.length === 4) {
						// text += " (" + dataSet.uint32(propertyName) + ")";
					}
					
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
						if (str !== undefined) {
							if (validElementNames[propertyName] == "SeriesInstanceUID") {
								captureValues["SeriesInstanceUID"] = str;
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
							
							
							text += '"' + safetext(str) + '"';
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
					
				} else {
					color = '#C8C8C8';
					
					// Add text saying the data is too long to show...
					text += "<i>data too long to show</i>";
				}
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
			seriesObject[captureValues["SeriesInstanceUID"]] = { "Files": 0, "SeriesNumber": captureValues["SeriesNumber"], "SeriesDescription": captureValues["SeriesDescription"], "SequenceName": captureValues["SequenceName"] };
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
				jQuery('#stat').html("Number of files: <span id='loadingCounter'>0</span>/" + numFilesTotal + ", Number of series: <span id='number-series'>0</span>");
				
				zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
					var sanID = zipEntry.name.replace(/\//g, "_").replace(/\./g, "_").replace(/=/g, "_");
					
					// append only first 10 entries
					if (counter < lazyLoadingLimit) {
						$fileContent.append("<li class='image-group' id='" + sanID + "'>[" + (counter+1) + "] "+ zipEntry.name + "</li>");
					}
					
					(function(nam, zipEntryName, counter) {
						zipEntry.async("uint8array").then(function(data) {
							// console.log("we received the data for " + nam + " - size: " + data.length);
							// parse the data and get all the DICOM tags here... or just one of them...
							dataSet = dicomParser.parseDicom(data);
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
								if (parseInt(seriesObject[a]["SeriesNumber"]) < parseInt(seriesObject[b]["SeriesNumber"]))
									return -1;
							});
							jQuery('#number-series').text(ks.length);
							//alert(safetext('A newline: \n see?'));
							
							
							for (var i = 0; i < ks.length; i++) {
								var sanSeriesInstanceUID = ks[i].replace(/\//g, "_").replace(/\./g, "_");
								const cssRules = {};
								if (i % 2 == 0) {
									cssRules['backgroundColor'] = '#C8C8C8';
									cssRules['textColor'] = '#212529';					
								} else {
									cssRules['backgroundColor'] = '#212529';
									cssRules['textColor'] = '#C8C8C8';
								}
								
								jQuery('#series-results').append(`<div class="col-sm-12 col-lg-3 col-md-4 series" 
                                                                           id="ser-${sanSeriesInstanceUID}" 
                                                                           style="background-color: ${cssRules['backgroundColor']}; color: ${cssRules['textColor']}">
								     ${safetext(seriesObject[ks[i]]["SeriesDescription"])}
								     <br>#files: ${seriesObject[ks[i]]["Files"]}
								     <br>SeriesNumber: ${seriesObject[ks[i]]["SeriesNumber"]}
								     <br>SequenceName: ${seriesObject[ks[i]]["SequenceName"]}
								     </div>`);
								}
								console.log("finished on zip file");
								
								var loadingCounter = parseInt(jQuery("#loadingCounter").text());
								loadingCounter = loadingCounter + 1;
								jQuery("#loadingCounter").text(loadingCounter);
								
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
				handleFile(files[i]);
			}	
		});
		
		// lazy load next `lazyLoadingLimit` number of entries
		$(window).scroll(function() {
			const scrollHeight = $(document).height();
			const scrollPosition = $(window).height() + $(window).scrollTop();
			
			if ((scrollHeight - scrollPosition) < 10) {
				const nextList = detailsList.splice(0, lazyLoadingLimit); // detailsList.slice(0, lazyLoadingLimit);
				nextList.map(elem => {
					var e = jQuery("<li class='image-group' id='" + elem['sanID'] + "'>[" + elem['num'] + "] " + elem['zipEntryName'] +
						'<ul class="image">' + elem['htmlElem'] + '</ul>' + "</li>");
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
		});

// This code will attach `fileselect` event to all file inputs on the page
$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    loadingCounter = 0;
    input.trigger('fileselect', [numFiles, label]);
});
