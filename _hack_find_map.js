function _search(obj, func=()=>false, depth=4, path="") {
    for (var key in obj) {
        var _path = path + "." + key
        var value = obj[key];
        if (func(value))
            console.log(_path);
        if (depth > 0 && typeof value == 'object' && !_path.includes("."+key+"."))
            _search(value, func, depth-1,  _path);
    }
}

_search(window, o => o != null && o.zoom != null && o.numZoomLevels != null)