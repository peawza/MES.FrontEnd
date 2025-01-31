class ProductDefectAndScrapDialog {
    constructor(settings) {
        var _this = this;
        this.options = $.extend(true, {
            name: "#product-defect-and-scrap",
            services: {
                productMovement: "/api/common/productMovements/defectandscrap/productQRCode/",
                productMovement2: "/api/common/productMovements/defectandscrap/castingNo/",
                create: "/common/productdefectandscrap/create",
                update: "/common/productdefectandscrap/update"
            },
            messages: {
                confirmDelete: "Are you sure you want to delete?",
                confirmRepairComplete: "Are you sure you want to repair complete?",
                confirmScrap: "Are you sure you want to scrap?",
                confirmSave: "Are you sure you want to save?",
                confirmCancelRepairComplete: "Are you sure you want to cancel repair complete?",
                confirmCancelScrap: "Are you sure you want to cancel scrap?",
            },
            scannerDialog: {},
            defectPositionDialog: {},
            save: (data) => { },
            saving: (data) => { },
            error: (message) => { },
            loadCompleted: (data) => {},
            readonly: false,
            autoSave: false,
        }, settings.options);

        // Product Defect and Scrap dialog options.
        this.dialogOptions = $.extend(true, {
            visible: false,
            modal: {
                preventScroll: false
            },
            size: "large",
            title: 'Product Defect and Scrap',
            animation: {
                open: {
                    effects: "fade:in"
                },
                close: {
                    effects: "fade:out"
                }
            },
            minHeight: 400,
        }, settings.dialogOptions);
        this.dialog = $(this.options.name).kendoDialog(this.dialogOptions).data("kendoDialog");

        // keep user data from open methid.
        this.data = {};
        this.isNew = true;
        this.productStatuses = {};

        this._isInit = false;
    }

    _getControlName(name) {
        var prefix = $(this.options.name, this.dialog.wrapper).data("control-prefix");
        return kendo.format("{0}-{1}", prefix, name);
    }

    _init() {
        var _this = this;
        if (this._isInit === true) { return; }
        this.productStatuses = JSON.parse($("#" + this._getControlName("productStatuses")).val());
        this.controls = {
            messageContainer: $("#" + this._getControlName("message-container")),
            defectContainer: $("#" + this._getControlName("defect-container")),
            repairCompleteContainer: $("#" + this._getControlName("repair-complete-container")),
            scrapContainer: $("#" + this._getControlName("scrap-container")),
            // Header
            productQRCode: $("#" + this._getControlName("productQRCode")).data("kendoAutoComplete"),
            castingNo: $("#" + this._getControlName("castingNo")),
            scanButton: $("#" + this._getControlName("productQRCodeScanButton")).data("kendoButton"),
            process: $("#" + this._getControlName("process")).data("kendoDropDownList"),
            modelGroup: $("#" + this._getControlName("modelGroup")).data("kendoTextBox"),
            productType: $("#" + this._getControlName("productType")),
            productTypeName: $("#" + this._getControlName("productTypeName")).data("kendoTextBox"),
            productStatus: $("#" + this._getControlName("productStatus")),
            productStatusName: $("#" + this._getControlName("productStatusName")).data("kendoTextBox"),
            team: $("#" + this._getControlName("team")).data("kendoDropDownList"),
            bench: $("#" + this._getControlName("bench")).data("kendoDropDownList"),
            remark: $("#" + this._getControlName("remark")).data("kendoTextArea"),
            // Detail
            defectPositionButton: $("#" + this._getControlName("defectPositionButton")).data("kendoButton"),
            detailGrid: $("#" + this._getControlName("detailGrid")).data("kendoGrid"),
            // Repair
            repairCompleteButton: $("#" + this._getControlName("repairCompleteButton")).data("kendoButton"),
            repairCode: $("#" + this._getControlName("repairCode")).data("kendoDropDownList"),
            repairDetails: $("#" + this._getControlName("repairDetails")).data("kendoTextArea"),
            repairDate: $("#" + this._getControlName("repairDate")).data("kendoDatePicker"),
            repairBy: $("#" + this._getControlName("repairBy")).data("kendoDropDownList"),
            informedRepairDate: $("#" + this._getControlName("informedRepairDate")).data("kendoTextBox"),
            informedRepairBy: $("#" + this._getControlName("informedRepairBy")).data("kendoTextBox"),
            // Scrap
            scrapButton: $("#" + this._getControlName("scrapButton")).data("kendoButton"),
            scrapReasonCode: $("#" + this._getControlName("scrapReasonCode")).data("kendoDropDownList"),
            scrapDetails: $("#" + this._getControlName("scrapDetails")).data("kendoTextArea"),
            informedScrapDate: $("#" + this._getControlName("informedScrapDate")).data("kendoDatePicker"),
            informedScrapBy: $("#" + this._getControlName("informedScrapBy")).data("kendoDropDownList"),
            issueDateTime: $("#" + this._getControlName("issueDateTime")).data("kendoTextBox"),
            issueBy: $("#" + this._getControlName("issueBy")).data("kendoTextBox"),

            saveButton: $("#" + this._getControlName("saveButton")).data("kendoButton"),
            cancelButton: $("#" + this._getControlName("cancelButton")).data("kendoButton"),
        }

        this.controls.detailGrid.hideColumn(1); // View Column
        this.controls.detailGrid
            .bind("dataBinding", (e) => {
                app.ui.initGridRowNo(e.sender);
            })
            .bind("dataBound", (e) => {
                app.ui.gridDeleteConfirmDialog(e.sender, { content: _this.options.messages.confirmDelete });
            });

        this.controls.detailGrid.dataSource
            .bind("requestEnd", (e) => {
                if (e.type == 'destroy') {
                    var defectId = _this.data.Defect.DefectId || 0;
                    e.sender.read({ id: defectId, cacheKey: _this._getCacheKey() });
                }
            }).bind("error", (e) => {
                var template = kendo.template($("#error-template").html());
                var options = {
                    read: (message) => { _this._showError(template(res)); },
                };
                app.ui.handleDataSourceError(e, options);
            });

        this.controls.productStatus.on("change", (e) => {
            var v = $(e.target).val();
            switch (v)
            {
                case this.productStatuses.NG.value:
                    this._clearRepair();
                    this._clearScrap();
                    this.enableScrap(false);
                    this.enableRepairComplete(false);
                    break;
                case this.productStatuses.OKRepairCompleted.value:
                    this.enableRepairComplete(true);
                    this.enableScrap(false);
                    this._clearScrap();
                    break;
                case this.productStatuses.Scrap.value:
                    this.enableScrap(true);
                    this.enableRepairComplete(false);
                    this._clearRepair();
                    break;
            }
        });

        // defectPositionButton
        this.controls.defectPositionButton.bind("click", (e) => {
            var castingNo = _this.data.Defect !== undefined ? _this.data.Defect.CastingNo : this.controls.castingNo.val();
            _this.options.defectPositionDialog.options.autoSave = false;
            _this.options.defectPositionDialog.open({
                userData: {
                    ModelGroup: _this.controls.modelGroup.value(),
                    Module: _this.controls.process.value(),                   
                    DefectDetails: _this.controls.detailGrid.dataSource.data().toJSON(),
                    CastingNo: castingNo
                },
                options: {
                    ModuleLocked: false,
                    save: (saveData) => {
                        // reutrn { data: { castingNo: '', module: '', defectDetails: [], sid: '', ruleName: '' }, result: {} }
                        // Update detail grid datasource.
                        this.controls.detailGrid.dataSource.data(saveData.data.defectDetails);
                        
                        // calculate status
                        var currentStatus = { name: this.controls.productStatusName.value(), value: this.controls.productStatus.val() };
                        var dataItems = this.controls.detailGrid.dataSource.view().toJSON();
                        var special = $.grep(dataItems, (dataItem, index) => {
                            return dataItem.SpecialFlag === true;
                        });

                        if (special.length > 0) {
                            currentStatus = _this.productStatuses.OKRepairCompleted;
                        } else {
                            var ngDataItems = $.grep(dataItems, (dataItem, index) => {
                                return dataItem.RepairCompleteFlag === false;
                            });

                            if (ngDataItems.length == 0) {
                                currentStatus = _this.productStatuses.OKRepairCompleted;
                            } else {
                                currentStatus = _this.productStatuses.NG;
                            }
                        }
                      
                        if (currentStatus.value !== this.controls.productStatus.val()) {
                            this.controls.productStatus.val(currentStatus.value);
                            this.controls.productStatus.trigger("change");
                            this.controls.productStatusName.value(currentStatus.name);
                        }
                    }
                }
            });
        });

        var allowRepairResult = $(this.options.name).data("allow-repair-result");
        if (allowRepairResult) {
            // repairCompleteButton
            this.controls.repairCompleteButton.bind("click", (e) => {
                var currentStatus = _this.controls.productStatus.val();
                if (currentStatus == this.productStatuses.OKRepairCompleted.value) {
                    app.ui.confirmDialog({ content: _this.options.messages.confirmCancelRepairComplete }).result.done(() => {
                        // Set NG
                        _this.controls.productStatus.val(_this.productStatuses.NG.value);
                        _this.controls.productStatus.trigger("change");
                        _this.controls.productStatusName.value(_this.productStatuses.NG.name);
                    });
                    
                } else {
                    // try to change state to repair complete
                    app.ui.confirmDialog({ content: _this.options.messages.confirmRepairComplete }).result.done(() => {
                        // Set OK/Repair Complete
                        _this.controls.productStatus.val(_this.productStatuses.OKRepairCompleted.value);
                        _this.controls.productStatus.trigger("change");
                        _this.controls.productStatusName.value(_this.productStatuses.OKRepairCompleted.name);
                    });
                }
            });
        }

        // scrapButton
        this.controls.scrapButton.bind("click", (e) => {
            var currentStatus = _this.controls.productStatus.val();
            if (currentStatus == this.productStatuses.Scrap.value) {
                app.ui.confirmDialog({ content: _this.options.messages.confirmCancelScrap }).result.done(() => {
                    // Cancel Scrap
                    _this.controls.productStatus.val(_this.productStatuses.NG.value);
                    _this.controls.productStatus.trigger("change");
                    _this.controls.productStatusName.value(_this.productStatuses.NG.name);
                });                
            } else {
                app.ui.confirmDialog({ content: _this.options.messages.confirmScrap }).result.done(() => {                    
                    // Set Scrap
                    _this.controls.productStatus.val(_this.productStatuses.Scrap.value);
                    _this.controls.productStatus.trigger("change");
                    _this.controls.productStatusName.value(_this.productStatuses.Scrap.name);
                });
            }
        });
        // scanButton
        this.controls.scanButton.bind("click", (e) => {
            _this.options.scannerDialog.open({
                success: function (data) {
                    _this.controls.productQRCode.value(data.code);
                    _this.controls.productQRCode.trigger("change");
                }
            });
        });

        // Validator
        this.validator = this.controls.defectContainer.kendoValidator({
            rules: {
                required: function (input) {
                    if (input.is("[data-required]")) {
                        return $.trim(input.val()) !== '';
                    }
                    return true;
                }
            },
            messages: {
                required: function (input) {
                    return input.data("required");
                }
            },
            validateOnBlur: false
        }).data("kendoValidator");

        this.repairValidator = this.controls.repairCompleteContainer.kendoValidator({
            rules: {
                required: function (input) {
                    if (input.is("[data-repair-required]")) {
                        return $.trim(input.val()) !== '';
                    }
                    return true;
                }
            },
            messages: {
                required: function (input) {
                    return input.data("repair-required");
                }
            },
            validateOnBlur: false
        }).data("kendoValidator");

        this.scrapValidator = this.controls.scrapContainer.kendoValidator({
            rules: {
                required: function (input) {
                    if (input.is("[data-scrap-required]")) {
                        return $.trim(input.val()) !== '';
                    }
                    return true;
                }
            },
            messages: {
                required: function (input) {
                    return input.data("scrap-required");
                }
            },
            validateOnBlur: false
        }).data("kendoValidator");

        this.controls.productQRCode.bind("change", (e) => {
            var w = [_this.controls.defectPositionButton, _this.controls.team, _this.controls.bench, _this.controls.saveButton, _this.controls.cancelButton];
            app.ui.uiEnable(w, true);
            if (e.sender.value() === '' && this.isNew === true) {
                this._clearDefect();
            } else {
                // find data in product movement.  
                var request = {
                    url: _this.options.services.productMovement,
                    data: {
                        productQRCode: e.sender.value(), isNew: this.isNew
                    }
                };

                if (e.sender.value() === '')
                {
                    request.url = _this.options.services.productMovement2;
                    request.data = { castingNo: _this.controls.castingNo.val(), isNew: this.isNew };
                }

                // Reset defect data.
                e.sender.element.removeAttr("data-value");
                _this.clear();
                _this.enableRepairComplete(false);
                _this.enableScrap(false);
                _this.data.Defect = {};
                // ensure display repair complete/ scrap
                //_this.controls.repairCompleteContainer.show();
                //_this.controls.scrapContainer.show();

                $.post({
                    url: request.url,
                    data: request.data,
                    success: function (data, status, xhr) {
                        app.ui.uiEnable(w, data.success);
                        _this._readonlyGridDetail(!data.success);
                        if (data.data != undefined) {
                            if (data.success === false) {
                                _this._showWarning(data.message);
                            } else {
                                var dataItem = data.data;
                                var currentProductStatus = dataItem.CurrentProductStatus;
                                _this.options.loadCompleted(dataItem);
                               
                                _this.controls.process.value(dataItem.CurrentModule);
                                _this.controls.process.enable(_this.data.options.ModuleLocked == false);
                                _this.controls.modelGroup.value(dataItem.CurrentModelGroup);
                                _this.controls.productTypeName.value(dataItem.CurrentProductTypeName);
                                _this.controls.productType.val(dataItem.CurrentProductType);
                                _this.controls.productStatusName.value(dataItem.CurrentProductStatusName);
                                _this.controls.productStatus.val(dataItem.CurrentProductStatus);
                                _this.controls.productStatus.attr("data-original", dataItem.CurrentProductStatus);
                                _this.controls.castingNo.val(dataItem.CastingNo);
                                _this.controls.team.value(dataItem.Team || '');
                                _this.controls.bench.value(dataItem.MachineNo || '');

                                e.sender.element.attr("data-value", dataItem.ProductQRCode);
                                // Load product defect.
                                if (dataItem.Defect && dataItem.Defect.DefectId) {
                                    _this._displayDefect(dataItem.Defect);
                                    _this.controls.saveButton.enable(true);
                                } else {
                                    // No defect data => hide repair complete.
                                    //_this.controls.repairCompleteContainer.hide();
                                    if (dataItem.CurrentProductStatus === _this.productStatuses.OKRepairCompleted.value) {
                                        // Repair Section
                                        _this.controls.repairCode.value('');
                                        _this.controls.repairDetails.value('');
                                        _this.controls.repairDate.value(new Date());
                                        _this.controls.repairBy.value(_this.controls.repairBy.element.data("default"));
                                        _this.enableRepairComplete(true);
                                        _this.controls.saveButton.enable(true);
                                    }
                                }

                                if (dataItem.CurrentProductStatus !== currentProductStatus) {
                                    _this.controls.productStatus.trigger("change");
                                }
                            }
                        } else {
                            // disabled save action.
                            _this.data.options.error(data.message);
                            _this.controls.saveButton.enable(false);
                            _this._showWarning(data.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        app.ui.uiEnable(w, false);                        
                        var message = app.ui.handleAjaxError(xhr, status, error);
                        _this._showError(message);
                    }
                });
            }
        });


        // scrapButton
        this.controls.saveButton.bind("click", (e) => {
            var isValid = this.validator.validate();
            // Validate repair complete
            if (isValid === true && this.controls.productStatus.val() === this.productStatuses.OKRepairCompleted.value) {
                isValid = this.repairValidator.validate();
            }

            // Validate scrap
            if (isValid === true && this.controls.productStatus.val() === this.productStatuses.Scrap.value) {
                isValid = this.repairValidator.validate();
            }

            if (isValid === true) {
                app.ui.confirmDialog({ content: this.options.messages.confirmSave }).result.done(() => {
                    var isNew = (this.data.Defect.DefectId || 0) == 0;
                    var dataToSave = this._getData();
                    this.data.options.saving(dataToSave);
                    if (this.data.options.autoSave === true) {
                        var url = isNew === true ? this.options.services.create : this.options.services.update;
                        // find data in product movement.            
                        $.post({
                            url: url,
                            data: dataToSave,
                            async: false,
                            success: function (data, status, xhr) {
                                _this._showSuccess(data.message);
                                // data = { key: int , message: string }
                                _this.data.options.save({ data: dataToSave, result: data, autoSave: true });
                                _this.dialog.close();
                            },
                            error: function (xhr, status, error) {
                                var message = app.ui.handleAjaxError(xhr, status, error);
                                // Raise error callback.
                                _this._showError(message);
                            }
                        });
                    } else {
                        _this.data.options.save({ data: dataToSave, result: { message: "save successfully" }, autoSave: false });
                        _this.dialog.close();
                    }
                });
            }
        });

        // scrapButton
        this.controls.cancelButton.bind("click", (e) => {
            this.dialog.close();
        });
        this._isInit = true;
    }

    _readonlyGridDetail(readonly) {
        if (readonly === true) {
            this.controls.detailGrid.showColumn(1); // Delete Column
        } else {
            this.controls.detailGrid.hideColumn(1); // Delete Column
        }
    }

    open(data) {
        this.data = $.extend(true, {
            userData: {
                ProductQRCode: '',
                CastingNo: '',
                Defect: {}
            },
            options: {
                error: (message) => this.options.error(message),
                save: (data) => this.options.save(data),
                saving: (data) => this.options.saving(data),
                readonly: this.options.readonly,
                autoSave: this.options.autoSave,
                ModuleLocked: true
            }
        }, data || {});

        this._init();
        this.dialog.open();

        this.data.userData.ProductQRCode = this.data.userData.ProductQRCode || ''
        this.isNew = this.data.userData.ProductQRCode == '' && this.data.userData.CastingNo == '';
        this.controls.productQRCode.value(this.data.userData.ProductQRCode);
        this.controls.productQRCode.enable(this.isNew);
        this.controls.scanButton.enable(this.isNew);

        this.enableRepairComplete(false);
        this.enableScrap(false);
        this.clear();
        if (this.isNew) {
            this.data.options.ModuleLocked = false;
            // Hide Repair complete seciton.
            //this.controls.repairCompleteContainer.hide();
        } else {
            //this.controls.repairCompleteContainer.show();
            // keep storage casting no from arguments.
            this.controls.castingNo.val(this.data.userData.CastingNo);
            this.controls.productQRCode.trigger("change");
        }
    }

    enableRepairComplete(enable) {
        app.ui.uiEnable([this.controls.repairCode, this.controls.repairDetails, this.controls.repairDate, this.controls.repairBy], enable);
    }

    enableScrap(enable) {
        app.ui.uiEnable([this.controls.scrapReasonCode, this.controls.scrapDetails, this.controls.informedScrapDate, this.controls.informedScrapBy], enable);
    }

    clear() {
        this._clearMessage();
        this._clearDefect();
        this._clearRepair();
        this._clearScrap();
    }

    _clearDefect() {
        app.ui.clear([this.controls.process, this.controls.modelGroup, this.controls.productTypeName,
            this.controls.productStatus, this.controls.productStatusName, this.controls.team, this.controls.bench]);
        this.controls.detailGrid.dataSource.data([]);
        this.controls.castingNo.val('');
        this.controls.productType.val('');
        this.data.Defect = {};
    }

    _clearRepair() {
        app.ui.clear([this.controls.repairCode, this.controls.repairDetails,
        this.controls.repairDate, this.controls.repairBy, this.controls.informedRepairDate,
        this.controls.informedRepairBy]);
    }

    _clearScrap() {
        app.ui.clear([this.controls.scrapReasonCode, this.controls.scrapDetails, this.controls.informedScrapDate,
        this.controls.informedScrapBy, this.controls.issueDateTime, this.controls.issueBy]);
    }

    _displayDefect(data) {

        this.data.Defect = data;
        // setting casting no from defect data
        this.controls.castingNo.val(data.CastingNo);
        // Has data in Defect header > data state allow to input repair complete.
        this.controls.remark.value(data.Remark);

        if (data.Status === this.productStatuses.OKRepairCompleted.value) {
            // Repair Section
            this.controls.repairCode.value(data.RepairCode);
            this.controls.repairDetails.value(data.RepairDetails);
            this.controls.repairDate.value(data.RepairDate || new Date());
            this.controls.repairBy.value(data.RepairBy || this.controls.repairBy.element.data("default"));
            this.controls.informedRepairDate.value(kendo.format("{0:dd/MM/yyyy}", kendo.parseDate(data.InformedRepairDate)||''));
            this.controls.informedRepairBy.value(data.InformedRepairBy);
            this.enableRepairComplete(true);
        }

        // Scrap Section
        if (data.ScrapFlag == true) {
            this.controls.scrapReasonCode.value(data.ScrapReasonCode);
            this.controls.scrapDetails.value(data.ScrapDetails);
            this.controls.informedScrapDate.value(data.InformedScrapDate || new Date());
            this.controls.informedScrapBy.value(data.InformedScrapBy || this.controls.informedScrapBy.element.data("default"));
            this.controls.issueDateTime.value(kendo.format("{0:dd/MM/yyyy}", kendo.parseDate(data.IssueDateTime)||''));
            this.controls.issueBy.value(data.IssueBy);
            this.enableScrap(true);
        }
        this.controls.detailGrid.dataSource.read({ id: data.DefectId });
    }

    _getData() {
        var allowRepairResult = $(this.options.name).data("allow-repair-result");
        var repairCode = allowRepairResult == true ? this.controls.repairCode.dataItem() : { RepairCode: '', RepairName: '' };
        var scrapReasonCode = this.controls.scrapReasonCode.dataItem();

        var defect = $.extend(this.data.Defect, {
            ProductQRCode: this.controls.productQRCode.value(),
            CastingNo: this.controls.castingNo.val(),
            CurrentModule: this.controls.process.value(),
            ModelGroup: this.controls.modelGroup.value(),
            ProductType: this.controls.productType.val(),
            
            Team: this.controls.team.value(),
            Bench: this.controls.bench.value(),
            Remark: this.controls.remark.value(),

            RepairCode: repairCode.RepairCode,
            RepairName: repairCode.RepairCode == "" ? "" : repairCode.RepairName,
            RepairDetails: allowRepairResult == true ? this.controls.repairDetails.value() : null,
            RepairDate: allowRepairResult == true ? app.data.toDateString(this.controls.repairDate.value()) : null,
            RepairBy: allowRepairResult == true ? this.controls.repairBy.value() : null,

            ScrapReasonCode: scrapReasonCode.ScrapReasonCode,
            ScrapReasonName: scrapReasonCode.ScrapReasonCode == "" ? "" : scrapReasonCode.ScrapReasonName,
            ScrapDetails: this.controls.scrapDetails.value(),
            InformedScrapDate: app.data.toDateString(this.controls.informedScrapDate.value()),
            InformedScrapBy: this.controls.informedScrapBy.value(),

            OriginalStatus: this.controls.productStatus.attr("data-original"),
            Status: this.controls.productStatus.val(),
            ScrapFlag: this.controls.productStatus.val() == this.productStatuses.Scrap.value
        });

        return {
            "defect": defect,
            "defectDetails": this.controls.detailGrid.dataSource.data().toJSON(),
        }
    }

    _showSuccess(message) {
        app.ui.showAlertSuccess(this.controls.messageContainer, message);
    }

    _showWarning(message) {
        app.ui.showAlertWarning(this.controls.messageContainer, message);
    }

    _showError(message) {
        this.data.options.error(message);
        app.ui.showAlertError(this.controls.messageContainer, message);
    }

    _clearMessage() {
        app.ui.clearAlert(this.controls.messageContainer);
    }
}

var ProductDefectAndScrapHelper = {
    renderRepairComplete: (data) => {
        return data.RepairCompleteFlag === true ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>';
    },
    renderSpecial: (data) => {
        return data.SpecialFlag === true ? '<i class="fas fa-check-circle text-success"></i>' : '';
    },
    renderMainDefect: (data) => {
        return data.MainDefectFlag === true ? '<i class="fas fa-check-circle text-success"></i>' : '';
    },
    renderAxis: (data) => {
        return kendo.format("{0},{1},{2}", data.AxisX, data.AxisY, data.AxisZ);
    }
}
