class UploadImageDialog {
    constructor(settings) {
        var _this = this;
        this.options = $.extend(true, {
            name: "#upload-image-dialog",
            error: (message) => { },
            save: (data) => { },
            cancel: (data) => { },
            uploadSuccess: (data) => { },
            removeSuccess: (data) => { },
            viewImages: (data) => { },
            services: {
                image: "/api/images/preview",
            }
        }, settings.options);

        // dialog options
        this.dialogOptions = $.extend(true, {
            visible: false,
            modal: true,
            size: 'large',
            title: 'Upload Image',
            animation: {
                open: {
                    effects: "fade:in"
                },
                close: {
                    effects: "fade:out"
                }
            },
            show: (e) => { e.sender.wrapper.css({ top: "20px" }); }
        }, settings.dialogOptions);
        this.dialog = $(this.options.name).kendoDialog(this.dialogOptions).data("kendoDialog"); 

        // upload options
        this.uploadOptions = $.extend(true, {
            async: {
                saveUrl: "save",
                removeUrl: "remove",
                autoUpload: true,
                batch: true
            },
            validation: {
                allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
            },
            showFileList: false,
            dropZone: "#upload-dropzone"
        }, settings.uploadOptions);

        this.modelDataState = {
            none: 0,
            create: 1,
            delete: 3,
            update: 2
        };
    }

    _init() {
        var _this = this;
        if (this._isInit === true) { return; }

        this.controls = {
            uploadImageContainer: $("#upload-images-container"),
            uploadInfo: $("#upload-info"),
            upload: $("#files").kendoUpload(this.uploadOptions).data("kendoUpload"), 
            saveButton: $("#" + this._getControlName("saveButton")).data("kendoButton"),
            cancelButton: $("#" + this._getControlName("cancelButton")).data("kendoButton"),
            viewImageButton: $("#" + this._getControlName("viewImageButton")).data("kendoButton"),
        }

        this.controls.upload.bind("error", (e) => {
            this._showError(e);
        });

        this.controls.upload.bind("success", (e) => {
            if (e.operation === "upload") {
                var files = e.response;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    this.data.options.uploadSuccess(file);     
                    if (!file.url) {
                        this._setImageUrl(file);
                    }
                    this.data.images.push(file);
                }
                this._renderImage();
            } 
        });

        this.controls.saveButton.bind("click", (e) => {
            this.data.options.save(this.data.images);
            this.dialog.close();
        });

        this.controls.cancelButton.bind("click", (e) => {
            this.data.options.cancel(this.originalImages);
            this.dialog.close();
        });

        this.controls.viewImageButton.bind("click", (e) => {
            var slideImages = [];
            $.each(this.data.images, (index, image) => {
                var state = image.dataState || 0;
                if (state !== this.modelDataState.delete) {
                    slideImages.push(image);
                }
            });
             // Using fancybox to view images.
            if ($.fancybox) {
                var images = $.map(slideImages, (image, i) => {
                    return { src: image.url, opts: { caption: image.fileName } }
                });
                $.fancybox.open(images, {
                    loop: true,
                    slideShow: {
                        autoStart: false,
                        speed: 5000
                    },
                    animationEffect: "fade",
                    transitionEffect: "fade",
                    buttons: ["slideShow", "close"],
                    afterLoad: () => {
                        $(".fancybox-bg").addClass("fancybox-bg-plain");
                        $(".fancybox-caption").addClass("fancybox-caption-plain");
                        $(".fancybox-infobar").addClass("fancybox-infobar-lg");
                    }
                });
            } else {
                this.data.options.viewImages(slideImages);
            }
        });
         
        this._isInit = true;
    } 

    open(data) {
        this.data = $.extend(true, {
            images: [],
            options: {
                save: (data) => this.options.save(data),
                cancel: (data) => this.options.cancel(data),
                error: (message) => this.options.error(message),
                uploadSuccess: (data) => this.options.uploadSuccess(data),
                removeSuccess: (data) => this.options.removeSuccess(data),
                viewImages: (data) => this.options.viewImages(data),
                services: {
                    image: this.options.services.image
                }
            }
        }, data);

        this.originalImages = JSON.parse(JSON.stringify(this.data.images));

        this._init(); 
        this.dialog.open(); 
        this._renderImage();
    } 

    _renderImage() {
        // intialze file.
        var images = $.grep(this.data.images, (image,index) => {
            return image.dataState !== this.modelDataState.delete;
        });

        var template = kendo.template($("#image-template").html());
        this.controls.uploadImageContainer.html(kendo.render(template, images));
        this.controls.uploadInfo.html(kendo.format("Total upload image {0} image(s)", images.length));

        this.controls.viewImageButton.enable(images.length > 0);

        // bind remove event.
        $(".btn-remove", this.controls.uploadImageContainer).bind("click", (ev) => {
            var id = $(ev.target).data("id");
            var dataToRemoves = $.grep(this.data.images, (image, index) => {
                return image.id == id;
            });

            if (dataToRemoves.length > 0) {
                var dataToRemove = dataToRemoves[0];
                if (dataToRemove.isPersistence === true) {
                    dataToRemove.dataState = this.modelDataState.delete;
                } else {
                    var index = this.data.images.indexOf(dataToRemoves[0]);
                    this.data.images.splice(index, 1);
                }      
                this.data.options.removeSuccess(dataToRemove);
                this._renderImage();
            }
        });
    }

    _setImageUrl(data) {
        data.url = kendo.format(this.data.options.services.image ,data.savedFileName);
    }

    _getControlName(name) {
        var prefix = $(this.options.name, this.dialog.wrapper).data("control-prefix");
        return kendo.format("{0}-{1}", prefix, name);
    }

    _showSuccess(message) { 
        app.ui.showAlertSuccess(this.controls.messageContainer, message);
    }

    _showError(message) {
        this.options.error(message);
        app.ui.showAlertError(this.controls.messageContainer, message);
    }

    _clearMessage() {
        app.ui.clearAlert(this.controls.messageContainer);
    }
}