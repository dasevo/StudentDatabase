const getDbConnection = require("./db-mysql").getConnection;

exports.apiDb = function (req, res, obj) {
    let connection = getDbConnection();
    if (req.pathname.endsWith("/tridy")) {
        connection.query(
            `SELECT * FROM spaserverexample_tridy ORDER BY rocnik,oznaceni`,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.tridy = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if (req.pathname.endsWith("/studenti")) {
        let qry = "SELECT s.id,s.jmeno,s.prijmeni,t.rocnik,s.tridy_id,t.oznaceni as 'oznaceni_tridy',s.cislo_podle_tridnice FROM spaserverexample_studenti s, spaserverexample_tridy t WHERE t.id=s.tridy_id";
        qry += " AND s.stav=1";
        if (req.parameters.trida) { //pokud je zadana trida, vybereme jen studenty z dane tridy
            qry += " AND t.id="+req.parameters.trida;
        }
        if (req.parameters.text) { //pokud je zadan vyhledavany text, vybereme jen studenty, jejichz jmeno nebo prijmeni obsahuje dany text
            qry += " AND (s.jmeno LIKE '%"+req.parameters.text+"%' OR s.prijmeni LIKE '%"+req.parameters.text+"%')";
        }
        qry += " ORDER BY prijmeni,jmeno,rocnik"; //setridime primarne podle prijmeni
        console.log(qry);
        connection.query(qry,
            function(err, rows){
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if(req.pathname.endsWith("/delete")) {
        let qry = "UPDATE spaserverexample_studenti SET stav = 2 WHERE spaserverexample_studenti.id = " + req.parameters.id;
        connection.query(qry,
            function(err, rows) {
                if (err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if(req.pathname.endsWith("/add")) {
        let qry= "INSERT INTO spaserverexample_studenti (tridy_id, jmeno, prijmeni, cislo_podle_tridnice, stav) VALUES (" + req.parameters.tridy_id + ", '" + req.parameters.jmeno + "', '" + req.parameters.prijmeni + "', " + req.parameters.cislo_tridnice + ", 1)";
        connection.query(qry,
            function(err, rows) {
                if(err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else if(req.pathname.endsWith("/edit")) {
        let qry = "UPDATE spaserverexample_studenti SET tridy_id = '" + req.parameters.tridy_id + "', jmeno = '" + req.parameters.jmeno + "', prijmeni = '" + req.parameters.prijmeni + "', cislo_podle_tridnice = '" + req.parameters.cislo_tridnice + "'   WHERE spaserverexample_studenti.id = " + req.parameters.id;
        connection.query(qry,
            function(err, rows) {
                if(err) {
                    console.error(JSON.stringify({status: "Error", error: err}));
                    obj.error = JSON.stringify(err);
                } else {
                    obj.studenti = rows;
                }
                res.end(JSON.stringify(obj));
            }
        );
    } else {
        obj.status = -1;
        obj.error = "API not found";
        res.end(JSON.stringify(obj));
    }
}