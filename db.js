const DATABASE = "study";
const VER = 1;
const DB_OBJECT = "Result";

window._kdb = null;

(function () {

    /***
     * type:
     *    1: insert
     *    2: get all data
     *    3: get row count
     */
    function initDB(result, type = 3) {
        if (!window.indexedDB) {
            alert(`Your browser doesn't support IndexedDB`);
            return;
        }

        // The database name (DATABASE)
        // The database version (VER)
        const request = indexedDB.open(DATABASE, VER);
        request.onerror = e => console.error("Database error: ", e);
        request.onsuccess = (event) => {
            var db = event.target.result;
            if (type === 1) {
                insertData(db, result);
            } else if (type === 2) {
                getAllData(db);
            } else if (type === 3) {
                getCount(db);
            }
        }

        // create the DB_OBJECT object store and indexes
        // クライアントがデータベースを持っていない場合にトリガーされます
        request.onupgradeneeded = (event) => {
            // First, get the IDBDatabase instance from the event.target.result and assign it to the db variable.
            var db = event.target.result;

            // 存在しない場合はオブジェクトストアを作成する
            if (!db.objectStoreNames.contains(DB_OBJECT)) {
                // create the Result object store with auto-increment id
                db.createObjectStore(DB_OBJECT, {
                    autoIncrement: true
                });
            }
        };
    }

    // get all the information saved in the database
    window._getData = () => initDB(null, 2);

    window._savaData = function (question, answer) {
        var result = {
            q: question,
            a: answer,
            t: new Date().getTime()
        };

        initDB(result, 1);
    }

    async function getAllData(db) {
        // console.log("getAllData executed")
        const txn = db.transaction(DB_OBJECT, 'readonly');
        const objectStore = txn.objectStore(DB_OBJECT);

        var totQuestion = 0;
        var elm = document.querySelector(".result-box");
        var title = document.createElement("h2");
        elm.appendChild(title);

        let t1, t2;
        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                totQuestion++;
                let data = cursor.value;
                // console.log(data);
                if (!t1) t1 = data.t;
                t2 = data.t;

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
                    _showToast(msg);
                    document.getElementById("status-total").textContent = msg;
                })

                // continue next record
                cursor.continue();
            }
        };

        // close the database connection
        txn.oncomplete = function () {
            db.close();
            title.textContent = `Total: ${totQuestion} Time: ${Math.round((t2 - t1)/(1000*60)) || '0'}`;
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
            // console.log(event);
            // do nothing
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
            _showToast("Deleted Successfully!");
        };
        req.onerror = function () {
            _showToast("Couldn't delete database");
        };
        req.onblocked = function () {
            _showToast("Couldn't delete database due to the operation being blocked.");
        };
    }


    window._showToast = function (msg) {
        document.getElementById("toast").textContent = msg;
        document.getElementById("toast").style.visibility = "visible";
        setTimeout(() => document.getElementById("toast").style.visibility = "hidden", 2000);
    }

    // get the number of rows saved in db
    window._getCount = () => initDB(3);
    async function getCount(db) {
        const txn = db.transaction(DB_OBJECT, 'readonly');
        const objectStore = txn.objectStore(DB_OBJECT);
        var countRequest = objectStore.count();
        countRequest.onsuccess = function () {
            let cnt = countRequest.result;
            // console.log(cnt);
            db.close();
            window._cnt = cnt;
        }
    }

})();