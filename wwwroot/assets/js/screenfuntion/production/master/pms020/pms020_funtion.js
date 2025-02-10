let ScreenCode = "STS050"
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m , 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


// Input  Search
let sc_process_code, sc_process_name, sc_status;


// DataAPI
//let dataGetBUItemCombo, dataAdjustmentStatus, dataGetBusinessUnitCombo;
let dataStatus  = null;

document.addEventListener("DOMContentLoaded", async (event) => {
    
    

    await CreateUI();
    await grid_inquire.using([]);
    //[
    //    dataStatus,
    //    dataGetBUItemCombo,
    //    dataGetBusinessUnitCombo,
    //    dataGetAdjustmentType
    //] = await Promise.all([
    //    APIPost("/api/common/getmisc", { MiscTypeCode: "AdjustmentStatus", Status: "0,1" }),
    //    APIPost("/api/common/getbuitemcombo", { Item: null }),
    //    APIPost("/api/common/getbusinessunitcombo", { Origi_Dest: "O" }),
    //    APIPost("/api/common/getmisc", { MiscTypeCode: "AdjustmentType", Status: "0,1" }),
    //]);
    //sc_adjustment_status.setDataSource(dataAdjustmentStatus);
    //sc_bu_item_code.setDataSource(dataGetBUItemCombo);
    //sc_business_unit.setDataSource(dataGetBusinessUnitCombo);
    //ip_details_select_adjustment_type.setDataSource(dataGetAdjustmentType);
});
async function CreateUI() {
    $("#sc-process-code").kendoTextBox({

    });
    sc_process_code = $("#sc-process-code").data("kendoTextBox");
    $("#sc-process-name").kendoTextBox({

    });
    sc_process_name = $("#sc-process-name").data("kendoTextBox");
  

    $("#sc-status").kendoDropDownList({
        dataSource: dataStatus,
        filter: "contains",
        //minLength: 1,
        dataTextField: "DisplayName",
        dataValueField: "MiscCode"
        , optionLabel: Resources("COMMON","DropDownAll"),
    });
    sc_status = $("#sc-status").data("kendoDropDownList");
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
        sc_adjustment_date_from.value(firstDay);
        sc_adjustment_date_to.value(lastDay);
        sc_posting_date_from.value(firstDay);
        sc_posting_date_to.value(lastDay);
    });
    await app.ui.clearAlert("#message-container");
    app.ui.uiEnable(["#export-button"], false);
    await grid_inquire.using([]);
}
async function serachData() {

   

    let SendData = {
        "ProcessCode": sc_process_code.value(),
        "ProcessName": sc_process_name.value(),
        "IsActive": sc_status.value()
    };


    try {
        //let DataCallApi = await APIPost("http://localhost:4443/api/production/master/pms020/search", SendData);



        //APIGet("http://localhost:4443/api/production/master/WeatherForecast", null);
        //APIGet("http://localhost:5001/messystem/getresources", null);
        //http://localhost:6301/
        let DataCallApi = await APIPost("http://localhost:4443/api/production/master/pms020/search", SendData);
        //let DataCallApi = [];
        //console.log(DataCallApi);
        await app.ui.clearAlert("#message-container");

        if (DataCallApi.data.length == 0) {
            Event.showWarning(Message("Warning", "DataNotFound"));
            grid_inquire.using([]);
            app.ui.uiEnable(["#export-button"], false);
            return;
        }
        grid_inquire.using(DataCallApi.data);

        app.ui.uiEnable(["#export-button"], true);
    } catch (e) {
        //console.log(e);
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
                GridExcelExport(e, "Process_Master")
            },
            toolbar: [
                setPagerInfoToToolbar(grid_inquire.grid_ID),
                { name: "search", text: Resources("COMMON", "ToolbarSearch") }
            ],
            columns: [
                {

                    title: Resources("PMS020","GD001"),
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

                                let dataProcesscode = data.Processcode;
                                const confirmationDialog = new ConfirmationDialog("dialogdelete");
                                confirmationDialog.open({
                                    yes: async function () {

                                         
                                        try {


                                            let ApiDelete = await APIPost("http://localhost:4443/api/production/master/pms020/delete",{
                                                "ProcessCode": dataProcesscode,
                                                "deleteby": "system"

                                            })
                                            console.log(ApiDelete);

                                            if (ApiDelete.StatusCode == "Ok") {
                                                console.log("AAAA");
                                                showSuccess(Message("Information", "DeleteSuccess"));
                                                var grid = $(grid_inquire.grid_ID).data("kendoGrid");
                                                grid.removeRow(tr);
                                                await grid.data('kendoGrid').refresh();

                                                
                                            }

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

                    field: "Processcode",
                    title: Resources("PMS020", "GD002"),
                    attributes: { class: "k-text-right" },
                    width: "250px"
                },
                //{
                //    field: "ProcessNameTH",
                //    title: Resources("PMS020", "GD003"),
                //    attributes: { class: "k-text-left" },
                //    width: "200px"
                //},
                {
                    field: "Processname",
                    title: Resources("PMS020", "GD004"),
                    attributes: { class: "k-text-left" },
                    width: "200px"
                },
                {
                    field: "Isactive",
                    title: Resources("PMS020", "GD005"),
                    attributes: { class: "k-text-left" },
                    width: "180px",
                    filterable: kendo_grid.filter.filter_Active,
                    template: (data) => {

                        return kendo_grid.template.Active_Inactive(data.Isactive)

                    }
                },
                {
                    field: "Createby",
                    title: Resources("PMS020", "GD006"),
                    attributes: { class: "text-left " },
                    width: "200px"
                    //template: dataItem => grid.dataSource.indexOf(dataItem) + 1
                },

                {
                    field: "Createdate",
                    title: Resources("PMS020", "GD007"),
                    attributes: { class: "text-center " },
                    width: "160px",
                    template: (data) => {
                        if (data.Createdate != null) {
                            return kendo.toString(new Date(data.Createdate), formatDateTimePicker)
                        }
                        return "";
                    },
                    format: `{0:${formatDateTimePicker}}`,
                    filterable: false
                },

                {
                    
                    field: "Updateby",
                    title: Resources("PMS020", "GD008"),
                    attributes: { class: "text-left " },
                    width: "200px"
                },
                {
                    field: "Updatedate",
                    title: Resources("PMS020", "GD009"),
                    attributes: { class: "text-center " },
                    width: "160px",
                    template: (data) => {
                        if (data.Updatedate != null) {
                            return kendo.toString(new Date(data.Updatedate), formatDateTimePicker)
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
                movePagerInfoToToolbar(grid_inquire.grid_ID);

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