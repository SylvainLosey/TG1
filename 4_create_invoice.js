var Odoo = require('odoo-xmlrpc');
var prompt = require('prompt');

var odoo = new Odoo({
    url: 'http://edu-heclausanne-neptune.odoo.com/xmlrpc/2/common',
    port: 80,
    db: 'edu-heclausanne-neptune',
    username: 'sylvain.losey@unil.ch',
    password: 'odooNeptune'
});


// Ask user for the sale order
prompt.start();
prompt.get(['NomDuDevis'], function (err, result) {
    if (err) { return console.log(err); }

    odoo.connect(function (err) {
        if (err) { return console.log(err); }
        console.log('Connected to Odoo server.');
        var order_name = result.NomDuDevis;
        var inParams = [];
        inParams.push([['name', '=', order_name]]);
        inParams.push();
        inParams.push();
        odoo.execute_kw('sale.order', 'search_read', [inParams], function (err, value) {
            if (err) { return console.log(err); }

            // On contrôle que le devis existe
            else if (value == '') {
                console.log('\x1b[41mDevis non trouvé\x1b[0m')
            }

            // On contrôle que le devis ne soit pas déjà facturé
            else if (value[0]['invoice_status'] == 'invoiced') {
                console.log('\x1b[41mFacture déjà créée\x1b[0m')
            }

            else {
                // Execution de la méthode 'action_invoice_create' sur la table sale.order, selon le paramètre value[0]['id'], à savoir l'id de la commande entrée précédemment. //
                odoo.execute_kw('sale.order', 'action_invoice_create', [[value[0]['id']]], function (err2, value2) {
                    if (err2) { return console.log(err2); }
                    console.log('\x1b[42mLa facture pour la commande ' + order_name + ' a correctement été crée.\x1b[0m');
                });
            }
        });
    });
});

// Utiliser SO025 pour une commande avec facture déjà créée.
// Utiliser une commande dans commande a facturer pour créer une facture
