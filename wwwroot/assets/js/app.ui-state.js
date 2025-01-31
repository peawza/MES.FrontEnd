/*
 * =====================================================================================
 * Write your JavaScript code.
 * =====================================================================================
 *  ui.register("search",".k-button");
 *  ui.register("search",[{ elem: ".k-button-search", busyContent: ""},{elem: ".k-button"}]);
 *  ui.register("search",[".k-button-search",".k-button"]);
 *  ==================================================================================== */
var AppUIState = function () {
    var uiStates = [];
    this.register = function (name, options) {

        for (var i = 0; i < uiStates.length; i++) {
            if (uiStates[i].name === name) {
                uiStates.splice(i, 1);
                break;
            }
        }

        if ($.isArray(options)) {
            var data = { 'name': name, 'targets': [] };
            $.each(options, function (i, item) {
                if (item.elem !== undefined) {
                    var selector = item.elem instanceof jQuery ? item.elem : $(item.elem);
                    data.targets.push({
                        'elem': selector,
                        'content': $(item.elem).html(),
                        'busyContent': item.busyContent
                    });
                } else {
                    var selector = item instanceof jQuery ? item : $(item);
                    data.targets.push({ 'elem': selector });
                }

            });
            uiStates.push(data);
        } else {
            var selector = item instanceof jQuery ? item : $(item);
            uiStates.push({
                'name': name,
                'targets': [{ 'elem': selector }]
            });
        }
    };
    this.clear = function () {
        uiStates = [];
    };

    this.busy = function (name, isBusy) {
        if (isBusy) {
            var ui = $.grep(uiStates, function (item, i) {
                return item.name === name;
            });

            $.each(ui, function (i, item) {
                $.each(item.targets, function (index, target) {
                    setTimeout(function () {
                        if (target.elem.hasClass("k-state-disabled") || target.elem.is("[disabled]")) { return; }
                        target.elem.attr('disabled', 'disabled').attr("ui-state-disabled", true).addClass('k-state-disabled');
                        if (target.busyContent !== undefined) {
                            target.elem.html(target.busyContent);
                        }
                    }, 100);
                });
            });
        } else {
            var ui = $.grep(uiStates, function (item, i) {
                return item.name === name;
            });

            $.each(ui, function (i, item) {
                $.each(item.targets, function (index, target) {
                    setTimeout(function () {
                        if (target.elem.is("[ui-state-disabled]")) {
                            target.elem.removeAttr('disabled').removeAttr("ui-state-disabled").removeClass('k-state-disabled');
                            if (target.content !== undefined) {
                                target.elem.html(target.content);
                            }
                        }
                    }, 100);
                });
            });
        }
    };
};
