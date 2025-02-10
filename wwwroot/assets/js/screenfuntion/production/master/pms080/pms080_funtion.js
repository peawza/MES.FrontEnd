let ScreenCode = "STS050"
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m , 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


// Input  Search
let sc_ng_code, sc_ng_name, sc_status;


// DataAPI
//let dataGetBUItemCombo, dataAdjustmentStatus, dataGetBusinessUnitCombo;
let dataStatus  = null;

document.addEventListener("DOMContentLoaded", async (event) => {
    
    

    await CreateUI();
    await grid_inquire.using([]);
   
});
async function CreateUI() {
    $("#sc-ng-code").kendoTextBox({

    });
    sc_ng_code = $("#sc-ng-code").data("kendoTextBox");
    $("#sc-ng-name").kendoTextBox({

    });
    sc_ng_name = $("#sc-ng-name").data("kendoTextBox");
  

    $("#sc-status").kendoDropDownList({
        dataSource: dataStatus,
        filter: "contains",
        //minLength: 1,
        dataTextField: "DisplayName",
        dataValueField: "MiscCode"
        , optionLabel: Resources("COMMON","DropDownAll"),
    });
    sc_adjustment_status = $("#sc-status").data("kendoDropDownList");
}

// 2
$(document).ready(async function () {



    await LoadDefault();
});

// 3
window.addEventListener("load", (event) => {

});



async function LoadDefault() {

    $("#message-container").css("display", "none");
    await ui.Input.Clear("search-container", () => {
       
    });
    await app.ui.clearAlert("#message-container");
    app.ui.uiEnable(["#export-button"], false);
    await grid_inquire.using([]);
}
async function serachData() {

   

    let SendData = {
       
    };


    try {
        //let DataCallApi = await APIPost("/api/transaction/sts050/searchtransfer", SendData);
        let DataCallApi = [];
        await app.ui.clearAlert("#message-container");

        if (DataCallApi.ResultHeader.length == 0) {
            Event.showWarning(Message("Warning", "DataNotFound"));
            grid_inquire.using([]);
            app.ui.uiEnable(["#export-button"], false);
            return;
        }
        grid_inquire.using(DataCallApi);

        app.ui.uiEnable(["#export-button"], true);
    } catch (e) {

        // 
    } finally {

    }

}
var record_details = 0;

