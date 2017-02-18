/**
 * Created by artem on 2/12/17.
 */

"use strict";

let lib = require("./server_lib");


let urlDict = {
    "/index/": new lib.BindedFileFunc("./static/html/index.html"),  // particular file is binded to particular URL
    "/about/": new lib.BindedFileFunc("./static/html/about.html"),
    "/game/": new lib.BindedFileFunc("./static/html/about.html"),
    "/leaders/": new lib.BindedFileFunc("./static/html/leaders.html"),
    "/login/": new lib.BindedFileFunc("./static/html/login.html"),
    "/signup/": new lib.BindedFileFunc("./static/html/signup.html"),
    "/": new lib.BindedFileFunc("./static/html/index.html"),

};
urlDict[lib.getRegexStr("/static_js/")] = new lib.FolderFileFunc("./static/js/", "/static_js/"); // particular folder is binded to regexp
urlDict[lib.getPrefixStr("/static/")] = new lib.FolderFileFunc("./static/", "/static/");    // particular folder is binded to prefix

let server = lib.getStaticServer(urlDict);

let port = process.env.PORT || 3000;
server.listen(port);

