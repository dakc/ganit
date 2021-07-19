const DATABASE = "study";
const VER = 1;
const DB_OBJECT = "Result";

window._kdb = null;

(function () {

    function initDB(result) {
        if (!window.indexedDB) {
            console.log(`Your browser doesn't support IndexedDB`);
            return;
        }

        // The database name (DATABASE)
        // The database version (VER)
        const request = indexedDB.open(DATABASE, VER);
        request.onerror = e => console.error("Database error: ", e);
        request.onsuccess = (event) => {
            var db = event.target.result;
            result ? insertData(db, result) : getAllData(db);
        }

        // create the Contacts object store and indexes
        // クライアントがデータベースを持っていない場合にトリガーされます
        request.onupgradeneeded = (event) => {
            // First, get the IDBDatabase instance from the event.target.result and assign it to the db variable.
            var db = event.target.result;

            // 存在しない場合はオブジェクトストアを作成する
            if (!db.objectStoreNames.contains(DB_OBJECT)) {
                // create the Result object store 
                // with auto-increment id
                db.createObjectStore(DB_OBJECT, {
                    autoIncrement: true
                });
            }
        };
    }

    window._getData = () => initDB();

    window._savaData = function (question, answer) {
        var result = {
            q: question,
            a: answer
        };

        initDB(result, true);
    }

    function getAllData(db) {
        const txn = db.transaction(DB_OBJECT, 'readonly');
        const objectStore = txn.objectStore(DB_OBJECT);

        var totQuestion = 0;
        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                totQuestion++;
                let data = cursor.value;
                console.log(data);

                // todo
                // add on result
                var elm = document.querySelector(".result-box");
                var div = document.createElement("div");
                div.className = "box";
                var span = document.createElement("h1");
                span.textContent = data.q;

                var img = document.createElement("img")
                img.src = data.a;

                div.append(span);
                div.append(img);
                elm.appendChild(div);

                div.addEventListener("click", e => {
                    div.classList.toggle("correct");
                    var msg = document.querySelectorAll(".correct").length + "/" + totQuestion;
                    var pct = document.querySelectorAll(".correct").length / totQuestion * 100;
                    msg += "  (" + Math.round(pct) + "%)"
                    document.getElementById("toast").textContent = msg;
                    document.getElementById("toast").style.visibility = "visible";
                    setTimeout(() => document.getElementById("toast").style.visibility = "hidden", 2000);
                    document.getElementById("status-total").textContent = msg;
                })

                // continue next record
                cursor.continue();
            }
        };
        // close the database connection
        txn.oncomplete = function () {
            db.close();
        };

    }

    function insertData(db, result) {
        // create a new transaction
        const txn = db.transaction(DB_OBJECT, 'readwrite');

        // get the Result object store
        const store = txn.objectStore(DB_OBJECT);

        let query = store.put(result);
        // handle success case
        query.onsuccess = function (event) {
            console.log(event);
        };

        // handle the error case
        query.onerror = function (event) {
            console.error(event.target.errorCode);
        }

        // close the database once the 
        // transaction completes
        txn.oncomplete = function () {
            db.close();
        };
    }




    window._deleteDb = function () {
        var req = indexedDB.deleteDatabase(DATABASE);
        req.onsuccess = function () {
            console.log("Deleted database successfully");
        };
        req.onerror = function () {
            console.log("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    }

})();