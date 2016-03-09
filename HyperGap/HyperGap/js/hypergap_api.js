var HYPERGAP = HYPERGAP || {};

HYPERGAP.API = {};

HYPERGAP.API.appPath = function () {
    return "ms-appdata:///local/installedApps/" + localStorage.currentAppName + "/" + localStorage.currentAppScope;
}

HYPERGAP.API.getManifest = function () {
    return JSON.parse(localStorage.currentAppManifest);
}