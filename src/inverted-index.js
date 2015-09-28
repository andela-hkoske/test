// inverted-index
// Hannah Cherono Koske


// INDEX OBJECT:
//    creates an inverted index of the words of the objects of a json file
// PROPERTIES:
//    path of json file, index of json file, results of search on index, json values of json File and reference to itself
// METHODS:
//    createIndex(path, cb): to create an index given the path of the json file and a callback 
//    for when asynchronous call is done executing
//    getIndex(): returns the current index as an object but also accepts the path of a jason 
//    file and returns the index
//    printIndex(): prints index to console
//    searchIndex(): searches the index for the terms specified as arguments
//    checkItem(): checks whether the item passed as an argument exists in the index

function Index() {
  this.path = "";
  this.index = [];
  this.results = [];
  this.jsonValues = [];
  var obj = this;

  this.createIndex = function(path, finished) {
    this.path = path;
    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.onreadystatechange = function(aEvt) {
      if (request.readyState == 4) {
        if (request.status == 200) {
          obj.jsonValues = returnJsonData(request.responseText);
          obj.index = showOccurences(obj.jsonValues, removePunctuation(removeDuplicates(toWords(obj.jsonValues))));
          console.log(obj.index);
          finished();
        } else
          console.log("Error loading request\n");
      }
    };
    request.send(null);
  };

  this.getIndex = function() {
    if(Object.keys(arguments).length > 0){
      this.createIndex(arguments[0],arguments[1]);
    }
    return {
      "index": this.index
    };
  };

  this.printIndex = function() {
    for (var item of this.index) {
      console.log(item[0] + " : " + item[1] + " , " + item[2]);
    }
  };

  this.searchIndex = function(terms) {
    if (typeof(terms) == "object") {
      terms = toLower(terms);
      this.results = searching(this.jsonValues, this.index, terms);
      console.log(obj.results);
    } else {
      var args = [];
      for (var item in arguments) {
        args.push(arguments[item]);
      }
      console.log(args);
      args = toLower(args);
      this.results = searching(this.jsonValues, this.index, args);
      console.log(obj.results);
    }
    return this.results;
  };

  this.checkItem = function(term) {
    for (var item of this.index) {
      if (item.indexOf(term) != -1)
        return true;
    }
    return false;
  };
}

//  converts json string file into an array of keys and values
var returnJsonData = function(jsonFile) {
  var jsonValues = [];
  JSON.parse(jsonFile, function(k, v) {
    if (k === "text" || k === "title") {
      //console.log("Key:" + k, "Value:" + v);
      jsonValues.push(v);
    }
  });
  jsonValues = toStructure(jsonValues);
  return jsonValues;
};

//  checks whether the item/index passed is empty 
var checkEmpty = function(item) {
  if (item.length === 0)
    return true;
  else
    return false;
};

//  converts an array of words from their current case to lower case
var toLower = function(words) {
  for (var j = 0, n = words.length; j < n; j++) {
    words[j] = words[j].trim().toLowerCase();
  }
  return words;
};

//  splits text in a json file into an array of words
var toWords = function(jsonFile) {
  // an array to hold the unique words found in the various texts
  var uniqueWords = [];

  // loops through all the texts in the json object
  // splits the text into an array of words
  // removes any empty strings that are generated as a result of splitting
  // appends the words to uniqueWords
  for (var i = 0; i < jsonFile.length; i++) {
    var words = jsonFile[i][1].trim().split(" ");
    while (words.indexOf("") != -1) {
      words.splice(words.indexOf(""), 1);
    }
    words = toLower(words);
    uniqueWords = uniqueWords.concat(words);
  }
  return uniqueWords;
};

//  removes duplicates that occur in an array of words
var removeDuplicates = function(uniqueWords) {
  // sorts the array of unique
  uniqueWords.sort();

  // loops through all the words in the uniqueWords array
  // removes all duplicate words
  var firstOcc, lastOcc;
  for (var j = 0; j < uniqueWords.length; j++) {
    firstOcc = j;
    lastOcc = uniqueWords.lastIndexOf(uniqueWords[j]);
    if (firstOcc != lastOcc) {
      uniqueWords.splice(firstOcc + 1, lastOcc - firstOcc);
    }
  }
  return uniqueWords;
};

// removes basic punctuation from items of an array of words 
var removePunctuation = function(uniqueWords) {
  for (var i = 0, n = uniqueWords.length; i < n; i++) {
    uniqueWords[i] = (uniqueWords[i].replace(',', '')).replace('.', '').replace('/', '').replace('?', '').replace('\"', '').replace('\'', '');
  }
  return uniqueWords;
};

//  creates the index of words
var showOccurences = function(jsonFile, uniqueWords) {
  // array that hold the occurences of the uniqueWords in the various texts in the jsonFile
  var wordOccurences = [];

  // loops through all the strings in uniqueWords
  // nests a loop in the above loops to loop through texts in the jsonFile
  // checks whether any of the strings in uniqueWords occur in the texts in the jsonFile
  for (var k = 0, n = uniqueWords.length; k < n; k++) {
    var wordOcc = [uniqueWords[k]],
      occ;
    for (var l = 0, m = jsonFile.length; l < m; l++) {
      occ = jsonFile[l][1].trim().toLowerCase().search([uniqueWords[k]]);
      if (occ != -1) {
        wordOcc.push(true);
      } else {
        wordOcc.push(false);
      }
    }
    wordOccurences.push(wordOcc);
  }
  return wordOccurences;
};

//  used to structure keys and values of a json file
var toStructure = function(array) {
  var result = [];
  for (var i = 0, n = array.length; i < n; i += 2) {
    result.push([array[i], array[i + 1]]);
  }
  return result;
};

//  used to search terms through the index
var searching = function(json, index, terms) {
  if (checkEmpty(json) !== true) {
    var results = [];
    for (var item of terms) {
      var subResults = [];
      for (var i = 0, n = index.length; i < n; i++) {
        if (index[i][0].search(item) != -1) {
          console.log(index[i][0]+" : "+item);
          if (index[i][1] === true)
            subResults.push(0);
          if (index[i][2] === true)
            subResults.push(1);
          if (subResults.length === 2)
            break;
        }
      }
      if (subResults.length == 0)
        subResults.push("Not found");
      results.push(subResults);
    }
    return results;
  } else
    return undefined;
};
