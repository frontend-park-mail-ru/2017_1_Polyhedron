"use strict";
let lib = require("./server_lib");

const DEFAULT_PORT = 3000;

let map = new lib.URLMap();
map.addPlainURL("/index/", new lib.BindedFile("./static/html/index.html"));
map.addPlainURL("/about/", new lib.BindedFile("./static/html/about.html"));
map.addPlainURL("/game/", new lib.BindedFile("./static/html/game.html"));
map.addPlainURL("/leaders/", new lib.BindedFile("./static/html/leaders.html"));
map.addPlainURL("/login/", new lib.BindedFile("./static/html/login.html"));
map.addPlainURL("/signup/", new lib.BindedFile("./static/html/signup.html"));
map.addPlainURL("/", new lib.BindedFile("./static/html/index.html"));

map.addRegexURL("\.*\.js", new lib.FolderFile("."));
map.addPrefixURL("/static/", new lib.FolderFile("./static/", "/static/"));

let server = lib.getStaticServer(map);

let port = process.env.PORT || DEFAULT_PORT;
server.listen(port);

