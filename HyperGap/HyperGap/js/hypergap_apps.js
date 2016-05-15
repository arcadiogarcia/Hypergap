var HYPERGAP = HYPERGAP || {};

HYPERGAP.apps = {};


zip.workerScriptsPath = "/js/";

HYPERGAP.apps.installGameFromLocalFile = function (callback) {
    showLoader("Select a .hgp file","");
    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.list;
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    // Users expect to have a filtered view of their folders depending on the scenario.
    // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
    openPicker.fileTypeFilter.replaceAll([".hgp"]);


    openPicker.pickSingleFileAsync().then(function (file) {
        if (file) {
            return file.openAsync(Windows.Storage.FileAccessMode.read);
        }
    }).done(function (fileBuf) {
        if (fileBuf) {
            var blob = MSApp.createBlobFromRandomAccessStream('application/zip', fileBuf);
            HYPERGAP.apps.installGameFromBlob(blob, callback);
        } else {
            callback();
        }
    });
};


HYPERGAP.apps.installGameFromURL = function (url,callback) {
    showLoader("Downloading the game package", "");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            HYPERGAP.apps.installGameFromBlob(this.response, callback);
        }
    }
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
};

HYPERGAP.apps.installGameFromBlob = function (blob,callback) {
        zip.createReader(new zip.BlobReader(blob), function (reader) {

            // get all entries from the zip
            reader.getEntries(function (entries) {
                if (entries.length) {
                    //var contents = {};
                    //entries.forEach(function (x) {
                    //    x.getData(new zip.TextWriter(), function (text) {
                    //        contents[x.filename] = text;
                    //    })
                    //});

                    var nentries = entries.length;

                    function copyAppFiles(appname) {
                        var currentfile = 1;
                        entries.recursiveForEach(function (file, cb) {
                            showLoader("Copying game files", currentfile+"/"+nentries);
                            var localFolder = Windows.Storage.ApplicationData.current.localFolder;
                            var path = "installedApps/" + appname + "/" + file.filename;
                            var pathFolders = path.split("/");
                            var filename = pathFolders.pop();

                            navigatePath(localFolder, pathFolders, function (folder) {
                                console.log("creating " + filename);
                                file.getData(new zip.BlobWriter(), function (blob) {
                                    folder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
                                        // Open the returned file in order to copy the data 
                                        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {

                                            // Get the IInputStream stream from the blob object 
                                            var input = blob.msDetachStream();

                                            // Copy the stream from the blob to the File stream 
                                            Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                                                output.flushAsync().done(function () {
                                                    input.close();
                                                    output.close();
                                                    currentfile++;
                                                    if (currentfile > nentries) {
                                                        hideLoader();
                                                        callback();
                                                    }
                                                    cb();
                                                });
                                            });
                                        });
                                    });
                                });
                            });

                            function navigatePath(startFolder, path, callback) {
                                if (path.length > 0) {
                                    var newName = path.shift();
                                    console.log("trying to navigate to " + newName);
                                    startFolder.createFolderQuery().getFoldersAsync().done(function (f) {
                                        var r = f.filter(function (x) { return x.name == newName; });
                                        if (r.length > 0) {
                                            console.log("navigated to" + newName);
                                            navigatePath(r[0], path, callback);
                                        } else {
                                            console.log("trying to create" + newName);
                                            startFolder.createFolderAsync(newName).done(
                                                function (f) {
                                                    console.log("created" + newName);
                                                    navigatePath(f, path, callback)
                                                }
                                                );
                                        }
                                    });
                                } else {
                                    callback(startFolder);
                                }
                            }
                        });
                    }

                    var manifest = entries.filter(function (x) { return x.filename == "manifest.json" });
                    if (manifest.length == 0) {
                        //TODO: ERROR, NO MANIFEST
                    }
                    manifest = manifest[0];
                    manifest.getData(new zip.TextWriter(), function (text) {
                        // text contains the entry data as a String
                        var manifestData = JSON.parse(text);
                        console.log(manifestData);
                        HYPERGAP.apps.addInstalledApp(manifestData);
                        setTimeout(function () { copyAppFiles(manifestData.name); }, 100);
                        // close the zip reader
                        //reader.close(function () {
                        //    // onclose callback
                        //});

                    }, function (current, total) {
                        console.log(current,total);
                    });

                }
            });
        }, function (error) {
            // onerror callback
        });


}


HYPERGAP.apps.getInstalledApps = function () {
    return JSON.parse(localStorage.installedApps || "[]");
}

HYPERGAP.apps.addInstalledApp = function (app) {
    var apps = HYPERGAP.apps.getInstalledApps();
    apps.push(app);
    localStorage.installedApps = JSON.stringify(apps);
}

HYPERGAP.apps.launchApp = function (name) {
    var manifest=HYPERGAP.apps.getInstalledApps().filter(x=>x.name == name)[0];
    localStorage.currentAppName=manifest.name;
    localStorage.currentAppScope = manifest.scope;
    localStorage.currentAppManifest= JSON.stringify(manifest);
    window.location = "game.html";
};

Array.prototype.recursiveForEach = function (action, index) {
    var i = index || 0;
    if (i >= this.length) {
        return;
    }
    var that = this;
    action(this[i], function () { that.recursiveForEach(action, i + 1); });
}