/*
Abdoul SADIKOU 
Maticule: 20158628
bout de code prise du dbscriptgraphe de Louis Salvail et de newChartQ2Final.txt*/



var unetarte = false; //Indique si une tarte est deja sur la page. Lorsque c'est le cas alors on fait destroy() avant d'afficher.
  /**
  Voici un tableau des équipes qui ont déjà joué dans la division
  'E' (ligne 'NL') des Expos.
  */
  var equipes = ['MON','CHN','NYN','PHI','PIT','SLN','MIA','FLO','WAS', 'ATL'];
  /**
  Voici un tableau des couleurs associées à chacune des équipes
  qui ont déjà joué dans la même division que les Expos.   
  */
  var couleurs = ['#db2c09','#e06309','#cee009',
               '#56d18b','#163a78','#521678',
               '#b80d76','#e32235','#0039aa', '#caaa00'];
  /**
  Génère la tarte définie par les donnees. Place le graphe
  dans le canevas avec Id='pchart' pour l'année annee 
  selectionnée par l'usager.
  */
  function genereTarte(donnees, pchart, annee){
      var nb = donnees.length;
      var labelsY = [];
      var vals    = [];
      var lescols = [];
      if(nb>0){//en autant qu'il y ait au moins un enregistrement retourné.
          for(var i=0;i<nb;i++){
              labelsY[i] = donnees[i].team;//Un label par équipe
              vals[i] = donnees[i].Salaire;//nbre de victoires de l'équipe
              lescols[i] = couleurs[equipes.indexOf(labelsY[i])];
              //Associe la couleur à l'équipe courante.
              //Il s'agit de l'entrée correspondante à l'équipe
              //courante dans le tableau de couleurs couleurs[.].
          };
          //s'il y a déjà une tarte alors la détruire.
          //unetarte=false, car il n'y a plus de tarte.
          if(unetarte){latarte.destroy(); unetarte=false;}
          //Voici la tarte chargé avec les données:
          latarte = new Chart($('#'+pchart), {
              type: 'pie',
              data: {
                  //Les étiquettes (c.-a-d. Les équipes de 
                  //de la division des Expos pour l'année courante).
                  labels: labelsY,
                  //Les données et leur couleur respective.
                  datasets: [{
                      label: "Massse Salariale de la ligue Nationale division Est",
                      backgroundColor: lescols,
                      data: vals
                  }]
              },
              options: {
                  title: {
                      //Affiche le titre.
                      display: true,
                      //Le titre du graphe.
                      text: 'Masse salariale en '+annee,
					  fontSize:40
                  }
              }
        });
        unetarte=true;//Il y a maintenant une tarte affichée.
      }
  }
  
  function requeteEtTarte(){
      var annee = $('#annees').val();
      var postReq = {};
      postReq["db"] = "dift6800_baseball";
      //La requête pour l'année selectionnée par l'usager.
      postReq["query"] = "Teams.teamID as team, SUM(Salaries.salary) as Salaire FROM  Salaries"
	  +", Teams WHERE Teams.lgID='NL' AND Teams.divID='E' AND Salaries.teamID=Teams.teamID AND"+
        " Teams.yearID="+annee +" AND Salaries.yearID="+annee +" GROUP BY Teams.yearID, Teams.teamID";
      //La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
      $.post(
          "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
          postReq,
          function(reponse,status){
              console.log(status);
              var obj4 = JSON.parse(reponse);
              if(obj4.error==""){ 
                  //fonction callback lorsque la réponse est prête.
                  genereTarte(obj4.data, "chart", annee);
                }else{
                  alert("Erreur:"+obj4.error);
                }
            }
        ); 
    } 