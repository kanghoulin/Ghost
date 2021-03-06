// # Asset helper
// Usage: `{{asset "css/screen.css"}}`, `{{asset "css/screen.css" ghost="true"}}`
//
// Returns the path to the specified asset. The ghost flag outputs the asset path for the Ghost admin

var config = require('../config'),
    getAssetUrl = require('../data/meta/asset_url'),
    hbs = require('express-hbs');

function asset(path, options) {
	
    var isAdmin,
        minify;

    if (options && options.hash) {
		if(options.hash.ghost == 'true'){
			isAdmin = 1;
		}else if(options.hash.ghost == 'false'){
			isAdmin = 2;
		}
        
        minify = options.hash.minifyInProduction;
    }
    if (config.get('env') !== 'production') {
        minify = false;
    }

    return new hbs.handlebars.SafeString(
        getAssetUrl(path, isAdmin, minify)
    );
}

module.exports = asset;
