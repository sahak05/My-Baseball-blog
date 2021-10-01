/*
Abdoul SADIKOU 
Maticule: 20158628
 bout de code prise du dbscriptgraphe de Louis Salvail*/


//Partie de la fonction callback qui affiche le graphe 
  //colonnes empilees lorsqu'il n'y a pas d'erreurs.
function genereGrapheBar(donnees, bchart){
	var nb = donnees.length;
	var labelsY = [];
	var points = [];
	var lesDeltas = [];
	//place les donnees a afficher pour le graphique
	//des moyennes des Expos, une pour chaque annee.
	//Place les donnees pour les deltas de la moyenne des
	//Expos pour chaque annee. 
	//Place egalement les etiquettes, une pour chaque 
	//annee 
	for(var i=0;i<nb; i++){
		labelsY[i] = donnees[i].yearID;//Les etiquettes pour chaque annee. Ce sont les annees d'existence desExpos.
		points[i] = donnees[i].Victoires;//les moyennes pour la i-eme annee des Expos.
		lesDeltas[i] = donnees[i].Delta;//Les deltas de la moyenne des Expos comparee a celle du gagnant de la division des Expos ('E'_) pour chaque annee. 
	};
	
    var bckgrdcol = [];
    var bckDelta = [];
    //place les couleurs des colonnes.
    //pour le deux graphes de colonnes:les points des Expos
    //et lwsa deltas
    for(var i=0;i<nb;i++){
        bckgrdcol[i]=((i % 2)==0)?"#5e95cd" :"#c45850";//les annees impaires sont bleus et les annees paires sont rouges.
        bckDelta[i]= "#d1d1e0";//Les colonnes pour le graphe delta sont de la meme couleur grise.
    };
    //creation du graphe colonnes empilees.
    new Chart($("#"+bchart),{ 
        type: 'bar',//les deux graphes sont de type colonne.
        data:{
            labels: labelsY,
            datasets: [
                {//le graphe de la moyenne annuelle des Expos.
                  label:"Moyenne annuelle",//le titre du graphe.
                  type : "bar",//le type est colonne.
                  backgroundColor:bckgrdcol,//les couleurs de chaque colonne.
                  data: points //les donnees pour les moyennes annuelles.
                },
                { //le graphe des deltas
                  label:"Différence annuelle",//le titre du graphe.
                  type : "bar",//le type est colonne.
                  backgroundColor:bckDelta,//les couleurs.
                  data : lesDeltas//les donnees pour les deltas de moyenne.
                },
            ]
        },
        options: {
            scales: {
                xAxes: [{stacked: true}],//les graphes sont empiles sur l'axe des x.
                yAxes: [{stacked: true}]//les graphes sont empiles sur l'axe des y.
            },
            legend: {display:true},//affiche les etiquettes de chaque graphe.
            title:{
                display: true,//affiche le titre du graphe complet.
                text: 'Évolution des Expos de Montréal dans la ligue Nationale', //le titre du graphe complet.
				fontSize: 40,
				
            }
        }
    });
};
  
  var postData = {};
  postData["db"] = "dift6800_baseball";
  //la requete SQL qui retourne la moyenne des Expos pour chaque anne: attribut moyAnn et
  //le delta pour chaque annee de la moyenne des Expos avec la moyenne du meneur de la division a la fin de l'annee: attribut MaxMoy.
  postData["query"] = "T1.yearID AS yearID, T1.W AS Victoires,  (T2.PlusGrand-(T1.W))  AS Delta FROM Teams AS T1,"+
  "  (SELECT yearID, MAX(W) AS PlusGrand FROM Teams WHERE lgID='NL' AND divID='E' GROUP BY yearID HAVING yearID>1968)"+
  " AS T2 WHERE T1.teamID='MON' AND T1.yearID=T2.yearID";
  //La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
  $.post(
    "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
    postData,
    //la fonction callback pour l'affichage du graphe avec colonnes empilees.
    function(reponse,status){
	  var obj = JSON.parse(reponse);
      //Verifie qu'il n'y a pas d'erreur.
	  if(obj.error==""){
          //s'il n'y a pas erreur alors afficher le graphe colonnes empilees.
          //et affiche le graphe dans le canevas avec id='bar-chart'.
      	  genereGrapheBar(obj.data, "bar-chart");
	    }else{
			alert("Erreur:"+obj.error);
	    }
    }
  );
  
  