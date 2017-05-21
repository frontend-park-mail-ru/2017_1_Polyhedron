"use strict";

const serverLib = require("./core/server_side/static_server/server");
// const resourceBinding = require("./core/server_side/static_server/resource_binding");
// const caching = require("./core/server_side/service/caching");

const DEFAULT_PORT = 3000;

const router = new serverLib.Router();

// router.setDefault(new resourceBinding.BindedFile("./html/index.html"));
// router.addPlainURL("/api", new resourceBinding.BindedFile("./swagger.yml"));
//
// router.addPlainURL("/cached_urls", new resourceBinding.BindedFunction(caching.getCachedUrlGen({
//     foldersInfo: [
//
//         ['./static/css', '/static/css/'],
//         ['./static/fonts', '/static/fonts/'],
//         ['./static/images', '/static/images/'],
//         ['./static/js', '/static/js/'],
//
//         ['./dist', '/dist/']
//     ],
//
//     plainUrls: [
//         '/', '/index', '/about', '/choice', '/game', '/battle', '/gameover',
//         '/leaders', '/login', '/signup', '/waiting', '/404'
//     ]
// })));
//
// router.addPlainURL("/worker_script.js", new resourceBinding.BindedFile("./core/client_side/site_service/offline_mode/worker_script.js"));
// router.addPlainURL("/test", new resourceBinding.BindedFile("./core/client_side/site_service/offline_mode/test.html"));
// router.addPlainURL("/static/manifest.json", new resourceBinding.BindedFile("./static/manifest.json"));
//
// router.addRegexURL(".*\.ttf$", new resourceBinding.BindedFolder("./static/fonts", "/static/fonts"));
// router.addRegexURL(".*\.(gif|jp?g|png|ico)$", new resourceBinding.BindedFolder("./static/images", "/static/images"));
//
// router.addRegexURL("^/dist/.*\.(js|css)$", new resourceBinding.BindedFolder("./dist/", "/dist/"));

const server = serverLib.getStaticServer(router);
const port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

