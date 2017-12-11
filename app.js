var cron = require('node-cron');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig_oracle.js');

console.log('scheduler started');

cron.schedule('*/2 * * * * *', function () {
    console.log('cron!');
    oracledb.getConnection({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
                // The statement to execute
                "SELECT * " +
                "FROM ZIHR_WEBMAIL_IF ",
                [180],
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }
                    console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
                    console.log(result.rows); // [ [ 180, 'Construction' ] ]
                    doRelease(connection);
                });
        });

    // Note: connections should always be released when not needed
    function doRelease(connection) {
        connection.close(
            function (err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }
});