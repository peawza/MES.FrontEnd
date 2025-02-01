var app = {
    messages: {
        ajax: {
            "loading": "Please wait while data is loading.."
        },
        validators: {
            "required": "{0} is required.",
            "dateMustNotGreaterThanTo": "Date from must be less than or equal date to"
        },
        dataSource: {
            "requestEnd": {
                "readNoRecord": "Data not found.",
                "readSuccess": "request data is successfully.",
                "updateSuccess": "The data was {0} successfully.",
                "createSuccess": "The data was {0} successfully.",
                "destroySuccess": "The data was deleted successfully."
            },
            "noRecordFound": "No data from search result."
        },
        sessionTimeout: {
            title: "Your session is about to expire!",
            message: "Your session is about to expire.",
            countdownMessage: 'Redirecting in {timer} seconds.'
        },
        "scrollToTop": "Scroll to top"
    },
    data: {
        toDateString: function (date) {
            if (date && date.toISOString !== undefined)
                return date.toISOString();
            return "";
        },
        dateDiff: function (date1, date2) {
            var timeDiff = date1.getTime() - date2.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        },
        mergeDateTime: function (date, time) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
        },
        replaceAt: function (string, index, replace) {
            return string.substring(0, index) + replace + string.substring(index + 1);
        }
    },
    ui: {
        getRequiredMessage: function (input) {
            if (input.is("[data-val-required]")) {
                return input.data("val-required");
            }

            var field = input.data("field");
            if (field)
                return kendo.format(app.messages.validators.required, field);
            return app.messages.validators.required;
        },
        getFormatMessage: function (format, input) {
            var field = input.data("field");
            if (field)
                return kendo.format(format, field);
            return format;
        },
        preventKeyEventInPage: function () {
            var selector = $("body");
            selector.on('keypress', function (e) {
                e = e || window.event;
                var key = e.keyCode;
                var srcElement = e.target || e.srcElement;
                var cancelEvent = !(srcElement.type === "submit" || srcElement.type === "button" || srcElement.tagName.toLocaleLowerCase() === "textarea");

                if (key === 13) {
                    e.returnValue = !cancelEvent;
                    e.cancelBubble = cancelEvent;
                    if (cancelEvent) { e.preventDefault(); }
                    return !cancelEvent;
                }
                return true;
            });

            selector.on('keydown', function (e) {
                e = e || window.event;
                var key = e.keyCode;
                var srcElement = e.target || e.srcElement;
                var cancelEvent = (srcElement.type === "submit" || srcElement.type === "button" || (srcElement.type === "text" && srcElement.readOnly));

                if (key === 8) {
                    e.returnValue = !cancelEvent;
                    e.cancelBubble = cancelEvent;
                    if (cancelEvent) { e.preventDefault(); }
                    return !cancelEvent;
                }
                return true;
            });
        },
        initAjax: function () {
            var notification = $("#ajax-notifications").kendoNotification({
                show: onNotificationShow, hide: onNotificationHide,
                position: {
                    pinned: true,
                    bottom: 10,
                    left: 10
                },
                animation: {
                    open: {
                        effects: "fadeIn"
                    },
                    close: {
                        effects: "fadeOut"
                    }
                },
                width: 400,
                autoHideAfter: 0,
                stacking: "down",
                templates: [
                    {
                        type: "progress",
                        template: "<div class=\"\"><i class=\"fa-duotone fa-spinner-third fa-spin\"></i> #= message #</div>"
                    }
                ]
            }).data("kendoNotification");

            if (notification) {
                $(document).ajaxStart(function () {
                    notification.show({ message: app.messages.ajax.loading }, "progress");
                }).ajaxStop(function () {
                    notification.hide();
                });
            }
        },
        clear: function (target, container) {
            var elems = [];
            if (!$.isArray(target)) {
                elems.push(target);
            } else {
                elems = $.merge([], target);
            }

            $.each(target, function (index, elem) {
                if (!elem) { return; }
                if (elem.element !== undefined && elem.value !== undefined) {
                    var d = $(elem.element).data("default");
                    if (typeof d !== "undefined") {
                        if (elem.value() != d) {
                            elem.value(d);
                            elem.trigger("change");
                        }
                    } else {
                        if (elem.select !== undefined) {
                            elem.select(0);
                        } else {
                            elem.value('');
                        }
                        elem.trigger("change");
                    }
                    return;
                }

                var w = container == undefined ? $(elem) : $(elem, container);
                var t = w.data("kendoGrid");
                if (t) {
                    // clear filter and sorting
                    console.log(t.dataSource.options);
                    if (t.dataSource.options.serverFiltering == false) {
                        t.dataSource.filter({});
                    }

                    if (t.dataSource.options.serverSorting == false) {
                        t.dataSource.sort({});
                    }

                    if (t.dataSource.options.serverPaging == false) {
                        t.dataSource.page(1);
                    }
                    t.dataSource.data([]);
                    return;
                }

                t = w.data("kendoAutoComplete");
                if (t) {
                    var v = t.value();
                    t.value('');
                    if (v !== '') {
                        t.trigger("change");
                    }
                    return;
                }

                t = w.data("kendoMultiSelect");
                if (t) { t.value([]); return; }

                t = w.data("kendoDropDownList");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (t.value() != d) {
                            t.value(d);
                            t.trigger("select");
                        }
                    } else {
                        t.select(0);
                        t.trigger("select");
                    }
                    return;
                }

                t = w.data("kendoNumericTextBox");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (t.value() !== d) {
                            t.value(d);
                            t.trigger("change");
                        }
                    } else {
                        t.value('');
                    }
                    return;
                }

                t = w.data("kendoDatePicker");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        var v = kendo.parseDate(d, t.options.parseFormats);
                        if (v !== t.value()) {
                            t.value(v);
                            t.trigger("change");
                        }
                    } else {
                        t.value(null);
                    }
                    return;
                }

                t = w.data("kendoDateTimePicker");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        var v = kendo.parseDate(d, t.options.parseFormats);
                        if (v !== t.value()) {
                            t.value(v);
                            t.trigger("change");
                        }
                    } else {
                        t.value(null);
                    }
                    return;
                }

                t = $(elem).data("kendoTextBox");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (d !== t.value()) {
                            t.value(d);
                            t.trigger("change");
                        }
                    } else {
                        t.value('');
                    }
                    return;
                }

                t = $(elem).data("kendoTextArea");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (d !== t.value()) {
                            t.value(d);
                            t.trigger("change");
                        }
                    } else {
                        t.value('');
                    }
                    return;
                }

                if (w.is("[type=checkbox]")) {
                    var doChecked = w.is("[data-default-checked]");
                    if (doChecked)
                        w.prop("checked", true);
                    else
                        w.prop("checked", false);
                    return;
                }

                if (w.is("[type=radio]")) {
                    var doChecked = w.is("[data-default-checked]");
                    if (doChecked)
                        w.prop("checked", true);
                    else
                        w.prop("checked", false);
                    return;
                }

                if (w.val() !== '') {
                    w.val('');
                    w.trigger("change");
                }
            });
        },
        handleDatePickerChange: function (selector) {
            selector = selector || "[data-role='datepicker']";
            $(selector).bind("change", function (e) {
                var datePicker = $(this).data("kendoDatePicker");
                if (datePicker) {
                    var raiseEvent = false;
                    var v = kendo.parseDate($(this).val(), datePicker.options.format);
                    if (v) {
                        if (datePicker.value() !== v) {
                            raiseEvent = true;
                        }
                        datePicker.value(v);
                    } else {
                        if (datePicker.value() !== v) {
                            raiseEvent = true;
                        }
                        datePicker.value(null);
                    }
                    if (raiseEvent) { datePicker.trigger("change"); }
                }
            });
        },
        datePickerRelate: function (datepickerFrom, datepickerTo, allowNull) {
            allowNull = allowNull === undefined ? true : allowNull;
            datepickerFrom.bind("change", function (e) {
                if (allowNull && (this.value() === null || datepickerTo.value() === null)) { return; }
                if (this.value() > datepickerTo.value()) {
                    if (datepickerTo.value() !== this.value()) {
                        datepickerTo.value(this.value());
                        datepickerTo.trigger("change");
                    }
                }

            });
            datepickerTo.bind("change", function (e) {
                if (allowNull && (this.value() === null || datepickerFrom.value() === null)) { return; }
                if (this.value() < datepickerFrom.value()) {
                    if (datepickerFrom.value() !== this.value()) {
                        datepickerFrom.value(this.value());
                        datepickerFrom.trigger("change");
                    }
                }
            });
        },
        numericTextBoxRelate: function (numericFrom, numericTo, allowNull) {
            allowNull = allowNull || true;
            numericFrom.bind("change", function (e) {
                if (allowNull && (this.value() === null || numericTo.value() === null)) { return; }
                if (this.value() > numericTo.value()) {
                    if (numericTo.value() !== this.value()) {
                        numericTo.value(this.value());
                        numericTo.trigger("change");
                    }
                }

            });
            numericTo.bind("change", function (e) {
                if (allowNull && (this.value() === null || numericFrom.value() === null)) { return; }
                if (this.value() < numericFrom.value()) {
                    if (numericFrom.value() !== this.value()) {
                        numericFrom.value(this.value());
                        numericFrom.trigger("change");
                    }
                }
            });
        },
        dataSourceRead: function (ds) {
            ds.data([]);
            ds.page(1);
        },
        handleDataSourceRequestEnd: function (e, options) {
            var settings = $.extend(true, {
                create: {
                    notification: {
                        icon: 'fas fa-check-circle fs-lg',
                        message: kendo.format(app.messages.dataSource.requestEnd.createSuccess, e.type),
                        delay: 3000,
                        type: 'success',
                        enable: true
                    },
                    resetPage: true,
                    complete: function (message) { }
                },
                update: {
                    notification: {
                        icon: 'fas fa-check-circle fs-lg',
                        message: kendo.format(app.messages.dataSource.requestEnd.updateSuccess, e.type),
                        delay: 3000,
                        type: 'success',
                        enable: true
                    },
                    resetPage: true,
                    complete: function (message) { }
                },
                destroy: {
                    notification: {
                        icon: 'fas fa-check-circle fs-lg',
                        message: kendo.format(app.messages.dataSource.requestEnd.destroySuccess, e.type),
                        delay: 3000,
                        type: 'success',
                        enable: true
                    },
                    resetPage: true,
                    complete: function (message) { }
                },
                read: {
                    notification: {
                        icon: 'fas fa-info-circle fs-lg',
                        message: kendo.format(app.messages.dataSource.requestEnd.readSuccess, e.type),
                        delay: 3000,
                        type: 'success',
                        enable: false
                    },
                    empty: {
                        icon: 'fas fa-exclamation-triangle fs-lg',
                        message: app.messages.dataSource.requestEnd.readNoRecord,
                        delay: 3000,
                        type: 'warning',
                        enable: true,
                    },
                    complete: function (message) { },
                    dataNotFound: function (message) { }
                }
            }, options || {});

            if (typeof e.type !== "undefined") {
                switch (e.type) {
                    case "create":
                        var message = e.response.message !== undefined ? e.response.message : settings.create.message;
                        if (settings.create.notification.enable === true) {
                            $.notify({
                                icon: settings.create.notification.icon,
                                message: message
                            }, {
                                delay: settings.create.notification.delay,
                                type: settings.create.notification.type
                            });
                        }

                        if (settings.create.resetPage == true) {
                            e.sender.page(1);
                        }
                        settings.create.complete(message);
                        return { handled: true, message: message };
                    case "update":
                        var message = e.response.message !== undefined ? e.response.message : settings.update.message;
                        if (settings.update.notification.enable === true) {
                            $.notify({
                                icon: settings.update.notification.icon,
                                message: message
                            }, {
                                delay: settings.update.notification.delay,
                                type: settings.update.notification.type
                            });
                        }

                        if (settings.update.resetPage == true) {
                            e.sender.page(1);
                        }
                        settings.update.complete(message);
                        return { handled: true, message: message };
                    case "destroy":
                        var message = e.response.message !== undefined ? e.response.message : settings.destroy.message;
                        if (settings.destroy.notification.enable === true) {
                            $.notify({
                                icon: settings.destroy.notification.icon,
                                message: message
                            }, {
                                delay: settings.destroy.notification.delay,
                                type: settings.destroy.notification.type
                            });
                        }

                        if (settings.destroy.resetPage == true) {
                            e.sender.page(1);
                        }
                        settings.destroy.complete(message);
                        return { handled: true, message: message };
                    case "read":
                        if (e.response !== undefined && e.response.Data !== undefined) {
                            if (e.response.Data.length === 0) {
                                if (settings.read.empty.enable === true) {
                                    $.notify({
                                        icon: settings.read.empty.icon,
                                        message: settings.read.empty.message
                                    }, {
                                        delay: settings.read.empty.delay,
                                        type: settings.read.empty.type
                                    });
                                }
                                settings.read.dataNotFound(settings.read.empty.message);
                                return { handled: true, message: settings.read.empty.message };
                            } else {
                                if (settings.read.notification.enable === true) {
                                    $.notify({
                                        icon: settings.read.notification.icon,
                                        message: settings.read.notification.message
                                    }, {
                                        delay: settings.read.notification.delay,
                                        type: settings.read.notification.type
                                    });
                                }
                                settings.read.complete(settings.read.notification.message);
                                return { handled: true, message: settings.read.notification.message };
                            }
                        }
                }
            }
            return { handled: false };
        },
        handleDataSourceError: function (e, options) {
            var settings = $.extend(true, {
                notification: { icon: 'fas fa-times-circle fs-lg', delay: 3000, z_index: 2000 },
                sessionTimeout: function () { window.location = "/"; },
                read: function (message, e) { console.log(message); },
                create: function (message, e) { console.log(message); },
                update: function (message, e) { console.log(message); },
                destroy: function (message, e) { console.log(message); }
            }, options || {});

            if (e.status === "error") {
                var message = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.message : e.xhr.statusText;
                var isSessionTimeout = e.xhr.responseJSON !== undefined ? (e.xhr.responseJSON.sessiontimeOut !== undefined ? e.xhr.responseJSON.sessiontimeOut : false) : false;
                var operation = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.operation : '';
                var response = e.xhr.responseJSON || {};
                $.notify({
                    // options
                    icon: settings.notification.icon,
                    message: message
                }, {
                    // settings
                    delay: settings.notification.delay,
                    type: 'danger',
                    z_index: settings.notification.z_index,
                });

                if (operation === 'read') {
                    settings.read(message, response);
                    e.preventDefault();
                }

                if (operation === 'create') {
                    settings.create(message, response);
                    e.preventDefault();
                }

                if (operation === 'destroy') {
                    settings.destroy(message, response);
                    e.preventDefault();
                }

                if (operation === 'update') {
                    settings.update(message, response);
                    e.preventDefault();
                }

                if (isSessionTimeout === true) {
                    settings.sessionTimeout(message);
                }
                return { "handled": true, "message": message, "type": operation };
            }
            return { "handled": false };
        },
        handleAjaxSuccess: function (data, status, xhr) {
            var message = data.message || "Data request is successfully.";
            $.notify({
                icon: 'fas fa-check-circle fs-lg',
                message: message
            }, {
                // settings
                delay: 3000,
                type: 'success'
            });
            return message;
        },
        handleAjaxError: function (xhr, status, error) {
            var message = xhr.responseJSON !== undefined && xhr.responseJSON.message !== undefined ? xhr.responseJSON.message : "Internal Server Error";
            var isSessionTimeout = xhr.responseJSON !== undefined ? (xhr.responseJSON.sessiontimeout !== undefined ? xhr.responseJSON.sessiontimeout : false) : false;
            $.notify({
                // options
                icon: 'fas fa-times-circle',
                message: message
            }, {
                // settings
                delay: 3000,
                type: 'danger'
            });

            if (isSessionTimeout === true) {
                window.location = "/";
            }
            return message;
        },
        applySelectAllTextOnFocus: function (selectors) {
            selectors = selectors || "input[type=text],input[data-role='textbox'],input[data-role='datepicker'],textarea";
            $(selectors).on("focus", function () {
                var input = $(this);
                clearTimeout(input.data("selectTimeId")); //stop started time out if any

                var selectTimeId = setTimeout(function () {
                    input.select();
                });

                input.data("selectTimeId", selectTimeId);
            }).blur(function (e) {
                clearTimeout($(this).data("selectTimeId")); //stop started timeout
            });
        },
        applyRegExpTextBox: function (selector, pattern) {
            var j = selector instanceof jQuery ? selector : $(selector);
            j.on("keydown", function (e) {
                if (!pattern.test(e.key)) {
                    e.preventDefault();
                }
                //console.log(e.key);
            });
        },
        applyLetterTextBox: function (selectors) {
            var j = selectors instanceof jQuery ? selectors : $(selectors || "[data-role='lettertextbox']");
            j.on("keydown", function (e) {
                var pattern = /[A-Za-z0-9_-]/i;
                if (!pattern.test(e.key)) {
                    e.preventDefault();
                }
                //console.log(e.key);
            });
        },
        showValidateSummary: function (errors, selector) {
            selector = selector || ".k-validation-summary";

            if (errors.length > 0) {
                var html = "<ul>";
                for (var idx = 0; idx < errors.length; idx++) {
                    html += "<li>" + errors[idx] + "</li>";
                }
                html += "</ul>";
                $(selector).show().empty().append($(html));
            } else {
                $(selector).hide();
            }
        },
        hideValidationMessages: function (v, selector) {
            selector = selector || ".k-validation-summary";
            v.hideMessages();
            $(".k-invalid").removeClass("k-invalid");
            $(selector).hide();
        },
        initGridPopupEditor: function (e, options) {
            //<span class="k-icon k-i-save"></span> Save
            options = $.extend(true, {
                create: {
                    title: "New",
                    buttons: {
                        save: {
                            text: "Save", icon: "save", htmlAttributes: { class: "k-primary" }
                        },
                        cancel: {
                            text: "Close", icon: "cancel", htmlAttributes: { class: "k-warning" }
                        }
                    }
                },
                edit: {
                    title: "Edit",
                    buttons: {
                        save: {
                            text: "Save", icon: "save", htmlAttributes: { class: "k-primary" }
                        },
                        cancel: {
                            text: "Close", icon: "cancel", htmlAttributes: { class: "k-warning" }
                        }
                    }
                },
                confirmation: false
            }, options || {});

            var updateButton = $(e.container).parent().find(".k-grid-update");
            var cancelButton = $(e.container).parent().find(".k-grid-cancel");
            //cancelButton.on("click", function (ev) {
            //    ev.preventDefault();


            //    var confirmationDialog = new ConfirmationDialog();
            //    confirmationDialog.open({
            //        yes: function () {


            //        }
            //    }, Message("Confirm", "ConfirmExitWindow"), "Confirmation");
            //});

            if (e.model.isNew()) {
                e.container.kendoWindow("title", options.create.title);
                updateButton.html(kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.create.buttons.save.icon, options.create.buttons.save.text)).removeClass("k-primary").addClass(options.create.buttons.save.htmlAttributes.class);
                cancelButton.html(kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.create.buttons.cancel.icon, options.create.buttons.cancel.text)).removeClass("k-primary").addClass(options.create.buttons.cancel.htmlAttributes.class);

                if (typeof options.confirmation === "function") {
                    // Custom create save button > and hide k-grid-update.
                    var saveButton = $('<a role="button" class="k-button k-button-icontext k-primary k-grid-save k-button-md k-rounded-md k-button-solid k-button-solid-primary k-icon-button" title="Save" href="#"><span class="k-icon k-i-' + options.create.buttons.save.icon + '"></span>' + options.create.buttons.save.text + '</a>');
                    $(".k-edit-buttons", e.container).prepend(saveButton);
                    updateButton.hide();

                    saveButton.on("click", function (ev) {
                        ev.preventDefault();
                        var isValid = true;
                        // Validator
                        if (options.validator !== undefined && options.validator.validate !== undefined) {
                            app.ui.hideValidationMessages(options.validator);
                            isValid = options.validator.validate();
                            if (!isValid) { ev.preventDefault(); return false; }
                        }

                        if (isValid === true) {
                            options.confirmation(true).result.done(function () {
                                updateButton.trigger("click");
                            });
                        }
                    });


                } else {
                    // Use browser confirm dialog.
                    e.container.find(".k-grid-update").on('click', function (ev) {
                        var isValid = true;
                        // Validator
                        if (options.validator !== undefined && options.validator.validate !== undefined) {
                            app.ui.hideValidationMessages(options.validator);
                            isValid = options.validator.validate();
                            if (!isValid) { ev.preventDefault(); return false; }
                        }
                        // Confirmation Dialog
                        if (isValid && options.confirmation !== false) {

                            var confirmOptions = {
                                title: 'Are you sure that you want to proceed?',
                                cancel: function () { }
                            };

                            if (typeof options.confirmation === "string") {
                                confirmOptions = $.extend(true, confirmOptions, { title: options.confirmation });
                            }

                            if (!confirm(confirmOptions.title)) {
                                confirmOptions.cancel();
                                ev.preventDefault();
                                return false;
                            }
                        }
                        return true;
                    });
                }
            } else {
                e.container.kendoWindow("title", options.edit.title);
                updateButton.html(kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.edit.buttons.save.icon, options.edit.buttons.save.text)).removeClass("k-primary").addClass(options.edit.buttons.save.htmlAttributes.class);
                cancelButton.html(kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.edit.buttons.cancel.icon, options.edit.buttons.cancel.text)).removeClass("k-primary").addClass(options.edit.buttons.cancel.htmlAttributes.class);

                if (typeof options.confirmation === "function") {
                    // Custom create save button > and hide k-grid-update.
                    var saveButton = $('<a role="button" class="k-button k-button-icontext k-primary k-grid-save k-button-md k-rounded-md k-button-solid k-button-solid-primary k-icon-button" title="Save" href="#"><span class="k-icon k-i-' + options.edit.buttons.save.icon + ' pr-2"></span>' + options.edit.buttons.save.text + '</a>');
                    $(".k-edit-buttons", e.container).prepend(saveButton);
                    updateButton.hide();

                    saveButton.on("click", function (ev) {
                        ev.preventDefault();
                        var isValid = true;
                        // Validator
                        if (options.validator !== undefined && options.validator.validate !== undefined) {
                            app.ui.hideValidationMessages(options.validator);
                            isValid = options.validator.validate();
                            if (!isValid) { ev.preventDefault(); return false; }
                        }

                        if (isValid === true) {
                            options.confirmation(false).result.done(function () {
                                updateButton.trigger("click");
                            });
                        }
                    });
                } else {
                    // Use browser confirm dialog.
                    e.container.find(".k-grid-update").on('click', function (ev) {
                        var isValid = true;
                        // Validator
                        if (options.validator !== undefined && options.validator.validate !== undefined) {
                            app.ui.hideValidationMessages(options.validator);
                            isValid = options.validator.validate();
                            if (!isValid) { ev.preventDefault(); return false; }
                        }
                        // Confirmation Dialog
                        if (isValid && options.confirmation !== false) {

                            var confirmOptions = {
                                title: 'Are you sure that you want to proceed?',
                                cancel: function () { }
                            };

                            if (typeof options.confirmation === "string") {
                                confirmOptions = $.extend(true, confirmOptions, { title: options.confirmation });
                            }

                            if (!confirm(confirmOptions.title)) {
                                confirmOptions.cancel();
                                ev.preventDefault();
                                return false;
                            }
                        }
                        return true;
                    });
                }
            }
        },
        applyTableHover: function (grid, options) {
            if (grid.table.tableHover !== undefined) {
                options = $.extend(true, { rowClass: 'k-grid-row-hover', colClass: 'k-grid-column-hover' }, options || {});
                grid.table.tableHover(options);
            }
        },
        initNotification: function () {
            // require call partialview _KendoNotication
            return $("#notifications").kendoNotification({
                position: {
                    pinned: true,
                    top: 100,
                    right: 40
                },
                width: 400,
                autoHideAfter: 3000,
                stacking: "down",
                templates: [
                    {
                        type: "info",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fas fa-info-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }, {
                        type: "error",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fas fa-times-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }, {
                        type: "success",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fas fa-check-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }
                ]

            }).data("kendoNotification");
        },
        setCheckBox: function (selector, checked) {
            if (checked)
                selector.prop("checked", "checked");
            else
                selector.prop("checked", false);
        },
        applyUploadLocalize: function (selector) {
            var upload = $(selector).data("kendoUpload");
            $.extend(upload.options.localization, app.messages.upload);
        },
        handleSessionTimeout: function (e) {

        },
        initGridRowNo: function (grid, rowNoFieldName) {
            var page = grid.dataSource.page() || 1;
            var pageSize = grid.dataSource.pageSize() || grid.dataSource.data().length;
            var start = ((page - 1) * pageSize) + 1;
            rowNoFieldName = rowNoFieldName || "_rowNo";

            $.each(grid.dataSource.view(), function (index, item) {
                item[rowNoFieldName] = start + index;
            });
        },
        enableGridRequestData: function (grid, enable) {
            if (grid == undefined) { return; }
            var j = grid instanceof jQuery ? grid : (grid.element !== undefined ? grid.element : $(grid));
            var g = j.data("kendoGrid");
            j.attr("k-enable-request", enable);
        },
        handleGridRequestStart: function (grid, e, requestCallback, preventCallback) {
            if (grid == undefined) { return; }
            var j = grid instanceof jQuery ? grid : (grid.element !== undefined ? grid.element : $(grid));
            var g = j.data("kendoGrid");
            var allowRequestData = j.is("[k-enable-request]") ? j.attr("k-enable-request") == "true" : true;
            if (allowRequestData) {
                //$(".k-grid-header .k-link", j).off("click");
                if (requestCallback && typeof (requestCallback) === "function") {
                    requestCallback();
                }

                g.dataSource.one("requestEnd", function (ev) {
                    setTimeout(function () {
                        if (ev.sender.data().length > 0) {
                            $(".k-grid-header .k-link", j).off("click");
                        } else {
                            $(".k-grid-header .k-link", j).on("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            });
                        }
                    }, 100);
                });
            } else {
                e.preventDefault();
                $(".k-grid-header .k-link", j).on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                if (preventCallback && typeof (preventCallback) === "function") {
                    preventCallback();
                }
            }
        },
        resizeGrid: function (selector) {
            if ($.isArray(selector)) {
                $.each(function (index, item) {
                    var grid = $(item).data("kendoGrid");
                    if (grid) {
                        grid.resize();
                    }
                });
            } else {
                var grid = $(selector).data("kendoGrid");
                if (grid) {
                    grid.resize();
                }
            }
        },
        getUrlVars: function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        uiEnable: function (selector, enable) {
            if (enable === true) {
                if ($.isArray(selector)) {
                    $.each(selector, function (index, item) {
                        if (item) {
                            if (item.enable !== undefined) {
                                item.enable(true);
                            } else {
                                $(item).removeAttr('disabled').removeClass('k-state-disabled');
                            }
                        }
                    });
                } else {
                    $(selector).removeAttr('disabled').removeClass('k-state-disabled');
                }
            }
            else {
                if ($.isArray(selector)) {
                    $.each(selector, function (index, item) {
                        if (item) {
                            if (item.enable !== undefined) {
                                item.enable(false);
                            } else {
                                $(item).attr('disabled', 'disabled').addClass('k-state-disabled');
                            }
                        }
                    });
                } else {
                    $(selector).attr('disabled', 'disabled').addClass('k-state-disabled');
                }
            }
        },
        selectFirstDropDownItem: function (w) {
            var dataItems = w.dataSource.view().toJSON();
            if (dataItems.length > 0) {
                w.select(w.options.optionLabel === "" ? 0 : 1);

                // Solve: MVVM not update when set default select via method.
                w.trigger("change");
            }
        },
        toggleVScrollable: function (grid, options) {
            var settings = $.extend({}, {
                height: 400
            }, options);

            $(".k-grid-content", grid.element).css('height', 'auto');
            $(".k-grid-content-locked", grid.element).css('height', 'auto');

            var vScrollbarHeight = 17;
            var contentHeight = $(".k-grid-content", grid.element).height();
            if (contentHeight > settings.height) {
                $(".k-grid-content", grid.element).css('height', parseInt(settings.height) + 'px');
                $(".k-grid-content-locked", grid.element).css('height', parseInt(settings.height) - vScrollbarHeight + 'px');
            }
            //console.log({ contentHeight: contentHeight, height: options.height });
        },
        gridDeleteConfirmDialog: function (grid, options) {
            $(".k-grid-delete", grid.element).removeClass("k-grid-delete").addClass("k-grid-remove");
            $(".k-grid-remove", grid.element).on("click", function (ev) {
                ev.preventDefault();
                var row = $(this).closest("tr[data-uid]");
                var name = grid.element.id + '-confirm-dialog';
                options = $.extend(true, { title: "Confirmation", content: "Are you sure that you want to proceed?", okText: "Yes", cancel: "No", visible: true, modal: true }, options);
                $("<div id='" + name + "'></div>").kendoConfirm(options).data("kendoConfirm").open().result.done(function () {
                    var dataItem = grid.dataItem(row[0]);
                    grid.dataSource.remove(dataItem);
                    grid.dataSource.sync();
                });
            });
        },
        rowDeleteConfirmDialog: function (sender, options) {
            var grid = $(sender).closest("div[data-role='grid']").data("kendoGrid");
            var row = $(sender).closest("tr[data-uid]");
            app.ui.confirmDialog(options).result.done(function () {
                var dataItem = grid.dataItem(row[0]);
                grid.dataSource.remove(dataItem);
                grid.dataSource.sync();
                grid.dataSource.read();
            });
        },
        confirmDialog: function (options) {
            options = $.extend(true, { title: "Confirmation", content: "Are you sure that you want to proceed?", okText: "Yes", cancel: "No", visible: true, modal: true, minWidth: 400 }, options);
            var dialog = $("<div id='_confirm-dialog'></div>").kendoConfirm(options).data("kendoConfirm");
            return dialog;
        },
        showAlertWarning(selector, message) {
            var j = selector instanceof jQuery ? selector : $(selector);
            var m = '<i class="fas fa-exclamation-triangle text-warning"></i> ' + message;
            j.html(m).removeClass("alert-warning alert-danger alert-success d-none").addClass("alert-warning").show();
        },
        showAlertSuccess(selector, message) {
            var j = selector instanceof jQuery ? selector : $(selector);
            var m = '<i class="fas fa-check-circle text-success"></i> ' + message;
            j.html(m).removeClass("alert-warning alert-danger alert-success d-none").addClass("alert-success").show();
        },
        showAlertError(selector, message) {
            var j = selector instanceof jQuery ? selector : $(selector);
            var m = '<i class="fas fa-times-circle text-danger"></i> ' + message;
            j.html(m).removeClass("alert-warning alert-danger alert-success d-none").addClass("alert-danger").show();
        },
        clearAlert(selector) {
            var j = selector instanceof jQuery ? selector : $(selector);
            j.addClass("d-none").empty().hide();
        }
    },
    initPage: function () {
        this.ui.initAjax();
        this.ui.applySelectAllTextOnFocus();
        this.ui.preventKeyEventInPage();
        this.ui.handleDatePickerChange();
    },
    initPopupEditor: function () {
        this.ui.applySelectAllTextOnFocus();
        this.ui.handleDatePickerChange();
    },
    setLocation: function (url) {
        window.location.href = url;
    },
    guid: function () {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    },
    addAntiForgeryToken: function (data) {
        //if the object is undefined, create a new one.
        if (!data) {
            data = {};
        }
        //add token
        var tokenInput = $('input[name=__RequestVerificationToken]');
        if (tokenInput.length) {
            data.__RequestVerificationToken = tokenInput.val();
        }
        return data;
    },
    displayFileSize: function (size) {
        var units = ['Bytes', 'KB', 'MB', 'GB'];
        for (var i = 0; i < units.length; i++) {
            if (size < 1024) { return kendo.toString(size, "n2") + " " + units[i]; }
            size = parseFloat(size) / 1024;
        }
        return kendo.toString(size, "n2");
    },
    generateReport: function (options) {
        if (options.validator.validate()) {
            clearError();
            uiState.busy('generate', true);
            $.ajax({
                url: options.url,
                method: 'POST',
                data: options.data,
                success: function (data, status, xhr) {
                    app.ui.handleAjaxSuccess(data, status, xhr);
                    window.location = options.downloadUrl + "?fileId=" + data.id + "&filename=" + data.fileName;
                },
                error: function (xhr, status, error) {
                    var message = app.ui.handleAjaxError(xhr, status, error);
                    showError(message);
                }, complete: function () {
                    uiState.busy('generate', false);
                }
            });
        }
    }
};
