"use strict";
let lib = require("./server_lib");

const DEFAULT_PORT = 3000;

let router = new lib.Router();
router.addPlainURL("/index/", new lib.BindedFile("./static/html/index.html"));
router.addPlainURL("/about/", new lib.BindedFile("./static/html/about.html"));
router.addPlainURL("/game/", new lib.BindedFile("./static/html/game.html"));
router.addPlainURL("/leaders/", new lib.BindedFile("./static/html/leaders.html"));
router.addPlainURL("/login/", new lib.BindedFile("./static/html/login.html"));
router.addPlainURL("/signup/", new lib.BindedFile("./static/html/signup.html"));
router.addPlainURL("/", new lib.BindedFile("./static/html/index.html"));

router.addRegexURL("\.*\.js", new lib.FolderFile("."));
router.addPrefixURL("/static/", new lib.FolderFile("./static/", "/static/"));

let server = lib.getStaticServer(router);

let port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

