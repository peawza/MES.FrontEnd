(function ($, kendo) {
    $.extend(true, kendo.ui.validator, {
        rules: {
            required: function (input) {
                if (input.is("[data-val-required]") || input.is("[required]")) {
                    return $.trim(input.val()) !== "";
                }
                return true;
            },
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

$(function () {

    'use strict';

    $('.js-menu-toggle').click(function (e) {
        var $this = $(this);
        if ($('body').hasClass('show-sidebar')) {
            $('body').removeClass('show-sidebar');
            $this.removeClass('active');
        } else {
            $('body').addClass('show-sidebar');
            $this.addClass('active');
        }
        e.preventDefault();
    });

    document.querySelector('.sidebar-2').addEventListener('mouseleave', function () {
        setTimeout(function () {

            const openDropdowns = document.querySelectorAll('.sidebar-2 .collapse.show');
            openDropdowns.forEach(function (dropdown) {
                dropdown.classList.remove('show');
                dropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            });


            this.scrollTop = 0;
        }, 300);
    });


    if (typeof ($.scrollUp) !== "undefined") {
        $.scrollUp({
            scrollName: 'scroll-up',
            animationSpeed: '600',
            scrollText: '<i class="fas fa-4x fa-chevron-circle-up"></i>',
            scrollTitle: "Scroll to top."
        });
    }
});