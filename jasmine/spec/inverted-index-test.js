describe('Inverted Index', function() {
  var testIndex = new Index();
  describe("Read Book Data", function() {
    describe("Should read the json file and assert that it length is not equal to 0", function() {
      beforeEach(function(done) {
        testIndex.createIndex("./books.json", done);
      });
      it("Should return true for testIndex.jsonValues.length to be greater than 0", function() {
        expect(testIndex.jsonValues.length).toBeGreaterThan(0);
      });
    });
    describe("Should ensure each object in JSON array contains a property whose value is a string", function() {
      it("Should return string for typeof(item), where item is an item in testIndex.jsonValues", function() {
        for (var item in testIndex.jsonValues) {
          expect(typeof(item)).toEqual("string");
        }
      });
    });
  });

  describe("Populate Index", function() {
    describe("Should verify that the index is created once the JSON file has been read", function() {
      it("Should return true for testIndex.index not to be null", function() {
        expect(testIndex.index).not.toBeNull();
      });
      it("Should return true for testIndex.index.length to be greater than 0", function() {
        expect(testIndex.index.length).toBeGreaterThan(0);
      });
    });

    describe("Should verify that the index maps the string keys to the correct objects in the JSON array", function() {
      it("Should return true for alice", function() {
        expect(testIndex.checkItem("alice")).toBe(true);
      });
      it("Should return true for alliance", function() {
        expect(testIndex.checkItem("alliance")).toBe(true);
      });

      it("Should return true for hobbit", function() {
        expect(testIndex.checkItem("hobbit")).toBe(true);
      });

      it("Should return false for governor", function() {
        expect(testIndex.checkItem("governor")).toBe(false);
      });

      it("Should return false for fruit", function() {
        expect(testIndex.checkItem("fruit")).toBe(false);
      });

      it("Should return false for carpet", function() {
        expect(testIndex.checkItem("carpet")).toBe(false);
      });
    });

    describe("Should ensure index is not overwritten by a new JSON file.", function() {
      var newTestIndex = new Index();
      beforeEach(function(done) {
        newTestIndex.createIndex("./books-2.json", done);
      });
      it("Should return true for testIndex.index.length not to be equal to newTestIndex.index.length", function() {
        expect(testIndex.index.length).not.toEqual(newTestIndex.index.length);
      });
    });

  });

  describe("Search Index", function() {
    describe("Should verify that the index maps the string keys to the correct objects in the JSON array", function() {
      it("Should return [[0]] for Alice", function() {
        expect(testIndex.searchIndex("Alice")).toEqual([
          [0]
        ]);
      });
      it("Should return [[1]] for WIZARD", function() {
        expect(testIndex.searchIndex("WIZARD")).toEqual([
          [1]
        ]);
      });
      it("Should return [[1],[0]] for \"PoWerFUL\",\"iMAGinATIon\"", function() {
        expect(testIndex.searchIndex("PoWerFUL", "iMAGinATIon")).toEqual([
          [1],
          [0]
        ]);
      });
    });
    describe("Should ensure searchIndex can handle a varied number of search terms as arguments", function() {
      it("Should return [[0],[1]] for \"Alice\",\"hobbit\"", function() {
        expect(testIndex.searchIndex("Alice", "hobbit")).toEqual([
          [0],
          [1]
        ]);
      });
      it("Should return [[ 0, 1 ],[ 1 ], [ 0 ], [ 1 ], [ 0 ], [ 0 ], [ 0, 1 ]] for \"a\",\"PoWerFUL\",\"iMAGinATIon\",\"dwarf\",\"falls\",\"holes\",\"of\"", function() {
        expect(testIndex.searchIndex("a", "PoWerFUL", "iMAGinATIon", "dwarf", "falls", "hole", "of")).toEqual([
          [0, 1],
          [1],
          [0],
          [1],
          [0],
          [0],
          [0, 1]
        ]);
      });
    });
    describe("Should ensure searchIndex can handle an array of search terms.", function() {
      it("Should return [[0],[1],[1]] for [\"Alice\",\"hobbit\",\"alliance\"]", function() {
        expect(testIndex.searchIndex(["Alice", "hobbit", "alliance"])).toEqual([
          [0],
          [1],
          [1]
        ]);
      });
      it("Should return [[0],[1],[1],[\"Not found\"]] for [\"Alice\",\"hobbit\",\"alliance\",\"boy\"]", function() {
        expect(testIndex.searchIndex(["Alice", "hobbit", "alliance", "boy"])).toEqual([
          [0],
          [1],
          [1],
          ["Not found"]
        ]);
      });
      it("Should return [[0,1],[0],[1],[1],[\"Not found\"]] for [\"of\",\"Alice\",\"hobbit\",\"alliance\",\"boy\"]", function() {
        expect(testIndex.searchIndex(["of", "Alice", "hobbit", "alliance", "boy"])).toEqual([
          [0, 1],
          [0],
          [1],
          [1],
          ["Not found"]
        ]);
      });
    });
  });

  describe("Get Index", function() {
    describe("Should have getIndex() take an argument that specifies the document that was indexed and return the correct index for that document", function() {
      var results;
      beforeEach(function(done) {
        results = testIndex.getIndex("./books.json", done);
      });
      it("Should return true for results not to be null", function() {
        expect(results).not.toBeNull();
      });
      it("Should return true for results.index.length to be greater than 0", function() {
        expect(results.index.length).toBeGreaterThan(0);
      });
    });
  });



});
