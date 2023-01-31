//chemin to prix $(this).parentsUntil("tr").next().next().html()

function changeNbCart(number) {
  var redDotcartTotalItems = Number(localStorage.getItem("cartTotalItems"));
  redDotcartTotalItems += number;
  localStorage.setItem("cartTotalItems", redDotcartTotalItems);
  if (redDotcartTotalItems >= 1) {
    $(".redDotcartTotalItems").show();
  } else {
    $(".redDotcartTotalItems").hide();
  }
  $("#redDotcartTotalItemsCount").text(redDotcartTotalItems);
}
function deleteAllItems() {
  if (confirm("Voulez vous vider le panier?")) {
    $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier</p>");
    changeNbCart(-Number(localStorage.getItem("cartTotalItems")));
    localStorage.clear("listItems");
  }
}

function getListJSON() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      return JSON.parse(this.responseText);
    }
  };
}

$(document).ready(function () {
  if (localStorage.getItem("listItems") == null) {
    localStorage.setItem("listItems", []);
  }

  if (localStorage.getItem("listItems").length != 0) {
    console.log(localStorage.getItem("listItems"));
    for (
      let i = 0;
      i < localStorage.getItem("listItems").split(",").length;
      i += 5
    ) {
      addObjectToCart(i);
    }
  }
  sortByName();
  updateTotal();

  if ($("tbody").html() == "") {
    $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier</p>");
    $(".redDotcartTotalItems").hide();
  }
  $(".fa-times").click(function () {
    if (confirm("Voulez vous supprimer cet element du panier?")) {
      a = $(this).parentsUntil("tr");
      elementTR = a[1].parentNode;
      let name = elementTR.querySelector("a").innerHTML;
      removeItemFromListItems(name);
      let quantity = $(this)
        .parentsUntil("tr")
        .next()
        .next()
        .next()
        .children()
        .children("div.col:first")
        .next()
        .html();

      $(this).parentsUntil("tr").parent().remove();
      updateTotal();
      changeNbCart(-Number(quantity));
    }
    if (
      $(".shopping-cart-table").children("tbody").html().replace(/\s+/g, "") ==
      ""
    ) {
      $("article").html("<h1>Panier</h1><p>Aucun produit dans le panier</p>");
      $(".redDotcartTotalItems").hide();
      if (localStorage.getItem("listItems").length == 0) {
        localStorage.clear("listItems");
      }
    }
  });

  $(".fa-plus").click(function () {
    let a = $(this).parent().parent().parent().children("div.col:first").next();

    // Les deux prochaines lignes vont chercher la liste de td de l'item et plus loin je vais utiliser le td
    // de la valeur unitaire de l'item
    let b = $(this).parentsUntil("tbody");
    let listOfTD = b[4].querySelectorAll("td");
    console.log(listOfTD);
    let name = listOfTD[1].firstChild.innerHTML;
    console.log(name);
    valHtml = a.html();
    newVal = Number(valHtml) + 1;
    changeNbCart(1);
    a.html(newVal);
    let btnMinus = $(this)
      .parent()
      .parent()
      .parent()
      .children("div.col:first")
      .children();
    if (newVal > 1) {
      btnMinus[0].disabled = false;
    }
    console.log(btnMinus);

    updatePriceOfItem(newVal, c[2].innerHTML, c[4], name);
  });
  $(".fa-minus").click(function () {
    if ($(this).disabled == false) {
      let a = $(this)
        .parent()
        .parent()
        .parent()
        .children("div.col:first")
        .next();

      let b = $(this).parentsUntil("tbody");
      let c = b[4].querySelectorAll("td");
      valHtml = a.html();
      valNumber = Number(valHtml);
      newVal = Number(valHtml) - 1;
      changeNbCart(-1);
      a.html(newVal);
      updatePriceOfItem(newVal, c[2].innerHTML, c[4]);
      if (newVal == 1) {
        $(this).disabled = true;
      }
    }
  });
});

