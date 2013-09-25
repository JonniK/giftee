/**
 * Created with JetBrains PhpStorm.
 * User: JonniK
 * Date: 25.09.13
 * Time: 0:25
 * To change this template use File | Settings | File Templates.
 */
var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug',
                label:      path
            })
        ]
    });
}

module.exports = getLogger;