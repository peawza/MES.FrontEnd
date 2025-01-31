class MessageDialog {
    constructor(name, options) {
        name = name || 'message-dialog';
        this.options = $.extend(true, {
            visible: false,
            modal: {
                preventScroll: false
            },
            minWidth: 400,
            title: 'Message Dialog',
            animation: {
                open: {
                    effects: "fade:in"
                },
                close: {
                    effects: "fade:out"
                }
            },
            actions: [{
                text: "OK",
                primary: false
            }]
        }, options);

        this.dialog = $('<div id="' + name + '" name="' + name + '"></div>').kendoDialog(this.options).data("kendoDialog");
    }

    open(message, title, onClickCallback) {
        this.dialog.title(title || this.options.title);
        $(".k-dialog-titlebar", this.dialog.wrapper).removeClass("k-dialog-titlebar-danger k-dialog-titlebar-warning k-dialog-titlebar-success");
        this.dialog.content(message);
        this.dialog.open();
    }

    info(message, title, onClickCallback) {
        this.dialog.title(title || "Information");
        $(".k-dialog-titlebar", this.dialog.wrapper).removeClass("k-dialog-titlebar-primary k-dialog-titlebar-danger k-dialog-titlebar-warning k-dialog-titlebar-success").addClass("k-dialog-titlebar-primary");
        this.dialog.content('<i class="fas fa-info-circle text-primary fs-xl"></i><span class="fs-lg">' + message + '</span>');
        this.dialog.setOptions({
            actions: [
                {
                    text: "OK",
                    action: function () {
                        if (onClickCallback) {
                            onClickCallback();
                        }
                        return true; // Close dialog after callback
                    }
                }
            ]
        });
        this.dialog.open();
    }

    success(message, onClickCallback) {
        this.dialog.title("Success");
        $(".k-dialog-titlebar", this.dialog.wrapper).removeClass("k-dialog-titlebar-primary k-dialog-titlebar-danger k-dialog-titlebar-warning k-dialog-titlebar-success").addClass("k-dialog-titlebar-success");
        this.dialog.content('<i class="fas fa-check-circle text-success fs-xl"></i><span class="fs-lg">' + message + '</span>');
        this.dialog.setOptions({
            actions: [
                {
                    text: "OK",
                    action: function () {
                        if (onClickCallback) {
                            onClickCallback();
                        }
                        return true; // Close dialog after callback
                    }
                }
            ]
        });

        this.dialog.open();
    }

    error(message, onClickCallback) {
        this.dialog.title("Error");
        $(".k-dialog-titlebar", this.dialog.wrapper).removeClass("k-dialog-titlebar-primary k-dialog-titlebar-danger k-dialog-titlebar-warning k-dialog-titlebar-success").addClass("k-dialog-titlebar-danger");
        this.dialog.content('<i class="fas fa-times-circle text-danger fs-xl"></i><span class="fs-lg">' + message + '</span>');
        this.dialog.setOptions({
            actions: [
                {
                    text: "OK",
                    action: function () {
                        if (onClickCallback) {
                            onClickCallback();
                        }
                        return true; // Close dialog after callback
                    }
                }
            ]
        });

        this.dialog.open();
    }

    warning(message, onClickCallback) {
        this.dialog.title("Warning");
        $(".k-dialog-titlebar", this.dialog.wrapper).removeClass("k-dialog-titlebar-primary k-dialog-titlebar-danger k-dialog-titlebar-warning k-dialog-titlebar-success").addClass("k-dialog-titlebar-warning");
        this.dialog.content('<i class="fas fa-exclamation-triangle text-warning fs-xl"></i><span class="fs-lg">' + message + '</span>');
        this.dialog.open();
    }

    close() {

        this.dialog.close();
    }
}

class ConfirmationDialog {
    constructor(name, options) {
        this.name = name;
        this.options = $.extend(true, {
            visible: false,
            modal: true,
            title: 'Confirmation',
            content: 'Are you sure you want to proceed?',
            messages: {
                okText: "Yes",
                cancel: "No"
            }
        }, options);
    }

    open(options, message, title) {
        options = $.extend(true, { yes: function () { }, no: function () { } }, options);
        var html = '<div id="' + this.name + '" name="' + this.name + '"></div>';
        this.options.actions = [{ action: options.yes }, { action: options.no }];
        var dialog = $(html).kendoConfirm(this.options).data("kendoConfirm");
        dialog.title(title || this.options.title);
        dialog.content(message || this.options.content);
        dialog.open();
        return dialog.result;
    }
}