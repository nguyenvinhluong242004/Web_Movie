const home = require('./home.route');
function route(app) {
    
    app.use('/', home);

}

module.exports = route;