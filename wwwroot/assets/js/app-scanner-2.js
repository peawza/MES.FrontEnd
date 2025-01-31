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
                    _this.success = function (res) { };
                }
            },
            scanner: {     
                
            },
        }, options);

        this.success = function (res) { };
        this.dialog = $(selector).kendoDialog(this.options.dialog).data("kendoDialog");
        
    }

    onScanSuccess(decodedText, decodedResult) {
        // Handle on success condition with the decoded text or result.
        console.log(`Scan result: ${decodedText}`, decodedResult);
    }

    onScanError(errorMessage) {
        // handle on error condition, with error message
    }


    open(options) {
        var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
        html5QrcodeScanner.render(onScanSuccess);
        this.dialog.open();
        this.dialog.wrapper.css({ top: "20px"});
    }

    close() {        
        this.dialog.close();
    }
}