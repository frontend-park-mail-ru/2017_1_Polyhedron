this["JST"] = this["JST"] || {};

this["JST"]["TEMPLATES/RENDER_ABOUT.PUG"] = function pug_rethrow(n, e, r, t) {
    if (!(n instanceof Error))throw n;
    if (!("undefined" == typeof window && e || t))throw n.message += " on line " + r, n;
    try {
        t = t || require("fs").readFileSync(e, "utf8")
    } catch (e) {
        pug_rethrow(n, null, r)
    }
    var i = 3, a = t.split("\n"), o = Math.max(r - i, 0), h = Math.min(a.length, r + i), i = a.slice(o, h).map(function (n, e) {
        var t = e + o + 1;
        return (t == r ? "  > " : "    ") + t + "| " + n
    }).join("\n");
    throw n.path = e, n.message = (e || "Pug") + ":" + r + "\n" + i + "\n\n" + n.message, n
}
function template(locals) {
    var pug_html = "", pug_mixins = {}, pug_interp;
    var pug_debug_filename, pug_debug_line;
    try {
        ;
        pug_debug_line = 1;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "\u003Cp\u003E";
        ;
        pug_debug_line = 1;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "Lorem ipsum dolor sit amet, cum ad intellegat repudiandae, cum latine docendi splendide ne? Ei duo odio alii philosophia, ea.\u003C\u002Fp\u003E";
        ;
        pug_debug_line = 2;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "\u003Cp\u003E";
        ;
        pug_debug_line = 2;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "Lorem ipsum dolor sit amet, sed ne tale facilisis signiferumque, ad sea tollit omnium? Ea tale eirmod ceteros est, his quot pericula ea? Sed et iuvaret luptatum, insolens constituto ei pri. Ne duo lorem efficiantur, eos purto denique efficiantur eu, assum zril latine at sed. Ut his nisl tacimates labores.\u003C\u002Fp\u003E";
        ;
        pug_debug_line = 3;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "\u003Cp\u003E";
        ;
        pug_debug_line = 3;
        pug_debug_filename = "templates\u002Frender_about.pug";
        pug_html = pug_html + "Lorem ipsum\u003C\u002Fp\u003E";
    } catch (err) {
        pug_rethrow(err, pug_debug_filename, pug_debug_line);
    }
    ;
    return pug_html;
};