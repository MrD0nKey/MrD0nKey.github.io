// Fonction donner dans le fichier pdf du tp.
//https://www.sitepoint.com/url-parameters-jquery/

$.urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  return results[1] || 0;
};


$(document).ready(function () {
  if (localStorage.getItem("listItems") == null) {
    localStorage.setItem("listItems", []);
  }
  // Requete Ajax pour aller chercher les produits dans le fichier json du projet.
  $.ajax({
    url: "./../data/products.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      let id = $.urlParam("id");
      //Dans cette fonction, passe en paremetre le id qui etait dans le URL de notre page et le data qui sont les objets du fichier products.json .
      updatingPageById(id, data);
    },
  });
});

// Ici cette fonction va actualiser la page avec les informations qui sont relier au id passer en parametre, qui
// viennent de notre URL de page. Dans le cas ou notre n'est entre nos bornes de produit, nos produits
// vont de 1 a 13, on actualise pour montrer que la page est non trouver.
function updatingPageById(id, listFichierJSON) {
  if (id > 13 || id < 0) {
    $("article").html("<h1><strong>Page non trouvée!</strong></h1>");
  } else {
    var indiceObjet;
    //Boucle pour trouver le bon id et savoir qu'elles informations nous recherchons a actualiser.
    for (let i = 0; i < listFichierJSON.length; i++) {
      if (listFichierJSON[i].id == id) {
        indiceObjet = i;
      }
    }

    // Chaque information importantes pour la construction de notre structure de notre page.
    let name = listFichierJSON[indiceObjet].name;
    let price = listFichierJSON[indiceObjet].price;
    let image = listFichierJSON[indiceObjet].image;
    let description = listFichierJSON[indiceObjet].description;
    let features = listFichierJSON[indiceObjet].features;

    // Creation du string pour notre page que nous allons mettre dans la balise main de notre page.
    let b =
      "<article><h1>" +
      name +
      "</h1><div class='row'><div class='col'><img id='product-image' alt='" +
      name +
      "' src='./assets/img/" +
      image +
      "'></div><div class='col'><section><h2>Description</h2><p>" +
      description +
      "</p></section><section><h2>Caractéristiques</h2><ul>" +
      stringOfFeatures(features) +
      "</ul></section><hr><form class='pull-right'><label for='product-quantity'>Quantite:</label><input class='form-control' id='product-quantity' type='number' value='1' min='1'><button class='btn' title='Ajouter au panier' type='submit' onclick='return ajouterObjetCart()'><i class='fa fa-cart-plus'></i>&nbsp; Ajouter</button></form><p>Prix: <strong>" +
      price +
      "&thinsp;$</strong></p></div></div></article>";
    
    // Update de la page
    $("main").html(b);
    // On creer un item dans le local storage avec la cle item qui est l'item presenter dans la page.
    localStorage.setItem("item", id + "," + name + "," + price);
  }
}

// Fonction pour creer un petit string pour les features qui sont contenue dans une liste
// dans chaque objet du fichier products.json
function stringOfFeatures(features) {
  let string = "";
  for (let i = 0; i < features.length; i++) {
    string += "<li>" + features[i] + "</li>";
  }
  return string;
}

//Karl : A verifier si cette fonction est necessaire dans le code mais je n'ai pas trouver d'autre reference a cette fonction
// |
// V
//function returnHTMLForObject(listJSON, nbreObjet) {
//  let id = listJSON[0];
//  let name = listJSON[1];
//  let price = listJSON[2];
//
//  let a =
//    "<tr><td><button title='Supprimer'><i class='fa fa-times'></i></button></td>" +
//    "<td><a href='./product.html?id='" +
//    id +
//    ">" +
//    name +
//    "</a></td>" +
//    "<td>" +
//    price +
//    "&thinsp;$</td>" +
//    "<td><div class='row'><div class='col'><button title='Retirer' disabled=''><i class='fa fa-minus'></i></button></div><div class='col'>" +
//    nbreObjet +
//    "</div><div class='col'><button title='Ajouter'><i class='fa fa-plus'></i></button></div></div></td>" +
//    "<td>" +
//    price +
//    "&thinsp;$</td>" +
//    "</tr>";
//  return a;
//}

// Cette fonction creer les listes d'attributs de notre objet comme son nom son prix initial et la quantite qu'on
// veut ajouter a notre shopping-cart
function ajouterObjetCart() {
  $(".pull-right").on("submit", function (e) {
    //Empeche le rafraichissement de la page
    e.preventDefault();
    e.stopImmediatePropagation();

    //Champ du chiffre dans le form
    let nbreObjetARajouter = Number($("#product-quantity").val());
    changeNbCart(nbreObjetARajouter);

    let attributes = localStorage.getItem("item").split(",");
    createListItems(attributes, nbreObjetARajouter);

    // Creation de la petite animation pour dire que le produit a ete ajouter.
    let htmlBeforeAnimation = $("main").html();

    if ($("main").find("#annonce").length == 0) {
      $("main").append(
        "<div id='annonceParent'>" +
          "<div id='annonce'>Le produit a été ajouté!</div>" +
          "</div>"
      );
      $("#annonceParent").css({
        position: "absolute",
        width: "23%",
        height: "4%",
        "font-size": "1.2em",
        top: "90%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        "background-color": "#000000",
        color: "white",
        "border-radius": "20px",
        opacity: "0",
      });

      $("#annonce").css({
        position: "relative",
        top: "25%",
        "text-align": "center",
        "vertical-align": "middle",
      });

      $("#annonceParent").animate(
        { top: "+=20px", opacity: "+=1" },
        1000,
        function () {
          $("#annonceParent").animate({ top: "+=0px" }, 5000, function () {
            $("#annonceParent").animate(
              { top: "+=20px", opacity: "-=1" },
              1000,
              function () {
                $("main").html(htmlBeforeAnimation);
              }
            );
          });
        }
      );
    }
  });
}

function createListItems(list, numbChosen) {
  list.push(numbChosen);
  list.push(Number(list[2]) * numbChosen);
  if (localStorage.getItem("listItems") == "") {
    localStorage.setItem("listItems", list);
  } else {
    let splitedList = localStorage.getItem("listItems").split(",");
    let idRechercher = list[0];
    let indice = "&";
    for (let i = 0; i < splitedList.length; i += 5) {
      if (idRechercher == Number(splitedList[i])) {
        indice = i;
        break;
      }
    }
    if (indice == "&") {
        localStorage.setItem("listItems",localStorage.getItem("listItems") + "," + list);
    }else{
    
       splitedList[indice + 3] = String(list[3] + Number(splitedList[indice + 3]));
       let priceList = splitedList[indice + 2].split(".");
       let price = String(Number(priceList[0].concat(priceList[1])) * Number(splitedList[indice + 3]));

        price = price.substring(0, price.length - 2) + "." + price.substring(price.length - 2, price.length);
        splitedList[indice + 4] = price;
        localStorage.setItem("listItems",splitedList);
    }
  }
}
//Fonction deja presente dans certain fichier javascript du projet, elle est utiliser pour modifier le nombre d'objet
// dans la petite bulle du shopping-cart pour indiquer le nombre d'objet dedans.
function changeNbCart(number) {
  redDotcartTotalItems = Number(localStorage.getItem("cartTotalItems"));
  redDotcartTotalItems += number;
  localStorage.setItem("cartTotalItems", redDotcartTotalItems);
  if (redDotcartTotalItems >= 1) {
    $(".redDotcartTotalItems").show();
  }
  $("#redDotcartTotalItemsCount").text(redDotcartTotalItems);
}
