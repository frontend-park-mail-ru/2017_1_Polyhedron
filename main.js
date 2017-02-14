/**
 * Created by artem on 2/12/17.
 */

"use strict";

let lib = require("./server_lib");


let urlDict = {
    "/index/": new lib.BindedFileFunc("./static/html/index.html"),  // particular file is binded to particular URL
    "/main/": new lib.BindedFileFunc("./static/html/main_page.html"),
    "/cube/": new lib.BindedFileFunc("./static/html/cube_page.html"),
};
urlDict[lib.getRegexStr("/static_js/")] = new lib.FolderFileFunc("./static/js/", "/static_js/"); // particular folder is binded to regexp
urlDict[lib.getPrefixStr("/static/")] = new lib.FolderFileFunc("./static/", "/static/");    // particular folder is binded to prefix

let server = lib.getStaticServer(urlDict);

server.listen(8083);

