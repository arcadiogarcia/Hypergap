var HYPERGAP = HYPERGAP || {};

HYPERGAP.apps = {};


zip.workerScriptsPath = "/js/";

HYPERGAP.apps.installGameFromLocaFile = function () {
    // Create the picker object and set options
    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.list;
    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    // Users expect to have a filtered view of their folders depending on the scenario.
    // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
    openPicker.fileTypeFilter.replaceAll([".hgp"]);


    openPicker.pickSingleFileAsync().then(function (file) {
        return file.openAsync(Windows.Storage.FileAccessMode.read);
    }).done(function (fileBuf) {
        var blob = MSApp.createBlobFromRandomAccessStream('application/zip', fileBuf);
        // use a BlobReader to read the zip from a Blob object

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

                    function copyAppFiles(appname) {
                        entries.recursiveForEach(function (file, cb) {
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

Array.prototype.recursiveForEach = function (action, index) {
    var i = index || 0;
    if (i >= this.length) {
        return;
    }
    var that = this;
    action(this[i], function () { that.recursiveForEach(action, i + 1); });
}