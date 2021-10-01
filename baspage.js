


function poste2(requete){
	
    var postData2 = {};
	postData2["db"] = "dift6800_baseball";
	postData2["query"] = requete;	
	//La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
	$.post(
		"http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
		postData2,
		function(reponse,status){
			console.log(status);
			var obj2 = JSON.parse(reponse);
			if(obj2.error==""){  
				genereLigneTableau(obj2.data, "assistance");
			}
			else{
				alert("Erreur:"+obj2.error);
			}
		}
	);
};

// A la place de generer le tableau on prend que es valeurs conenues dans le tableau associatifs
function genereLigneTableau(donnees, id){ 
    var nb = donnees.length;
    if(nb>0){
        var htmltable="";
        
		htmltable+= donnees[0]["attendance"];
        $("#"+id).html(htmltable);
    }else{
        alert("La réponse à la requête est vide.");
        $("#"+id).html("");
    }
};