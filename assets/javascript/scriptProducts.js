// Karl : ligne a peut-etre enlever 
// |
// V
//let listFichierJSON;
$(document).ready(function () {
  //Code de verification si la liste du shopping cart existe
  // Si elle n'existe pas je creer une liste vide.
  if (localStorage.getItem("listItems") == null) {
    localStorage.setItem("listItem", []);
  }
  // Fetching les donnees des produits
  $.ajax({
    url: "./../data/products.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      arrayToPage(data);
    },
  });

  // Sorting des produits du prix le plus bas au plus haut
  function arrayToPage(listObjets) {
    let listJSON = [];
    listObjets.sort((a, b) => {
      return Number(a.price) - Number(b.price);
    });

    //Construction des éléments html en format string
    for (let i = 0; i < listObjets.length; i++) {
      a =
        '<div class="product ' +
        listObjets[i].category +
        '"><a href="./product.html?id=' +
        listObjets[i].id +
        '" title="En savoir plus...">' +
        "<h2>" +
        listObjets[i].name +
        "</h2>" +
        '<img alt="' +
        listObjets[i].name +
        '" src=' +
        '"./assets/img/' +
        listObjets[i].image +
        '">' +
        '<p class="price"><small>Prix</small> ' +
        listObjets[i].price +
        "</p></a></div>";
      listJSON.push(a);
    }
    //Mis en place des elements html dans la page
    for (let j = 0; j < listJSON.length; j++) {
      $("#products-list").append(listJSON[j]);
    }
  }

  // Si on clique sur un item de la page des produits
  $("div.product").click(function () {

    nomDuProduit = a.querySelector("h2").innerHTML;

    for (let i = 0; i < listFichierJSON.length; i++) {
      //On prend l'indice du nom retrouver et prenons ce meme indice
      //pour aller chercher le id du produit et ajouter ce id en parametre de la page.
      if (listFichierJSON[i].name == nomDuProduit) {
        tmp = "./product.html?id=" + listFichierJSON[i].id;
        window.location.href = tmp;
      }
    }
  });

  //Clickage des buttons du side-panel
  $("button").click(function () {
    //Switch case pour chaque bouton dans le side-panel.
    // le $(this) represente le button clicker.
    switch ($(this).html()) {
      case "Appareils photo":
        sortbyCategories(1,$(this));

        break;
      case "Consoles":
        sortbyCategories(2,$(this));
        break;
      case "Écrans":
        sortbyCategories(3,$(this));
        break;
      case "Ordinateurs":
        sortbyCategories(4,$(this));
        break;
      case "Tous les produits":
        displayAll($(this));
        break;
      case "Prix (bas-haut)":
        sortbyCriteria(1,$(this));
        break;
      case "Prix (haut-bas)":
        sortbyCriteria(2,$(this));
        break;
      case "Nom (A-Z)":
        sortbyCriteria(3,$(this));
        break;
      case "Nom (Z-A)":
        sortbyCriteria(4,$(this));
        break;
      default:
        console.log("Error: Unknown");
        break;
    }
  });
});

// Fonction pour afficher tous les elements car pour les cacher je fais un display:none.
function displayAll(button) {
  removeClassSelectedCategory(button);
  $("#products-list").children().attr("style", "display:inline");
  $("#products-count").html("13 produits");
  button.addClass("selected");
}

// Fonction pour afficher tous les produits pour sort par categorie par la suite.
function displayProducts() {
  $("#products-list").children().attr("style", "display:inline");
  $("#products-count").html("13 produits");
}

// Fonction pour enlever la class selected qui colorie le button choisi.
function removeClassSelectedCategory(a) {
  a.parent("div#product-categories").children().removeClass("selected");
}

// Meme fonction qu'au dessus mais pour les criteres.
function removeClassSelectedCriteria(a) {
  a.parent("div#product-criteria").children().removeClass("selected");
}

