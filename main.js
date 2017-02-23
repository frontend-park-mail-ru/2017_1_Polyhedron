"use strict";
let lib = require("./core/server_lib");

const DEFAULT_PORT = 3000;

let router = new lib.Router();

const PLAIN_URLS = ['index', 'about', 'leaders', 'login', 'singin', 'signup'];
PLAIN_URLS.forEach((url) => {
    router.addRegexURL(`^/${url}/?$`, new lib.BindedFile(`./html/${url}.html`));
});

router.addPlainURL("/", new lib.BindedFile("./html/index.html"));
router.addRegexURL("^/game/?$", new lib.BindedFile("./html/game_logic_test.html"));

router.addRegexURL("^/lib/.*\.js$", new lib.BindedFolder("./static/_lib/js/", "/lib/"));
router.addRegexURL("^/lib/.*\.css$", new lib.BindedFolder("./static/_lib/css/", "/lib/"));

router.addRegexURL(".*\.js$", new lib.BindedFolder("./static/js"));
router.addRegexURL(".*\.css$", new lib.BindedFolder("./static/css"));

router.addRegexURL("^/media/", new lib.BindedFolder("./static/media/", "/media/"));
router.addRegexURL("^/core/.*\.js$", new lib.BindedFolder("./core/", "/core/"));
router.addRegexURL("^/core/lib/.*\.js$", new lib.BindedFolder("./core/_lib/", "/core/lib/"));

let server = lib.getStaticServer(router);

let port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

