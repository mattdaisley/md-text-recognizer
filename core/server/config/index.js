var path      = require('path'),
	config 			= {};

config.web = {};
config.db  = {};

config.appRoot      = path.resolve(__dirname, '../../../');
config.corePath     = path.resolve(config.appRoot + '/core');

config.apiBaseUri   = '/api/v0.1/';

config.jwtSecret    = 'NodeServerStarterSecret';

process.env.TZ = 'UTC';

switch ( process.env.NODE_ENV ) {
	// dev overrides for configuration values
	case 'dev':
	
		config.web.host = '127.0.0.1';
		config.web.port = 7768;

		// config.db.host = "useast-mysql-test.cjxfiley5kef.us-east-1.rds.amazonaws.com";
		// config.db.user = "mattdaisleyadm";
		// config.db.password = "ADM.Bodyeye803290.DB";
		// config.db.database = "mdaisleydata";
		// config.db.tablePrefix = "sv_";

		// config.authAppUrl = 'http://127.0.0.1:3000';
		config.appUrl = 'http://' + config.web.host + ':' + config.web.port;

		break;
	default:

		config.web.host = '127.0.0.1';
		config.web.port = 3000;

		// config.db.host = "useast-mysql-test.cjxfiley5kef.us-east-1.rds.amazonaws.com";
		// config.db.user = "mattdaisleyadm";
		// config.db.password = "ADM.Bodyeye803290.DB";
		// config.db.database = "mdaisleydata";
		// config.db.tablePrefix = "sv_";

		// config.authAppUrl = 'https://auth.superview.tv';
		config.appUrl = 'https://www.superview.tv';

		break;
}

module.exports = config;
