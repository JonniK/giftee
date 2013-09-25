/**
 * Created with JetBrains PhpStorm.
 * User: JonniK
 * Date: 25.09.13
 * Time: 2:22
 * To change this template use File | Settings | File Templates.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;