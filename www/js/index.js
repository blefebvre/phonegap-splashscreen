/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    },

    downloadPDF: function(pdfURL) {
        if (typeof FileTransfer === "undefined") {
            return alert("FileTransfer plugin is not ready");
        }

        var dataDirectoryPath;
        if (cordova.file.externalDataDirectory != null) {
            // I found this directory works best on Android because other apps
            // (like Acrobat) have access to read from here.
            // However, this directory is null on iOS.
            dataDirectoryPath = cordova.file.externalDataDirectory;
        }
        else {
            // This directory works fine on iOS because the share options all
            // seem to use a copy of the PDF doc.
            dataDirectoryPath = cordova.file.dataDirectory;
        }

        var fileURL = dataDirectoryPath + "downloadedPDF.pdf";

        console.log('downloading file to: ' + fileURL);

        var fileTransfer = new FileTransfer();
        fileTransfer.download(
            pdfURL,
            fileURL,
            function win(pdfFileEntry) {
                navigator.notification.confirm(
                    'PDF successfully downloaded! Open it now?', // message
                    function(buttonIndex) {
                        if (buttonIndex === 1) {
                            // use the cordova-plugin-file-opener2 plugin
                            cordova.plugins.fileOpener2.open(
                                pdfFileEntry.toURL(), 
                                'application/pdf', 
                                {
                                    error: function() {
                                        console.error('Failed to open the PDF');
                                    }, 
                                    success: function(){ 
                                        console.log('Successfully opened the PDF');
                                    } 
                                } 
                            );
                        }
                        else if (buttonIndex === 2) {
                            // "No thanks" was tapped
                            // no-op
                        }
                    }, // callback to invoke with index of button pressed
                    'Success',           // title
                    ['Open it','No thanks']     // buttonLabels
                );
            },
            function fail(error) {
                console.error("download error source " + error.source);
                console.error("download error target " + error.target);
                console.error("download error code" + error.code);
            },
            false,  // trustAllHosts
            {
                headers: {
                    // optional http headers here
                }
            }
        );
    }
};
