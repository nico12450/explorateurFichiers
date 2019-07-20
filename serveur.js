const path = require('path');
const fs = require('fs');
//joining path of directory 


const directoryPath = path.join(__dirname, '');

const homedir = require('os').homedir();

var adresseFichier = homedir;

//passsing directoryPath and callback function

//var listeRepertoire = [];

//lireRepertoire(adresseFichier);

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

function lireRepertoire(chemin,callback){

    //console.log(chemin);

    var lRep = [];

    fs.readdir(chemin,{withFileTypes:true}, function (err, files) {

        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {

            //console.log(file);
            lRep.push(file);

        });

        //console.log(listeRepertoire);
        lRep = triDossier(lRep);
        //console.log(listeRepertoire);
        callback(lRep);

    });

}



var http = require('http');

const PORT=8080; 

var fichierHTML;

fs.readFile('./Main.html', function (err, html) {

    if (err) throw err;

    fichierHTML = html;


});


http.createServer(function(request, response) { 

    //response.writeHeader(200, {'Content-Type': 'application/json'});
    //response.write(JSON.stringify(listeRepertoire));

    var adresse = request.url;

    //console.log(adresse);

    if(adresse == "/favicon.ico"){

    }

    else{

        var nouvelleAdresse = path.join(adresseFichier,adresse);

        if(fs.existsSync(nouvelleAdresse)){

            adresseFichier = nouvelleAdresse;

        }

        
        if(adresse == '/'){adresseFichier=adresse;}

        lireRepertoire(adresseFichier, function(listeRepertoire){

            //console.log(listeRepertoire);

            //console.log(adresseFichier);

            //console.log(listeRepertoire);

            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write(fichierHTML);


            for(var i = 0; i<listeRepertoire.length; i++){

                var element = listeRepertoire[i];

                if (element.isDirectory()) {

                    response.write("$('#listeFichiers').append(\"<div class='col-md-2 col-sm-3 pt-4 pb-4 border hoverable' id='dossier' onclick='window.location=`" + element.name + "`'> " + "<i class='fas fa-folder-open'></i>" + " " + element.name + " </div>\");");
                }

                else if(element.isFile()){
                    
                    response.write("$('#listeFichiers').append(\"<div class='col-md-2 col-sm-3 pt-4 pb-4 border' id='fichier'> " + "<i class='fas fa-file'></i>" + " " + element.name + " </div>\");");
                }

                

            }

            response.write("$('#home').attr('onclick','window.location = `/`');");
            response.write("$('#adresse').text('C:" + adresseFichier.replace(/\\/g,'/') + "');");

            response.write("</script></html>");
            response.end(); 

        });

    }

}).listen(PORT);