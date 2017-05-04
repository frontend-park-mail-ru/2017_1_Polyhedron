"use strict";

const serverLib = require("./core/server_side/static_server/server");
const resourceBinding = require("./core/server_side/static_server/resource_binding");
const caching = require("./core/server_side/service/caching");

const DEFAULT_PORT = 3000;

const router = new serverLib.Router();

router.setDefault(new resourceBinding.BindedFile("./html/index.html"));
router.addPlainURL("/api", new resourceBinding.BindedFile("./swagger.json"));

router.addPlainURL("/cached_urls", new resourceBinding.BindedFunction(caching.getCachedUrlGen({
    foldersInfo: [
        ['./static/css'],
        ['./static/fonts'],
        ['./static/images'],
        ['./static/js'],
        ['./dist', '/dist/']
    ],

    plainUrls: [
        '/'
    ]
})));

router.addPlainURL("/worker_script.js", new resourceBinding.BindedFile("./core/client_side/site_service/offline_mode/worker_script.js"));
router.addPlainURL("/test", new resourceBinding.BindedFile("./core/client_side/site_service/offline_mode/test.html"));
router.addPlainURL("/static/manifest.json", new resourceBinding.BindedFile("./static/manifest.json"));

router.addRegexURL("^/lib/.*\.js$", new resourceBinding.BindedFolder("./static/_lib/js/", "/lib/"));
router.addRegexURL("^/lib/.*\.css$", new resourceBinding.BindedFolder("./static/_lib/css/", "/lib/"));

router.addRegexURL(".*\.ttf$", new resourceBinding.BindedFolder("./static/fonts", "/static/fonts"));
router.addRegexURL(".*\.(gif|jpg|png|ico)$", new resourceBinding.BindedFolder("./static/images", "/static/images"));

router.addRegexURL("^/dist/.*\.(js|css)$", new resourceBinding.BindedFolder("./dist/", "/dist/"));

const server = serverLib.getStaticServer(router);
const port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

