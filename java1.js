

 $(document).ready(function(){
    $("#remplir").click(function(event){
        
        var annee = $("#annee").val();
		

        var titre = "Classement par divisions en " + annee;
        $("#title").text(titre);
        
        var caption1 = "EST";
        var caption2 = "OUEST";
        
        $("#divNLE").text(caption1);
        $("#divNLW").text(caption2);

        var ligue = $( "input[type=radio][name=ligue]:checked" ).val();

        if( ligue == "Les deux ligues" ) {
            var caption3 = "Division Est en " + annee;
            var caption4 = "Division Ouest en " + annee;

            $("#divALE").text(caption1);
            $("#divALW").text(caption2);
        }

        if( annee >= 1995 ) {
             var caption = "Centre";
            $("#divNLC").text(caption);
            if( ligue == "Les deux ligues")
                $("#divALC").text(caption);
        }

        var voirCesChampions = [];
        $.each($("input[name='champion']:checked"), function(){
            voirCesChampions.push($(this).val());
        });
        console.log(voirCesChampions.length);

        genererRequete(annee, ligue, voirCesChampions);

    });
});

function genererRequete(annee, ligues, voirCesChampions) {

    var ids = ["NL-E", "NL-W", "NL-C", "AL-E", "AL-W", "AL-C"];
    var divisions = ['E', 'W', 'C'];

    var requete;

    var equipesChampionnes = []; // conserver la liste des champions.

    // Requêtes pour le classement des divisions de la ligue nationale.
    
    for( var i = 0; i < 3; i++ ) {
        
        // Faire la requête pour le classement des équipes de la ligue C 
        // également si l'année choisie le permet.
        if( annee < 1995 && i == 2) break;

        requete = requeteParDivision(annee, divisions[i], 'NL');
        poste(requete, ids[i]);

        if( ligues == "Les deux ligues" ) { // Si demandé, faire les requêtes de la ligue américaine.

            requete = requeteParDivision(annee, divisions[i], 'AL');
            poste(requete, ids[i+3]);

        }

        if(voirCesChampions.length != 0) {

            for( var i = 0; i < voirCesChampions.length; i++) {

                var champion = trouverChampion(annee, divisions[i], 'NL', voirCesChampions[i]);
                equipesChampionnes.push(champion);
            }
        }
    }
};

function trouverChampion(annee, division, ligue, champion) {

    var reqEquipeChampionne = '';

    reqEquipeChampionne =   "Teams.teamID, Teams.teamID=WSC.teamIDWinner AS WS, Teams.teamID=LC.teamIDWinner AS NLCS, Teams.W, Teams.L " +
                "FROM Teams, (SELECT teamIDWinner " + 
                "FROM SeriesPost "+
                          "WHERE yearID=1979 AND round='NLCS') AS LC, "+
               "(SELECT teamIDWinner " +
                            "FROM SeriesPost " +
            "WHERE yearID=1979 AND round='WS') AS WSC " +
           "WHERE Teams.yearID=1979  AND Teams.lgID='NL' AND Teams.divID='E'"
}

function requeteParDivision(annee, division, ligue) {

    var requete = "name AS Equipe, W/(W+L) AS Moyenne, W, L, Meilleure.Victoires - W AS Diff"+

    " FROM Teams "+ 

    "INNER JOIN "+
        "( SELECT yearID, MAX(W) AS Victoires " + 
        "FROM Teams "+
        "WHERE( (Teams.yearID = " + annee + ") "+ 
        "AND (divID = " + '\"' + division + '\"' + ") AND ( lgID = " + '\"' + ligue + '\"' + ") )) AS Meilleure "+
        "ON Teams.yearID = Meilleure.yearID "+

    "WHERE( (Teams.yearID = " + annee + ") AND (divID = " + '\"' + division + '\"'+ ") AND( lgID = " + '\"' + ligue + '\"' + ") ) "+
    
    "ORDER BY W DESC;";

    return requete;
};

function poste(requete, id) {

    var postData = {};
    postData["db"] = "dift6800_baseball";
    postData["query"] = requete;

    $.post(
        "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
        postData,

        function(reponse, status){

           console.log(status);
           var obj = JSON.parse(reponse);
           console.log(obj);

          if(obj.error=="") {  
              genereTableau(obj.data, id);
          } else {
            alert("Erreur:"+obj.error);
          }
        }
      );
};  

function genereTableau(donnees, id){

    var nb = donnees.length;

    if(nb > 0){
        
        var htmltable = '<thead><tr>';
        
        for(var attr in donnees[0]) {
            htmltable += "<th>" + attr + "</th>";
        };
        htmltable += "</tr></thead><tbody>";

        for(var x = 0; x < nb; x++) {

            htmltable += "<tr>";

            for(var a in donnees[x]){
                htmltable += "<td>"+donnees[x][a]+"</td>";
            }
            htmltable += "</tr>";
        }

        htmltable += "</tbody>";
        $("#"+id).html(htmltable);

    } else {
        alert("La réponse à la requête est vide.");
        $("#"+id).html("");
    }
  };
