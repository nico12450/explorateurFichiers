const path = require('path');
const fs = require('fs');
//joining path of directory 


const directoryPath = path.join(__dirname, '');

const homedir = require('os').homedir();

//passsing directoryPath and callback function

var listeRepertoire = [];

fs.readdir(homedir,{withFileTypes:true}, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        //console.log(file);
        listeRepertoire.push(file);

    });

    //console.log(listeRepertoire);
    listeRepertoire = triDossier(listeRepertoire);

});


function triDossier(listeFichiers){

    var nListe = [];

    for (var i = listeFichiers.length - 1; i >= 0; i--) {
        var e = listeFichiers[i];
        if(e.isDirectory()){
            nListe.push(e);
        }
    }

    for (var i = listeFichiers.length - 1; i >= 0; i--) {
        var e = listeFichiers[i];
        if (e.isFile()) {
            nListe.push(e);
        }
    }

    return nListe;

}



var http = require('http');

const PORT=8080; 

fs.readFile('./Main.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) { 

	    //response.writeHeader(200, {'Content-Type': 'application/json'});
   		//response.write(JSON.stringify(listeRepertoire));

		response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);

        for(var i = 0; i<listeRepertoire.length; i++){

        	var element = listeRepertoire[i];

        	if (element.isDirectory()) {

        		response.write("$('#listeFichiers').append(\"<div class='col-md-2 col-sm-3 pt-4 pb-4 border' id='dossier'> " + "<i class='fas fa-folder-open'></i>" + " " + element.name + " </div>\");");
        	}

        	else if(element.isFile()){
        		
        		response.write("$('#listeFichiers').append(\"<div class='col-md-2 col-sm-3 pt-4 pb-4 border' id='fichier'> " + "<i class='fas fa-file'></i>" + " " + element.name + " </div>\");");
        	}

        	

        }

        response.write("</script></html>");
        response.end(); 
 
    }).listen(PORT);
});