function removeItemFromListItems(name) {
  listItems = localStorage.getItem("listItems").split(",");
  let indice;
  for (let i = 0; i < listItems.length; i++) {
    if (listItems[i] == name) {
      indice = i;
      break;
    }
  }
  // Je fais moins un pour avoir le id est le debut des elements que
  // je veux retirer.
  indice -= 1;
  let j = 5;
  let tmp;
  for (let i = 0; i < 5; i++) {
    tmp = listItems[indice + i];
    listItems[indice + i] = listItems[listItems.length - j];
    listItems[listItems.length - j] = tmp;
    j--;
  }
  for (let i = 0; i < 5; i++) {
    listItems.pop();
  }
  localStorage.setItem("listItems", listItems);
}

function updatePriceOfItem(newVal, stringPrix, tdPrixTotal, name) {
  stringPrix = stringPrix.replace(" ", "");
  stringPrix = stringPrix.replace("$", "");
  stringPrix = stringPrix.replace(",", "");
  nvxPrix = newVal * Number(stringPrix);
  if (newVal % 10 == 0) {
    nvxPrix = Math.round(nvxPrix / 0.1) / 10;
    console.log(nvxPrix);
    nvxPrix = String(nvxPrix) + "0";
  } else {
    nvxPrix = Math.round(nvxPrix * 100) / 100;
    nvxPrix = String(nvxPrix);
  }

  nvxPrix =
    nvxPrix.substring(0, nvxPrix.length - 2) +
    "" +
    nvxPrix.substring(nvxPrix.length - 2, nvxPrix.length);

  updateListItems(name, newVal, nvxPrix);

  tdPrixTotal.innerHTML = nvxPrix + "&thinsp;$";
  updateTotal();
}

function updateListItems(name, val, total) {
  let listItems = localStorage.getItem("listItems").split(",");
  let indice;
  for (let i = 1; i < listItems.length; i += 5) {
    if (listItems[i] == name) {
      indice = i;
      break;
    }
  }

  listItems[indice + 2] = val;
  listItems[indice + 3] = total;

  localStorage.setItem("listItems", listItems);
  //console.log(localStorage.getItem("listItems"));
}

function updateTotal() {
  a = $("tbody").children("tr");
  let list = [];
  for (let i = 0; i < a.length; i++) {
    list.push(a[i]);
  }
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    c = a[i].querySelectorAll("td");
    priceInString = c[4].innerHTML.toString();
    priceInString = priceInString.replace(" ", "");
    priceInString = priceInString.replace("$", "");
    priceInString = priceInString.replace(",", "");
    total += Number(priceInString);
  }

  total = Math.round(total * 100) / 100;
  b = String(total);
  if (b[b.length - 2] === ".") {
    b += "0";
  }
  b = b.substring(0, b.length - 2) + "" + b.substring(b.length - 2, b.length);
  $(".shopping-cart-total").html("Total: <strong>" + b + "&thinsp;</strong>");
}

function addObjectToCart(indice) {
  list = localStorage.getItem("listItems").split(",");
  let id = list[indice];
  let name = list[indice + 1];
  let priceUnit = list[indice + 2];
  let nbreObject = list[indice + 3];
  let totalPrice = list[indice + 4];

  let a =
    "<tr><td><button title='Supprimer'><i class='fa fa-times'></i></button></td>" +
    "<td><a href='./product.html?id=" +
    id +
    "'>" +
    name +
    "</a></td>" +
    "<td>" +
    priceUnit +
    "&thinsp;$</td>" +
    "<td><div class='row'><div class='col'><button title='Retirer' disabled='true'><i class='fa fa-minus'></i></button></div><div class='col'>" +
    nbreObject +
    "</div><div class='col'><button title='Ajouter'><i class='fa fa-plus'></i></button></div></div></td>" +
    "<td>" +
    totalPrice +
    "&thinsp;$</td>" +
    "</tr>";
  $("tbody").append(a);
}

function sortByName() {
  let a = $("tbody").children();
  let list = [];
  let listString = [];
  let listSorted = [];
  for (let i = 0; i < a.length; i++) {
    list.push(a[i]);
  }
  for (let i = 0; i < list.length; i++) {
    listString.push(list[i].querySelector("a").innerHTML);
  }
  listString.sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      if (listString[i] === list[j].querySelector("a").innerHTML) {
        listSorted.push(list[j]);
      }
    }
  }
  $("tbody").html(listSorted);
}
