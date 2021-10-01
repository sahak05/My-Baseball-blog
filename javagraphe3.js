/*
Abdoul SADIKOU 
Maticule: 20158628
bout de code prise du dbscriptgraphe de Louis Salvail et de newChartQ2Final.txt*/


//Partie de la fonction callback qui affiche le graphe 
  //colonnes empilees lorsqu'il n'y a pas d'erreurs.
function genereGrapheBar2(donnees, bchart){
	var nb = donnees.length;
	var labelsY = [];
	var points = [];
	var lesDeltas = [];
	var lexS = [];
	//place les donnees a afficher pour le graphique
	//des moyennes des Expos, une pour chaque annee.
	//Place les donnees pour les deltas de la moyenne des
	//Expos pour chaque annee. 
	//Place egalement les etiquettes, une pour chaque 
	//annee 
	for(var i=0;i<nb; i++){
		labelsY[i] = donnees[i].yearID;//Les etiquettes pour chaque annee. Ce sont les annees d'existence desExpos.
		points[i] = donnees[i].Expos;//Masse salariale pour la i-eme annee des Expos.
		lexS[i] = donnees[i].MoyNL; //La moyenne de la masse salariale en ligue Nationale
		lesDeltas[i] = donnees[i].MaxNL;//Le maximum de masse salariale dans la ligue Nationale. 
	};
	
    //creation du graphe colonnes empilees.
    new Chart($("#"+bchart),{ 
        type: 'line',//les deux graphes sont de type colonne.
        data:{
            labels: labelsY,
            datasets: [
                {//le graphe de la moyenne annuelle des Expos.
                  label:"Masse salariale Expos",//le titre du graphe.
                  type : "line",//le type est colonne.
                  borderColor:'#ca0000',//les couleurs de chaque colonne.
                  data: points //les donnees pour les moyennes annuelles.
                },
                { //le graphe des deltas
                  label:"Maximum ligue Nationale",//le titre du graphe.
                  type : "line",//le type est colonne.
				  borderColor: "#00ca00",
				  
                  data : lesDeltas//les donnees pour les deltas de moyenne.
                },
				{ //le graphe des deltas
                  label:"Moyenne Ligue Nationale ",//le titre du graphe.
                  type : "line",//le type est colonne.
                  borderColor:'#0000ca',//les couleurs.
                  data : lexS//les donnees pour les deltas de moyenne.
                },
            ]
        },
        options: {
            scales: {
                xAxes: [{stacked: false}],//les graphes sont empiles sur l'axe des x.
                yAxes: [{stacked: false}]//les graphes sont empiles sur l'axe des y.
            },
            legend: {display:true},//affiche les etiquettes de chaque graphe.
            title:{
                display: true,//affiche le titre du graphe complet.
                text: 'Évolution de la masse salariale des Expos à Montréal', //le titre du graphe complet.
				fontSize:40
            }
        }
    });
};
  
  var postData = {};
  postData["db"] = "dift6800_baseball";
  //la requete SQL qui retourne la moyenne des Expos pour chaque anne: attribut moyAnn et
  //le delta pour chaque annee de la moyenne des Expos avec la moyenne du meneur de la division a la fin de l'annee: attribut MaxMoy.
  postData["query"] = "Teams.yearID, SUM(Salaries.salary) AS Expos, Gen.Moy AS MoyNL, Gen.Max AS MaxNL FROM Salaries, Teams,"+
  " (SELECT yearID, ROUND(AVG(MS.MasseSalariale)) AS Moy, MAX(MS.MasseSalariale) AS Max FROM (SELECT Teams.yearID,Teams.teamID,"+
  " SUM(Salaries.salary) AS MasseSalariale FROM  Salaries, Teams WHERE Salaries.teamID=Teams.teamID AND Teams.yearID=Salaries.yearID"+
  " AND Teams.lgID='NL' GROUP BY Teams.yearID, Teams.teamID) AS MS GROUP BY yearID) AS Gen WHERE Salaries.teamID=Teams.teamID"+
  " AND Teams.teamID='MON' AND Teams.yearID=Salaries.yearID AND Gen.yearID=Teams.yearID GROUP BY Teams.yearID ";
  //La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
  $.post(
    "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
    postData,
    //la fonction callback pour l'affichage du graphe avec colonnes empilees.
    function(reponse,status){
	  var obj2 = JSON.parse(reponse);
      //Verifie qu'il n'y a pas d'erreur.
	  if(obj2.error==""){
          //s'il n'y a pas erreur alors afficher le graphe colonnes empilees.
          //et affiche le graphe dans le canevas avec id='bar-chart'.
      	  genereGrapheBar2(obj2.data, "bar_chart");
	    }else{
			alert("Erreur:"+obj2.error);
	    }
    }
  );
  
  