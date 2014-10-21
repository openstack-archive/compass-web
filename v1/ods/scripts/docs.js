//js ods/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('ods/ods.html', {
		markdown : ['ods']
	});
});