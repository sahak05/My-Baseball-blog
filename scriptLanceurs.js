//Cette fonction remplie un tableau html avec identificateur id avec 
  //contient une colonne par attribut dans donnees et les valeurs dans donnees 
  //rangees. Chaque colonne est nomme par l'attribut qu'il represente.
  function genereTableau(donnees, id){
    var nb = donnees.length;
    if(nb>0){
        var htmltable="<tr>";
        for(var attr in donnees[0]){
            htmltable=htmltable+"<th>"+attr+"</th>";
        };
        htmltable=htmltable+"</tr>";
        for(var x=0;x<nb;x++){
            htmltable=htmltable+"<tr>";
            for(var a in donnees[x]){
                htmltable=htmltable+"<td>"+donnees[x][a]+"</td>";
            }
            htmltable=htmltable+"</tr>";
        }
        $("#"+id).html(htmltable);
    }else{
        alert("La réponse à la requête est vide.");
        $("#"+id).html("");
    }
};
  
function postea2(requete){
    var postData = {};
	postData["db"] = "dift6800_baseball";
	postData["query"] = requete;	
	//La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
	$.post(
		"http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
		postData,
		function(reponse,status){
			console.log(status);
			var obj = JSON.parse(reponse);
			if(obj.error==""){  
				genereTableau(obj.data, "tableLanceursR");
			}
			else{
				alert("Erreur:"+obj.error);
			}
		}
	);
};



function postea1(requete){
    var postData1 = {};
	postData1["db"] = "dift6800_baseball";
	postData1["query"] = requete;	
	//La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
	$.post(
		"http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
		postData1,
		function(reponse,status){
			console.log(status);
			var obj1 = JSON.parse(reponse);
			if(obj1.error==""){  
				genereTableau(obj1.data, "tableLanceurs");
			}
			else{
				alert("Erreur:"+obj1.error);
			}
		}
	);
};
	
 
 $(document).ready(function(){   
 
	$("#val").click(function(event){
		
		var s ="nameFirst, nameLast ";
		var r = "From Master, Pitching ";
		var t = "Where Pitching.yearId= "
		var u = " AND Master.playerId=Pitching.playerId AND Pitching.teamID='MON' "
		var v = " AND Salaries.yearID="
		var w = " Pitching.GS ";
		var x = " ORDER BY ";
		
		//var count = 0;
		var annee= 0;
		annee = $("#annee").val();
		t+=annee;//+" ";
		v+=annee;//+" ";
		while(annee==0){
			alert("Selectionner une année et valider!");
			break;
		}
		
		if( !($('input[name="info1"]').is(":not(:checked)")) ){
			s+= ", ERA"+ " as M_merite ";
		}
		
		if( !($('input[name="info2"]').is(":not(:checked)")) ){
			s+= ", bAOpp ";
		}
		
		if( !($('input[name="info3"]').is(":not(:checked)")) ){
			s+= ", G"+ " as Match_joue ";
		}
		
		if( !($('input[name="info4"]').is(":not(:checked)")) ){
			s+= ", GS"+ " as Ma_Lanceur ";
		}
		
		if( !($('input[name="info5"]').is(":not(:checked)")) ){
			s+= ", CG"+ " as Complet ";
		}
		
		if( !($('input[name="info6"]').is(":not(:checked)")) ){
			s+= ", W"+ " as Gagnes ";
		}
		
		if( !($('input[name="info7"]').is(":not(:checked)")) ){
			s+= ", SO"+ " as 03_strikes ";
		}
		
		if( !($('input[name="info8"]').is(":not(:checked)")) ){
			s+= ", H"+ " as coups_surs ";
		}
		
		if( !($('input[name="info9"]').is(":not(:checked)")) ){
			s+= ", BB"+ " as But_sur_balle ";//virgule enlevé
		}
		
		if( !($('input[name="info10"]').is(":not(:checked)")) ){
			x+= " BB DESC ";
		}
		
		if( !($('input[name="info11"]').is(":not(:checked)")) ){
			x+= " H DESC ";
		}
		
		if( !($('input[name="info12"]').is(":not(:checked)")) ){
			x+= " bAOpp DESC ";
		}
		
		if( !($('input[name="info13"]').is(":not(:checked)")) ){
			x+=  " G DESC ";
		}
		
		if( !($('input[name="info14"]').is(":not(:checked)")) ){
			x+= " GS DESC  ";
		}
		
		if (annee >= 1985){
			s+=", salary as Salaires ";
			r+=",  Salaries ";
			u+="AND Salaries.playerID=Pitching.playerID ";
			
			
			if(true){
				console.log(s+r+t+u+"AND Pitching.GS>0 "+v+x);
			
				postea2(s+r+t+u+"AND Pitching.GS>0 "+v+x);
			}
			if(true){//partants>0
				console.log(s+r+t+u+"AND Pitching.GS=0 "+v+x);
				
				postea1(s+r+t+u+"AND Pitching.GS=0 "+v+x);
			}
		
		}else {
			
			if(true){
				coonsole.log(s+r+t+u+"AND Pitching.GS=0 "+v+x);
				
				postea2(s+r+t+u+"AND Pitching.GS=0 "+v+x);
			}
			if(true){//partants>0
				console.log(s+r+t+u+"AND Pitching.GS=0 "+v+x);
				
				postea1(s+r+t+u+"AND Pitching.GS>0 "+v+x);
			}
			
		}
		
	});
	
});
  
