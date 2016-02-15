zip.workerScriptsPath = "/js/";

function installGameFromLocaFile() {
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

                    console.log(entries);
                    var manifest = entries.filter(function (x) { return x.filename == "manifest.json" });
                    if (manifest.length == 0) {
                        //TODO: ERROR, NO MANIFEST
                    }
                    manifest = manifest[0];
                    manifest.getData(new zip.TextWriter(), function (text) {
                        // text contains the entry data as a String
                        var manifestData = JSON.parse(text);
                        console.log(manifestData);

                        // close the zip reader
                        reader.close(function () {
                            // onclose callback
                        });

                    }, function (current, total) {
                        // onprogress callback
                    });

                }
            });
        }, function (error) {
            // onerror callback
        });
    });

}