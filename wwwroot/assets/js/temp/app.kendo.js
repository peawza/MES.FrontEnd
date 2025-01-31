
(function ($, kendo) {
    $.extend(true, kendo.ui.validator, {
        rules: {
            mvcdate: function (input) {
                if (input.is("[data-val-date]") && input.val() !== "") {
                    var datePicker = input.data("kendoDatePicker");
                    var date = kendo.parseDate(input.val(), datePicker.options.format);
                    return date !== null;
                }
                return true;
            }
        },
        messages: {
            required: function (input) {
                if (input.is("[data-val-required]")) {
                    return input.data("val-required");
                }
                var field = input.data("field");
                if (field)
                    return kendo.format(app.messages.validators.required, field);
                return app.messages.validators.required;
            }
        }
    });
})(jQuery, kendo);