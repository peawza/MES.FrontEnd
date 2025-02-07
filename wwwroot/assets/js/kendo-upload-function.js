let kendoUploadImage = {
    using(idUpload, idDisplay, modeupload,imageNull) {


        if (imageNull == null || imageNull == undefined) {
            imageNull = "/assets/images/no-photo.jpg"

        }
        console.log("imageNull => ", imageNull);
        //console.log("test", idUpload, idDisplay);

        $("#" + idUpload).kendoUpload(
            {
                "select": (e) => {

                    kendoUploadImage.onSelect(e, idDisplay, modeupload)

                }
                , "remove": (e) => {

                    kendoUploadImage.onRemove(e, idDisplay, modeupload)
                }
                , "multiple": false,
                
                "validation": {
                    "allowedExtensions": [".jpg", ".jpeg", ".png", ".bmp", ".gif", ".jfif", ".webp"]
                },
                localization: {
                    select: Resources("COMMON", "SELECTFILE")
                },
                showFileList: false
            });

        var upload = $("#" + idUpload).getKendoUpload();
        document.getElementById(idUpload).setAttribute("accept", ".jpg, .jpeg, .png, .bmp, .gif, .jfif, .webp");
        upload.wrapper.find(".k-upload-button").prepend("<i class='fa-solid fa-folder d-none  d-md-flex d-sm-none'></i> <i class='fa-duotone fa-camera d-flex d-md-none d-sm-flex '></i>")
        upload.wrapper.find(".k-upload-button").after(`<div class='k-danger k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-upload-button-remove' id='${idUpload}-delete' aria-label='Picture' onclick="kendoUploadImage.RemoveFile('${idUpload}','${idDisplay}','${modeupload}','${imageNull}')"><i class='fa-solid fa-trash'></i><span>${Resources("COMMON", "DELETEFILE")} </span></div>`)


    },
    onSelect(e, idDisplay, modeupload) {
        //console.log("name ::: " + e.sender.name);
        var upload = $("#" + e.sender.name).data("kendoUpload");
        //console.log(e.files);
        upload.removeAllFiles();
        var notAllowed = false;
        var file = e.files[0].rawFile;
        var ext = e.files[0].extension.toLowerCase();
        try {
            if (document.getElementById("delete" + e.sender.name) != null) {
                document.getElementById("delete" + e.sender.name).style.display = "none"
            }
        } finally {

        }
        //console.log("ext =>", ext);
        if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".bmp" || ext == ".gif" || ext == ".jfif" || ext == ".webp") {


            var reader = new FileReader();
            reader.onloadend = function () {
                $(idDisplay).attr("src", this.result); //img id where the photo is to be displayed
            };

            //console.log(resizeImage(reader.readAsDataURL(file), 200, 200));
            //var youtubeimgsrc = document.getElementById("displayPhotoKTPictureName").src;
            //console.log(youtubeimgsrc)

            let resizedataURL = (datas, wantedWidth, wantedHeight) => {
                return new Promise(async function (resolve, reject) {

                    // We create an image to receive the Data URI
                    var img = document.createElement('img');

                    // When the event "onload" is triggered we can resize the image.
                    img.onload = function () {
                        // We create a canvas and get its context.
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');

                        // We set the dimensions at the wanted size.
                        canvas.width = wantedWidth;
                        canvas.height = wantedHeight;

                        // We resize the image with the canvas method drawImage();
                        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

                        var dataURI = canvas.toDataURL('image/jpeg', 0.8);

                        // This is the return of the Promise
                        resolve(dataURI);
                    };

                    // We put the Data URI in the image's src attribute
                    img.src = datas;

                })
            }// Use it like : var newDataURI = await resizedataURL('yourDataURIHere', 50, 50);


            reader.readAsDataURL(file); //Read the selected photo and display in UI
            reader.onload = async function () {

                let NewImages = await resizedataURL(reader.result, 500, 500)
                //console.log("this.result => ", NewImages);


                // console.log("reader.readAsDataURL(file) => ", reader.readAsDataURL(file));
                var index = parseInt(e.sender.name.replace("Picture", ""))

                //uploadImages.set(index, { fileName: index + ext, base64: NewImages });
                //image.set(index, reader.result);
                //picture[index] = reader.result;
                //console.log(" display id =>", "#display" + e.sender.name);
                $("#" + idDisplay).attr("src", NewImages);

                $("#" + modeupload).val("upload");

                document.getElementsByName(e.sender.name)[0].parentNode.removeChild(document.getElementsByName(e.sender.name)[0]);
            };
            // var c = document.getElementById("myCanvas");
            //var ctx = c.getContext("2d");
            //var img = document.getElementById("displayPhotoKTPictureName");

            ////ctx.drawImage(img, 10, 10);
            //console.log(c.toDataURL());
        }
        else { //If file extension does not belong to photo display a default image
            //$("#displayPhoto" + e.sender.name).attr("src", "../../assets/img/Vehicle/" + e.sender.name + ".png");
            notAllowed = true;
        }
        if (notAllowed == true) e.preventDefault();

    },
    onRemove(e, idDisplay, modeupload, imageNull) {
        console.log("modeupload =>", modeupload);
        $("#" + modeupload).val("delete");
        var upload = $("#" + e.sender.name).data("kendoUpload");
        upload.removeAllFiles();
        $("#" + idDisplay).attr("src", imageNull);


    }, RemoveFile(idUpload, idDisplay, modeupload, imageNull) {
        //console.log("modeupload =>", modeupload, imageNull);
        if (imageNull == null) {
            imageNull = "/assets/images/no-photo.jpg";
        }
        $("#" + modeupload).val("delete");
        var upload = $("#" + idUpload).data("kendoUpload");
        upload.removeAllFiles();
        $("#" + idDisplay).attr("src", imageNull);

    }
}
const FiletoBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
let kendoUploadFile = {
    using: async (idUpload, Grid, extension) => {


        kendoUploadFile.grid_upload.create(Grid);

        //console.log("test", idUpload, idDisplay);
        if (extension == null) {
            extension = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".docx", ".xlsx", ".zip"];
        }

        $("#" + idUpload).kendoUpload(
            {
                "select": (e) => {

                    kendoUploadFile.onSelect(e, extension, Grid)

                }
                , "remove": (e) => {
                    kendoUploadFile.onRemove(e, Grid)
                }
                , "multiple": false,
                "validation": {
                    "allowedExtensions": extension
                    //, "maxFileSize": 500000
                },
                localization: {
                    select: "เลือกไฟล์"
                },
                showFileList: false
            });

    },
    grid_upload: {
        create: (idGrid) => {

            let dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        // On success.
                        //e.success([]);
                        e.success([]);
                    },
                    destroy: function (e) {
                        // On success.
                        e.success();

                    },
                    create: function (e) {
                        // On success.
                        e.success();
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return {
                                models: kendo.stringify(options.models)
                            };
                        }
                    }
                },
                pageSize: 10,

            });


            let grid = $('#' + idGrid).kendoGrid({
                dataSource: dataSource,
                pageable: {
                    pageSizes: GridPageSizes(),

                },


                columns: [
                    {
                        field: "No",
                        title: "ลำดับ",
                        width: "50px", attributes: { class: "k-text-center " }
                    },

                    {
                        //field: "No",
                        title: "ดำเนินการ",
                        width: "50px", attributes: { class: "k-text-center " },
                        command: [
                            {
                                className: "btn-delete-oxygen btn-remove k-danger "

                                , name: "remove", text: "", iconClass: "k-icon k-i-trash"
                                , visible: function (dataItem) { return permissions.AllowDelete }
                                , click: async function (e) {
                                    // prevent page scroll position change
                                    e.preventDefault();
                                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                    var data = this.dataItem(tr);


                                    const confirmationDialog = new ConfirmationDialog("dialogdelete");
                                    confirmationDialog.open({
                                        yes: async function () {
                                            try {


                                                await $(grid_ID).data('kendoGrid').refresh();
                                                // confirmationDialogDeleteOpen = 0;
                                            } catch (e) {
                                                //confirmationDialogDeleteOpen = 0;
                                            } finally {

                                                //confirmationDialogDeleteOpen = 0;
                                            }

                                        }, no: async function () {
                                            // confirmationDialogDeleteOpen = 0;


                                        }





                                    }, common.format("Confirm Delete Product Name : {0} ? "), "Confirmation ");

                                }
                            }]

                    },
                    {
                        title: "ชื่อไฟล์",
                        width: "50px", attributes: { class: "k-text-center " },
                        template: (data) => {
                            console.log(data);
                            if (data.mode == "upload") {
                                //data.Filename
                                return `<a href="${data.fileBase64}">${data.Filename}</a>`

                            } else {

                            }
                            return ``
                        }
                    },




                ],
                dataBound: function (e) {


                },
                noRecords: kendo_grid.noRecords

            }).data("kendoGrid");

        },
        addFile: async (IdGrid, data) => {


            let _grid = $("#" + IdGrid).data("kendoGrid");

            _grid.dataSource.add(data);



            //let dataSource = new kendo.data.DataSource({
            //    data: [{ accountId: "2097028374", product: "Working Capital" }],
            //    pageSize: 10
            //});

            //$("#" + IdGrid).data("kendoGrid").setDataSource(dataSource);

        },



    },
    onSelect: async (e, extension, Grid) => {
        //console.log("name ::: " + e.sender.name);
        var upload = $("#" + e.sender.name).data("kendoUpload");
        //console.log(e.files);
        upload.removeAllFiles();
        var notAllowed = false;
        var file = e.files[0].rawFile;
        var ext = e.files[0].extension.toLowerCase();
        try {
            if (document.getElementById("delete" + e.sender.name) != null) {
                document.getElementById("delete" + e.sender.name).style.display = "none"
            }
        } finally {

        }

        const ExtensionFile = extension
        //console.log("ext =>", ext, "ExtensionFile.includes(ext) => ", ExtensionFile.includes(ext));
        if (ExtensionFile.includes(ext)) {



            let FileUpload = await FiletoBase64(file)
            //var reader = new FileReader();


            let dateUplodGrid = {
                mode: "upload",
                fileBase64: FileUpload,
                FileRaw: file,
                Filename: file.name

            }
            await kendoUploadFile.grid_upload.addFile(Grid, dateUplodGrid);
            // console.log(dateUplodGrid);

            //console.log(resizeImage(reader.readAsDataURL(file), 200, 200));
            //var youtubeimgsrc = document.getElementById("displayPhotoKTPictureName").src;
            //console.log(youtubeimgsrc)


            upload.clearAllFiles();

        }
        else { //If file extension does not belong to photo display a default image
            //$("#displayPhoto" + e.sender.name).attr("src", "../../assets/img/Vehicle/" + e.sender.name + ".png");
            notAllowed = true;
        }
        if (notAllowed == true) e.preventDefault();

    },
    onRemove(e, idDisplay) {
        //var upload = $("#" + e.sender.name).data("kendoUpload");
        //upload.removeAllFiles();
        //$("#" + idDisplay).attr("src", "/assets/images/no-photo.jpg");

    }, RemoveFile(idUpload, idDisplay) {
        //var upload = $("#" + idUpload).data("kendoUpload");
        //upload.removeAllFiles();
        //$("#" + idDisplay).attr("src", "/assets/images/no-photo.jpg");
    }
}

