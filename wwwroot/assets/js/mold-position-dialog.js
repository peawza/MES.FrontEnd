class MoldPositionDialog {
    constructor(settings) {
        /* 
         * options: {}
        */
        var _this = this;
        this.options = $.extend(true, {
            name: "#mold-position",
            controlPrefix: "mp",
            dataNotFound: (message) => { },
            error: (message) => { },
            services: {
                createPosition: "/mold/MoldRepairModify/createdetail",
                removePosition: "/mold/MoldRepairModify/removedetail",
                productModel: "/api/productModelImages"
            },
            actions: {
                close: function () {

                }
            }
        }, settings.options);

        // defect position dialog options.
        this.dialogOptions = $.extend(true, {
            visible: false,
            modal: {
                preventScroll: false
            },
            size: "large",
            title: 'Select Mold Position',
            animation: {
                open: {
                    effects: "fade:in"
                },
                close: {
                    effects: "fade:out"
                }
            }
        }, settings.dialogOptions);
        this.dialog = $(this.options.name).kendoDialog(this.dialogOptions).data("kendoDialog");

        this.sides = {
            T: "Top",
            L: "Left",
            R: "Right",
            F: "Front",
        };

        this.data = {};
    }

    _getControlName(name) {
        if (this.options.controlPrefix)
            return kendo.format("{0}-{1}", this.options.controlPrefix, name);
        return name;
    }

    _init() {
        var _this = this;
        if (this._isInit === true) { return; }
        this.controls = {
            moldPositionGrid: $("#" + this._getControlName("moldPositionGrid")).data("kendoGrid"),
            messageContainer: $("#" + this._getControlName("message-container")),
            imageSide: $("#" + this._getControlName("imageSide"))
        }

        this.dialog.bind("close", function (e) {
            var data = _this.controls.moldPositionGrid.dataSource.data().toJSON();
            _this.options.actions.close(data);

        });

        this.controls.moldPositionGrid
            .bind("dataBinding", (e) => {
                app.ui.initGridRowNo(e.sender);
            })
            .bind("dataBound", (e) => {
                var dataItems = e.sender.dataSource.data().toJSON();
                $.each(dataItems, (index, dataItem) => {
                    $(".matrix-box[data-x='" + dataItem.AxisX + "'][data-y='" + dataItem.AxisY + "']").addClass("matrix-box-main-defect");
                });
            });

        $(".matrix-box", this.dialog.wrapper).on("click", (e) => {
            e.preventDefault();
            var url = _this.options.services.createPosition;
            if ($(e.target).hasClass("matrix-box-main-defect")) {
                $(e.target).removeClass("matrix-box-main-defect");
                url = _this.options.services.removePosition;
            } else {
                $(e.target).addClass("matrix-box-main-defect");
            }

            var data = {
                Id: app.guid(),
                MoldSide: this.data.moldSide,
                MoldSideName: this.data.moldSideName,
                AxisX: $(e.target).data("x"),
                AxisY: $(e.target).data("y"),
                AxisZ: $(e.target).data("z"),
                IsPersistence: false,
                DataState: 1
            };

            if (url == _this.options.services.createPosition) {
                this.controls.moldPositionGrid.dataSource.add(data);
            }
            else {
                var dataItem = this.controls.moldPositionGrid.dataSource.data().find(x => x.AxisX == $(e.target).data("x") && x.AxisY == $(e.target).data("y"));
                this.controls.moldPositionGrid.dataSource.remove(dataItem);
            }

            this.clearMessage();
        });

        this._isInit = true;
    }

    showSuccess(message) {
        app.ui.showAlertSuccess(this.controls.messageContainer, message);
    }

    showError(message) {
        app.ui.showAlertError(this.controls.messageContainer, message);
    }

    clearMessage() {
        app.ui.clearAlert();
    }

    open(data) {
        this._init();
        $(".matrix-box").removeClass("matrix-box-main-defect");

        // data == undefined ===> data || {}  ==> data = {}; ==>  data = { close: function(){} }
        this.data = $.extend({
            modelGroup: '',
            moldSide: '',
            moldSideName: '',
            moldPositions: '',
            close: function () { }
        }, data || {});


        this.controls.moldPositionGrid.dataSource.data(this.data.moldPositions);

        this.controls.imageSide.prop("src", kendo.format("{0}/{1}/{2}", this.options.services.productModel, this.data.modelGroup, this.sides[this.data.moldSide] == undefined ? null : this.sides[this.data.moldSide]));
            //this.controls.moldPositionGrid.dataSource.read();

        this.options.actions.close = this.data.close;

        this.dialog.open();
    }

    _getCacheKey() {
        return $(this.options.name).data("cache-key");
    }

    getData() {
        return {};
    }
}
