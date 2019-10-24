var Odoo = require('odoo-xmlrpc');
var prompt = require('prompt');

var odoo = new Odoo({
    url: 'http://edu-heclausanne-neptune.odoo.com/xmlrpc/2/common',
    port: 80,
    db: 'edu-heclausanne-neptune',
    username: 'sylvain.losey@unil.ch',
    password: 'odooNeptune'
});

prompt.start();

prompt.get(['NomDuPartner'], function (err, result) {
    if (err) { return console.log(err); }

    odoo.connect(function (err) {
        if (err) { return console.log(err); }
        console.log('Connected to Odoo server.');
        var partner_name = result.NomDuPartner;
        var inParams = [];
        inParams.push([['name', '=', partner_name]]);

        odoo.execute_kw('res.partner', 'search', [inParams], function (err, p_id) {

            // Si l'id est null le client n'existe pas
            if (p_id == '') {
                console.log('\x1b[41mClient non trouvé\x1b[0m');
            } else {
                console.log(partner_name, ' est:', p_id);
                inParams = [];
                inParams.push([['partner_id', '=', p_id]]);
                inParams.push(['name', 'state', 'amount_untaxed']);

                odoo.execute_kw('sale.order', 'search_read', [inParams], function (err, value) {
                    if (err) { return console.log(err); }

                    // Si le retour est null le client n'a pas de commandes
                    if (value == '') {
                        console.log('\x1b[41mLe client n\'as pas de commandes\x1b[0m');
                    } else {
                        console.dir(value); // sinon, retourne le résultat
                    }
                });
            }
        });
    });
});


// Utiliser Gemini Furniture comme example qui marche
// Utiliser Wood Corner comme client qui n'as pas de commande
// Utiliser n'importe quoi comme example de client non trouvé
