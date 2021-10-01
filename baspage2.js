


 $(document).ready(function(){
	  
       
	  $('input[name="Gerant"]').click(function(){
			if($(this).is(":checked")){
				//mon code ici
				//alert("Assistance");
				var annee= 0;
				annee = $("#annee").val();
				
				while(annee==0){
					alert("Selectionner une année et Revalider!");
					break;
				}
				var manag = "nameFirst, nameLast From Managers, Master where teamId='MON' And Master.playerId=Managers.playerId AND yearId= ";
				
				manag+=annee;
				//requete 
				poste( manag );
				
			}
		});
	
	});
	
	
function poste(requete){
    var postData0 = {};
	postData0["db"] = "dift6800_baseball";
	postData0["query"] = requete;	
	//La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
	$.post(
		"http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
		postData0,
		function(reponse,status){
			console.log(status);
			var obj0 = JSON.parse(reponse);
			if(obj0.error==""){  
				genereLigneTableau2(obj0.data, "Gerant");
			}
			else{
				alert("Erreur:"+obj.error);
			}
		}
	);
	
};	
 // A la place de generer le tableau on prend que es valeurs conenues dans le tableau associatifs
function genereLigneTableau2(donnees, id){
    var nb = donnees.length;
    if(nb>0){
        var htmltable="";
        
		htmltable+= donnees[0]["nameFirst"] + " " ;
		htmltable+= donnees[0]["nameLast"];
        $("#"+id).html(htmltable);
    }else{
        alert("La réponse à la requête est vide.");
        $("#"+id).html("");
    }
};




 