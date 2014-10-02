'use strict';

var JsonML = JsonML || {},
	font = [],
	all = [];

window.onload = function(){

	function cancel(e) {
		e.preventDefault();
	}

	function on(obj, name, callback) {
		obj.addEventListener(name, callback, false);
	}

	on(window, 'dragenter', cancel);
	on(window, 'dragover', cancel);
	on(window, 'drop', function(e) {
		
		cancel(e);
		
		function convert() {
			// var deferred = Q.defer();
			
			return jz.zip.unpack(e.dataTransfer.files[0])
				.then(function(reader) {

					// console.log('unpacked');

					var typeface = reader.getFileNames();

					for (var glyph = 0; glyph < typeface.length; glyph++) { 

						// Convert all infos
						// all.push(view( typeface[glyph] ));

					    // is it a .glif file?
					    if ( typeface[glyph].split('.').pop() === 'glif' ) {
					    	// console.log(typeface[glyph]);
					    	// all.push(view( typeface[glyph] ));
					    }
					    // is it a .plist file?
					    else if ( typeface[glyph].split('.').pop() === 'plist' ) {
					    	// console.log(typeface[glyph]);
					    	all.push(view( typeface[glyph] ));
					    }
					    // is it a .fea file?
					    else if ( typeface[glyph].split('.').pop() === 'fea' ) {
					    	// console.log(typeface[glyph]);
					    }
					}
					// console.log('before resolve convert');
					// deferred.resolve();

					function view(obj) {
						// console.log('view');
						return reader.readFileAsText(obj)
							.then( function(text) {
								// console.log('before jsonifyzer');
								jsonifyzer(text);
							});
					}

					function jsonifyzer(source) {
						console.log('.');
						var output = JsonML.fromXMLText(source);
						output = cleanArray(output);
						font.push(output);
					}

					function cleanArray( array ) {
						return array.filter( function ( value ) {
							return !/^\s*$/.test( value );
						})
						.map( function ( value ) {
							return value.constructor === Array ? cleanArray( value ) : value;
						});
					}

					return Q.all(all);
				});
			
			// return deferred.promise;
		}

		function exportJson() {
			console.log(font);
			font = JSON.stringify( font );
			console.log(font);
			var blob = new Blob( [ font ] , {type: "application/json"});
			console.log(blob);
			saveAs(blob, "font.json");

		}

		convert().then(exportJson);

	});

	

};