// Fonction qui cache les elements qui ne font pas partie de la categorie.
// la variable val represente chaque button comme 1 => Appareils photo et ainsi de suite.
// Le button Tous les produits n'est pas ici car nous avons fait une fonction special pour ce button.
function sortbyCategories(val, button) {
  displayProducts();
  if (val == 1) {
    removeClassSelectedCategory(button);
    //Pour chaque element dans ma liste de produits, nous allons
    //chercher ses classes et si jamais elles ne correspondent pas
    //a ceux du button que nous avons cliquer, nous settons leur display:none pour
    //ne plus les voirs.
    //Par la suite, le compteur valeur est incrementer pour savoir de combien
    //deduire le nombre total d'element des produits
    $("#products-list").each(function () {
      var classOfTag = $(this).children().attr("class");
      var listOfTags = $(this).children();
      var valeur = 0;
      for (let i = 0; i < listOfTags.length; i++) {
        classOfTag = listOfTags[i];
        if (classOfTag.className != "product cameras") {
          classOfTag.setAttribute("style", "display:none");
          valeur++;
        }
      }
      //Le button est selectionner et change de couleur
      button.addClass("selected");
      //Nous changeons le nombre de produits total en haut a droite.
      $("#products-count").html(String(13 - valeur) + " produits");
    });
  }
  // Meme logique plus haut sauf que cest pour les produits qui sont des consoles.
  if (val == 2) {
    removeClassSelectedCategory(button);
    $("#products-list").each(function () {
      var classOfTag = $(this).children().attr("class");
      var listOfTags = $(this).children();
      var valeur = 0;
      for (let i = 0; i < listOfTags.length; i++) {
        classOfTag = listOfTags[i];
        if (classOfTag.className != "product consoles") {
          classOfTag.setAttribute("style", "display:none");
          valeur++;
        }
      }
      button.addClass("selected");
      $("#products-count").html(String(13 - valeur) + " produits");
    });
  }
  //Same logic mais pour screens
  if (val == 3) {
    removeClassSelectedCategory(button);
    $("#products-list").each(function () {
      var classOfTag = $(this).children().attr("class");
      var listOfTags = $(this).children();
      var valeur = 0;
      for (let i = 0; i < listOfTags.length; i++) {
        classOfTag = listOfTags[i];
        if (classOfTag.className != "product screens") {
          classOfTag.setAttribute("style", "display:none");
          valeur++;
        }
      }
      button.addClass("selected");
      $("#products-count").html(String(13 - valeur) + " produits");
    });
  }
  // computers
  if (val == 4) {
    removeClassSelectedCategory(button);
    $("#products-list").each(function () {
      var classOfTag = $(this).children().attr("class");
      var listOfTags = $(this).children();
      var valeur = 0;
      for (let i = 0; i < listOfTags.length; i++) {
        classOfTag = listOfTags[i];
        if (classOfTag.className != "product computers") {
          classOfTag.setAttribute("style", "display:none");
          valeur++;
        }
      }
      button.addClass("selected");
      $("#products-count").html(String(13 - valeur) + " produits");
    });
  }
}

// Fonction qui sort par critere. 1 => Prix(haut en bas) et ainsi de suite.
function sortbyCriteria(val, button) {
  if (val == 1) {
    // Petit if pour ne pas repeser sur le button et defaire notre ordre.
    if (!button.is(".selected")) {
      // On enleve tous les buttons de leur class selected et appliquer
      // le selected sur celui qu'on vien de peser.
      removeClassSelectedCriteria(button);
      button.addClass("selected");
      // 0 pour en ordre croissant et 1 pour decroissant
      reverseProductListByPrice(0);
    }
  }
  if (val == 2) {
    if (!button.is(".selected")) {
      removeClassSelectedCriteria(button);
      button.addClass("selected");
      // Voir le commentaire plus haut.
      reverseProductListByPrice(1);
    }
  }
  if (val == 3) {
    if (!button.is(".selected")) {
      removeClassSelectedCriteria(button);
      button.addClass("selected");
      //Sorted en ordre alphabetique
      reverseProductListAz();
    }
  }
  if (val == 4) {
    if (!button.is(".selected")) {
      removeClassSelectedCriteria(button);
      button.addClass("selected");
      //Sorted en ordre decroissant alphabetique
      reverseProductListZa();
    }
  }
}