let grid_inquire = {
    grid_ID: "#grid-inquiry",
    using: async (DataApi) => {
        if ($(grid_inquire.grid_ID).data("kendoGrid") == undefined) {
            await grid_inquire.create(DataApi)
        } else {
            await grid_inquire.update(DataApi);
        }
    },
    create: (DataApi) => {
  
        let dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(DataApi);
                },
                destroy: function (e) {
                    e.success();
                },
                create: function (e) {
                    // On success.
                    e.success();
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return {
                            models: kendo.stringify(options.models)
                        };
                    }
                }
            },
            page: 1,
            pageSize: GridPageSizeDefault(),

        });

       // var record = 0;
        let grid = $(grid_inquire.grid_ID).kendoGrid({
            dataSource: dataSource,
            pageable: {
                pageSizes: GridPageSizes(),

            },
            filterable: GridFillterable(),
            sortable: true,
            reorderable: true,
            excel: {
                allPages: true
            }, excelExport: function (e) {
                GridExcelExport(e, "Miscellaneous")
            },
            toolbar: [
                setPagerInfoToToolbar(grid_inquire.grid_ID),
                { name: "search", text: Resources("COMMON", "ToolbarSearch") }
            ],
            columns: [
                {

                    title: Resources("PMS080","GD001"),
                    width: "60px", attributes: { class: "k-text-center " },
                    headerAttributes: { "data-no-reorder": "true" },
                    template: dataItem => grid.dataSource.indexOf(dataItem) + 1
                },
                {
                    width: "160px", attributes: { class: "k-text-center " },
                    command: [
                        {
                            name: "editmode",
                            text: `<span class='k-icon k-i-edit'></span>`,
                            className: "k-button k-button-icontext btn-editmode ",
                            visible: function (dataItem) { return permissions.AllowEdit },
                            click: function (e) {
                                e.preventDefault();
                                var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                var data = this.dataItem(tr);
                                //console.log(data);
                                dialog_windows.edit(e, data);
                            },
                        },
                        {
                            className: "btn-delete-grid btn-remove k-danger "

                            , name: "remove", text: "", iconClass: "k-icon k-i-trash"
                            , visible: function (dataItem) { return permissions.AllowDelete }
                            , click: async function (e) {
                                // prevent page scroll position change
                                e.preventDefault();
                                var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                var data = await this.dataItem(tr);

                                let dataTransportID = data.TransportID;
                                const confirmationDialog = new ConfirmationDialog("dialogdelete");
                                confirmationDialog.open({
                                    yes: async function () {

                                         
                                        try {


                                            let ApiDelete = await APIPost("/smartwastesystem/sws100/deletetransportplan", { TransportID: dataTransportID })
                                            var grid = $(grid_inquire.grid_ID).data("kendoGrid");
                                            grid.removeRow(tr);
                                            await grid.data('kendoGrid').refresh();



                                            // confirmationDialogDeleteOpen = 0;
                                        } catch (e) {
                                            //confirmationDialogDeleteOpen = 0;
                                        } finally {
                                            
                                            //confirmationDialogDeleteOpen = 0;
                                        }

                                    }, no: async function () {
                                        // confirmationDialogDeleteOpen = 0;


                                    }





                                }, common.format(Message("Confirm", "ConfirmDelete")));
                                $(document).ready(function () {
                                    try {
                                        var Selector = document.querySelectorAll("#dialogdelete");
                                        for (let loop = 0; loop < Selector.length; loop++) {
                                            if (loop < (Selector.length - 1)) {
                                                Selector[loop].parentElement.remove()
                                            }
                                        }
                                    } catch (e) {

                                    }
                                });

                            }
                        }]

                },

                {

                    field: "ProcessCode",
                    title: Resources("PMS080", "GD002"),
                    attributes: { class: "k-text-right" },
                    width: "250px"
                },
                //{
                //    field: "ProcessNameTH",
                //    title: Resources("PMS080", "GD003"),
                //    attributes: { class: "k-text-left" },
                //    width: "200px"
                //},
                {
                    field: "ProcessNameEN",
                    title: Resources("PMS080", "GD003"),
                    attributes: { class: "k-text-left" },
                    width: "200px"
                },
                {
                    field: "Status",
                    title: Resources("PMS080", "GD004"),
                    attributes: { class: "k-text-left" },
                    width: "180px",
                    filterable: kendo_grid.filter.filter_true_false
                },
                {
                    field: "CreateBy",
                    title: Resources("PMS080", "GD005"),
                    attributes: { class: "text-left " },
                    width: "200px"
                    //template: dataItem => grid.dataSource.indexOf(dataItem) + 1
                },

                {
                    field: "CreateDateTime",
                    title: Resources("PMS080", "GD006"),
                    attributes: { class: "text-center " },
                    width: "160px",
                    template: (data) => {
                        if (data.CreateDateTime != null) {
                            return kendo.toString(new Date(data.CreateDateTime), formatDateTimePicker)
                        }
                        return "";
                    },
                    filterable: false
                },

                {
                    
                    field: "UpdateBy",
                    title: Resources("PMS080", "GD007"),
                    attributes: { class: "text-left " },
                    width: "200px"
                },
                {
                    field: "UpdateDateTime",
                    title: Resources("PMS080", "GD008"),
                    attributes: { class: "text-center " },
                    width: "160px",
                    template: (data) => {
                        if (data.UpdateDateTime != null) {
                            return kendo.toString(new Date(data.UpdateDateTime), formatDateTimePicker)
                        }
                        return "";
                    },
                    format: `{0:${formatDateTimePicker}}`,
                    filterable: false
                },

            ],
            dataBound: function (e) {
                var preferedHeight = Math.round($(window).height() - $(grid_inquire.grid_ID).position().top) - 200;
                let grid = $(grid_inquire.grid_ID).data('kendoGrid');
                if (preferedHeight < 240) {
                    preferedHeight = 540;
                }
                app.ui.toggleVScrollable(grid, { height: preferedHeight });
                movePagerInfoToToolbar(grid_inquire.grid_ID)
            },
            noRecords: kendo_grid.noRecords

        }).data("kendoGrid");
    },
    update: (DataApi) => {
        let dataSource = new kendo.data.DataSource({
            data: DataApi,
            pageSize: GridPageSizeDefault()
        });
        $(grid_inquire.grid_ID).data("kendoGrid").setDataSource(dataSource);


    },
}