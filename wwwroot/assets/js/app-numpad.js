class AppNumpad
{
    constructor(container, target) {
        this.numpad = $(".k-numpad", container);
        this.numpad.on("click", function (e) {
            let value = $(this).data("value");
            if (value == "clear") { target.value(''); return true; }
            if (value == "backspace") {
                var v = (target.value() || '').toString();
                target.value(v.substr(0, v.length - 1));
                return true;
            }

            var v = (target.value() || '').toString() + value.toString();
            target.value(Math.min(target.max(), parseInt(v)));
            target.trigger("change");
        });
    }

    enable(enabled) {
        if (enabled)
            this.numpad.removeAttr("disabled").removeClass("k-state-disabled");
        else
            this.numpad.prop("disabled", true).addClass("k-state-disabled");
    }
}