// Fonction qui sort par prix, je met mes produits dans un tableau 
// pour faciliter le sorting et utiliser la fonction sort d'un tableau.
function reverseProductListByPrice(val) {
  let listeDesProduits = $("#products-list").children();
  let tabPrice = [];
  let tabSorted = [];
  for (let i = 0; i < listeDesProduits.length; i++) {
    //Ici nous allons chercher le prix de chaque produit
    prix = listeDesProduits[i].querySelector(".price").innerHTML.split(" ");
    //On fais le split pour avoir seulement les chiffres avant les points donc les
    //dollars Ex == 29.99 => 29
    prixAvantPoint = prix[1].split(".");
    //On transforme en chiffre pour faire le sort
    tabPrice.push(Number(prixAvantPoint[0]));
  }

  //Sorting par prix.
  tabPrice.sort((a, b) => a - b);

  // Dans le cas ou on a besoin en ordre decroissant
  if (val == 1) {
    tabPrice.reverse();
  }
  //Double boucle pour passer sur chaque item et les comparer ensemble
  for (let i = 0; i < listeDesProduits.length; i++) {
    for (let j = 0; j < listeDesProduits.length; j++) {
      //On prend chaque prix dans notre liste
      a = Number(
        listeDesProduits[j].querySelector(".price").innerHTML.split(" ")[1].split(".")[0]
      );
      //Ici on prends chaque element dans le tabPrice qui est notre liste
      //sorted et on compare avec chaque prix.
      if (tabPrice[i] == a) {
        //On ajoute cet element dans tabSorted qui contient nos element htmls.
        tabSorted.push(listeDesProduits[j]);
      }
    }
  }
  //On applique sur notre page la liste sorted.
  $("#products-list").html(tabSorted);
}
// Pretty self-explanatory. Ici , la valeur 0 est de A-Z et 1 le contraire.
// La fonction getAlphabeticalSorted nous retourne un tableau d'element html en ordre
// alphabetique.
function reverseProductListAz() {
  $("#products-list").html(getAlphabeticalSorted(0));
}
function reverseProductListZa() {
  $("#products-list").html(getAlphabeticalSorted(1));
}
//Fonction pour trier la liste de produits par ordre alphabetique.
// Un peu dans la meme idee que le prix sauf que le compare du sort est une fonction qui
// va utiliser le localeCompare entre deux string dont ces strings seront les noms
// des produits.
function getAlphabeticalSorted(toReverse) {
  let listeDesProduits = $("#products-list").children();
  let tabDiv = [];
  let tabString = [];
  let tabSorted = [];

  //Boucle pour mettre tous les elements html dans une liste plutot qu'un objet.
  for (let i = 0; i < listeDesProduits.length; i++) {
    tabDiv.push(listeDesProduits[i]);
  }
  //La boucle pour aller chercher tous les noms des produits
  for (let i = 0; i < listeDesProduits.length; i++) {
    tabString.push(tabDiv[i].querySelector("h2").innerHTML.toString());
  }
  // Le sorting
  tabString.sort(function (a, b) {
    return a.localeCompare(b);
  });

  // Si on veut de Z-A
  if (toReverse == 1) {
    tabString.reverse();
  }
  // Double boucle pour aller chercher chaque element html et comparer leur noms avec 
  // la liste qui est trier alphabetiquement.
  for (let i = 0; i < listeDesProduits.length; i++) {
    for (let j = 0; j < listeDesProduits.length; j++) {
      if (tabString[i] === tabDiv[j].querySelector("h2").innerHTML.toString()) {
        tabSorted.push(tabDiv[j]);
      }
    }
  }

  return tabSorted;
}
