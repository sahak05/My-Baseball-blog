/*
Abdoul SADIKOU 
Maticule: 20158628
bout de code prise du dbscriptgraphe de Louis Salvail et de newChartQ2Final.txt*/


function genereGrapheBar1(donnees, bchart){
   
    var nb = donnees.length;
	var labelsY = [];
    var points = [];
    var lamoytot = [];
    var htmls = "";
    //document.write("nb="+nb);
    for(var i=0;i<nb; i++){
		labelsY[i] = donnees[i].yearID;
        points[i] = donnees[i].AMoy;
        lamoytot[i] = donnees[i].A;
	};
	
    var bckgrdcol = [];

    new Chart($("#"+bchart),{ 
        type: 'bar',//les deux graphes sont de type colonnes.
        data:{
            labels: labelsY, //Les années 1985-2004.
            datasets: [
                {//le graphe de l'assistance annuelle aux Expos.
                  label:"Assistance à Montréal",//le titre du graphe.
                  type : 'bar',//le type est colonne.
                  backgroundColor:"#3e9745cd",//les couleurs de chaque colonne.
                  data: lamoytot //les donnees pour l'asssistance aux matchs à Montréal.
                },
                { //le graphe de l'assistance moyenne.
                  label:"Assistance moyenne, ligue nationale",//le titre du graphe.
                  type : 'bar',//le type est colonne.
                  backgroundColor:"#ac0074ad",//les couleurs.
                  data : points//les donnees pour les assistances moyennes.
                },
            ]
        },
        options: {
            scales: {
				xAxes: [{stacked: false}],//les graphes ne sont pas empilés sur l'axe des x.
				yAxes: [{stacked: false}]//les graphes ne sont pas empilés sur l'axe des y.
            },
            //affiche les labels de chaque graphe en légende. 
            //Permet à l'usager de retirer et ajouter les graphes
            //montrés.
            legend: {display:true},
            //Configure le titre donné au graphe.
            title:{
                display: true,//affiche le titre du graphe général.
                text: 'Assistance aux matchs des Expos à Montréal', //le titre du graphe complet.
				fontSize:40
            }
        }
    });
  };
  
  var postData = {};
  postData["db"] = "dift6800_baseball";
  postData["query"] = "Teams.yearID, attendance AS A, MoyAnn.MoyAssist AS AMoy FROM Teams,"+
  " (SELECT yearID, ROUND(AVG(attendance)) AS MoyAssist FROM Teams WHERE lgID='NL' GROUP BY yearID)"+
  "  AS MoyAnn WHERE Teams.teamID='MON' AND Teams.yearID=MoyAnn.yearID";
  //La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
  $.post(
    "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
    postData,
    function(reponse,status){
      console.log(status);
	  var obj1 = JSON.parse(reponse);
	  if(obj1.error==""){  
      	  genereGrapheBar1(obj1.data, "barchart");
	    }else{
		  alert("Erreur:"+obj1.error);
	    }
    }
  );