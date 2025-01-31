class ScannerDialog {
    constructor(selector, options) {
        var _this = this;
        this.options = $.extend(true, {
            dialog: {
                visible: false,
                modal: true,
                title: false,
                animation: {
                    open: {
                        effects: "fade:in"
                    },
                    close: {
                        effects: "fade:out"
                    }
                },
                actions: [{
                    text: "Close",
                    primary: true
                }],
                closable: false,
                close: function (e) {
                    _this.decoder.stop();
                    _this.success = function (res) { };
                }
            },
            scanner: {     
                width: 480,
                height: 360,
                successTimeout: 1000,
                resultFunction: function (res) {
                    [].forEach.call(_this.controls.scannerLaser, function (el) {
                        $(el).fadeOut(300, function () {
                            $(el).fadeIn(300);
                        });
                    });
                    _this.success(res);
                    _this.close();
                },
                getDevicesError: function (error) {
                    var p, message = "Error detected with the following parameters:\n";
                    for (p in error) {
                        message += (p + ": " + error[p] + "\n");
                    }
                    _this.controls.cameraStatus.html("Device Error");
                    alert(message);
                },
                getUserMediaError: function (error) {
                    var p, message = "Error detected with the following parameters:\n";
                    for (p in error) {
                        message += (p + ": " + error[p] + "\n");
                    }
                    _this.controls.cameraStatus.html("Media Error");
                    alert(message);
                },
                cameraError: function (error) {
                    var p, message = "Error detected with the following parameters:\n";
                    if (error.name == "NotSupportedError") {
                        alert("Browser not suppoert.");
                    } else {
                        for (p in error) {
                            message += p + ": " + error[p] + "\n";
                        }
                        _this.controls.cameraStatus.html("Camera Error");
                        alert(message);
                    }
                },
                cameraSuccess: function () {
                    console.log("camera success.");                    
                    _this.controls.cameraStatus.html("<i class='fas fa-check-circle'></i> Ready.");
                    // disable close button
                    $(".k-dialog-buttongroup > button",_this.dialog.element).prop("disabled", false);
                }
            },
        }, options);

        this.success = function (res) { };
        this.dialog = $(selector).kendoDialog(this.options.dialog).data("kendoDialog");
        this.controls = {
            scannerLaser: $(".scanner-laser", this.dialog.element),
            cameraStatus: $("#camera-status", this.dialog.element),
            contrast: $("#contrast", this.dialog.element),
            contrastValue: $("#contrast-value", this.dialog.element),
            zoom: $("#zoom", this.dialog.element),
            zoomValue: $("#zoom-value", this.dialog.element),
            brightness: $("#brightness", this.dialog.element),
            brightnessValue: $("#brightness-value", this.dialog.element),
            sharpness: $("#sharpness", this.dialog.element),
            sharpnessValue: $("#sharpness-value", this.dialog.element)
        };

        this.options.scanner.beep = this.dialog.element.data("beep-src");
        this.options.scanner.decoderWorker = this.dialog.element.data("decoder-worker-src");

        this.decoder = $("#webcodecam-canvas", this.dialog.element).WebCodeCamJQuery(this.options.scanner).data().plugin_WebCodeCamJQuery;
        this.decoder.buildSelectMenu("#camera-select", "environment|back").init();

        // Binding event.
        $("#camera-select").on("change", function () {
            if (_this.decoder.isInitialized()) {
                _this.controls.cameraStatus.html("<i class='fas fa-spin fa-spinner'></i> Connecting...");
                _this.decoder.stop().play();
                // disable close button
                $(".k-dialog-buttongroup > button", _this.dialog.element).prop("disabled", true);
            }
        });

        this.controls.zoom.on("change", function (event) {
            var v = parseInt($(this).val()) / 10;
            _this.changeZoom(v);
        });

        this.controls.brightness.on("change", function (event) {
            var v = parseInt($(this).val());
            _this.changeBrightness(v);
        });

        this.controls.contrast.on("change", function (event) {
            var v = parseInt($(this).val());
            _this.changeContrast(v);
        });

        this.controls.sharpness.on("change", function (event) {
            var v = parseInt($(this).val());
            _this.changeSharpness(v);
        });


        var getZomm = setInterval(function () {
            var a;
            try {
                a = decoder.getOptimalZoom();
            } catch (e) {
                a = 0;
            }
            if (!!a && a !== 0) {
                changeZoom(a);
                clearInterval(getZomm);
            }
        }, 500);
    }

    changeZoom(a) {
        if (this.decoder.isInitialized()) {
            var value = a || 1;
            this.controls.zoomValue.text(this.controls.zoomValue.text().split(":")[0] + ": " + value.toString());
            this.decoder.options.zoom = value;
            if (typeof a != "undefined") {
                this.controls.zoom.val(a * 10);
            }
        }
    };

    changeContrast() {
        if (this.decoder.isInitialized()) {
            var value = this.controls.contrast.val();
            this.controls.contrastValue.text(this.controls.contrastValue.text().split(":")[0] + ": " + value.toString());
            this.decoder.options.contrast = parseFloat(value);
        }
    };

    changeBrightness() {
        if (this.decoder.isInitialized()) {
            var value = this.controls.brightness.val();
            this.controls.brightnessValue.text(this.controls.brightnessValue.text().split(":")[0] + ": " + value.toString());
            this.decoder.options.brightness = parseFloat(value);
        }
    };

    changeSharpness() {
        if (this.decoder.isInitialized()) {
            var value = this.controls.sharpness.prop("checked");
            if (value) {
                this.controls.sharpnessValue.text(this.controls.sharpnessValue.text().split(":")[0] + ": ON");
                this.decoder.options.sharpness = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            } else {
                this.controls.sharpnessValue.text(this.controls.sharpnessValue.text().split(":")[0] + ": OFF");
                this.decoder.options.sharpness = [];
            }
        }
    };

    open(options) {
        options = $.extend(true, { success: function (res) { } }, options);
        this.controls.cameraStatus.html("<i class='fas fa-spin fa-spinner'></i> Connecting...");
        // disable close button
        $(".k-dialog-buttongroup > button", this.dialog.element).prop("disabled", true);
        this.success = options.success;       
        this.decoder.play();
        this.dialog.open();
        this.dialog.wrapper.css({ top: "20px"});
       
    }

    close() {        
        this.dialog.close();
    }
}