$(document).ready(function(){
	  
       
	  $('input[name="Masse"]').click(function(){
			if($(this).is(":checked")){
				//mon code ici
				
				var annee= 0;
				annee = $("#annee").val();
				
				while(annee==0){
					alert("Selectionner une année et Revalider!");
					break;
				}
				var as22 = "SUM(salary) as sal FROM Teams, Salaries WHERE Teams.teamID=Salaries.teamId AND Teams.teamId='MON' AND Teams.yearId= ";
				
				as22+ as22 + annee + " Salary.yearId = " ;
				as22+= annee;
				//alert(as);
				postt( as22 );
				
			}
		});
	
	});
	
	
function postt(requete){
    var postData22 = {};
	postData22["db"] = "dift6800_baseball";
	postData22["query"] = requete;	
	//La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
	$.post(
		"http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
		postData22,
		function(reponse,status){
			console.log(status);
			var obj22 = JSON.parse(reponse);
			if(obj22.error==""){  
				genereLigneTableau22(obj22.data, "masse");
			}
			else{
				alert("Erreur:"+obj22.error);
			}
		}
	);
};	

// A la place de generer le tableau on prend que es valeurs conenues dans le tableau associatifs
function genereLigneTableau22(donnees, id){ 
    var nb1 = donnees.length;
    if(nb1 >0){
        var htmltable="";
        
		htmltable+= donnees[0]["sal"] ;
        $("#"+id).html(htmltable);
    }else{
        alert("La réponse à la requête est vide.");
        $("#"+id).html("");
    }
};