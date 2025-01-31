var AppCheckBoxHelper = function (selector, key) {
    var selector = selector;
    var key = key;

    this.trigger = function (isChecked, cb) {
        var dataItems = [];
        if (isChecked) {
            $(selector).each((index,elem) => {               
                dataItems.push($(elem).val());
            });           
        }    
        app.ui.setCheckBox($(selector), isChecked);
        localStorage.setItem(key, kendo.stringify(dataItems));
        if (cb !== undefined) {
            cb({ items: dataItems, isChecked: isChecked });
        }
    };

    this.applyChange = function (cb) {
        $(selector).on("change", function (e) {
            var dataItems = JSON.parse(localStorage.getItem(key) || "[]");
            var value = this.value;
            dataItems = $.grep(dataItems, function (dataItem, index) {
                return dataItem !== value;
            });
            if (this.checked) {
                dataItems.push(this.value);
            }
            localStorage.setItem(key, kendo.stringify(dataItems));

            if (cb !== undefined) {
                cb({ items: dataItems, isChecked: this.checked });
            }
        });
    };

    this.updateUIState = function (cb) {
        var dataItems = JSON.parse(localStorage.getItem(key) || "[]");
        $(selector).each((index, elem) => {
            app.ui.setCheckBox($(elem), $.inArray($(elem).val(), dataItems) >= 0)
        });

        if (cb !== undefined) {
            cb(dataItems);
        }
    }

    this.getItem = function () {
        return JSON.parse(localStorage.getItem(key) || "[]");
    };

    this.clear = function () {
        localStorage.setItem(key, "[]");
        app.ui.setCheckBox($(selector), false);
    };
};