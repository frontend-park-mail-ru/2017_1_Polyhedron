"use strict";
let lib = require("./server_lib");

const DEFAULT_PORT = 3000;

let router = new lib.Router();

const PLAIN_URLS = ['index', 'about', 'game', 'leaders', 'login', 'singin', 'signup'];
PLAIN_URLS.forEach((url) => {
    router.addPlainUrl(`/${url}`, new lib.BindFile(`./static/html/${url}.html`));
});

router.addPlainURL("/", new lib.BindedFile("./static/html/index.html"));

// TODO Delete row below to disable serving static from urls like /static/js/polyfills.js
// TODO beforehand change urls in static files from something like /static/js/polyfills.js to polyfills.js
router.addPrefixURL("/static/", new lib.BindedFolder("./static/", "/static/"));

router.addRegexURL("\.*\.js$", new lib.BindedFolder("./static/js"));
router.addRegexURL("\.*\.css$", new lib.BindedFolder("./static/css"));
router.addRegexURL("\.*\.html$", new lib.BindedFolder("./static/html"));

let server = lib.getStaticServer(router);

let port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

