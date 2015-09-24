var request = new XMLHttpRequest();
console.log("....1");
  request.open('GET', "books.json", true);
console.log("....2");
  request.onreadystatechange = function(aEvt) {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log(request.responseText);
      } else
        console.log("Error loading page\n");
    }
  };

console.log("....3");
  request.send(null);
console.log("....4");
  var index = new Index();
  index.createIndex();
  index.getIndex();
  index.searchIndex();