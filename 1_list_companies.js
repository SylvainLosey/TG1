var Odoo = require('odoo-xmlrpc');

var odoo = new Odoo({
    url: 'http://edu-heclausanne-neptune.odoo.com/xmlrpc/2/common',
    port: 80,
    db: 'edu-heclausanne-neptune',
    username: 'sylvain.losey@unil.ch',
    password: 'odooNeptune'
});

odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];

    // Spécifier que l'on veut lister des entreprises
    inParams.push([['is_company', '=', true]]);
    inParams.push(['name', 'country_id', 'lang', 'supplier']);
    inParams.push();
    inParams.push();
    var params = [];
    params.push(inParams);

    odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
