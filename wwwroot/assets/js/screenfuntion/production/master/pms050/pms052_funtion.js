
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//#region Input


let sc_shift_pattern, sc_status
let dataShiftList = []
var state = [
    { text: "All", value: 'All' },
    { text: "Active", value: true },
    { text: "Inactive", value: false }
];
let statusWorkTime = [
    //{ text: "All", value: 'All' },
    { text: "Work period", textGrid: "Work", value: "W" },
    { text: "Break period", textGrid: "Break", value: "B" },
    { text: "Setup period", textGrid: "Setup", value: "S" }
];

function diffInMinutes(startTime, endTime) {
    // แปลงเวลาเป็นนาที
    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // ตรวจสอบว่าเวลาเดียวกันหรือไม่
    if (startMinutes === endMinutes) {
        return 1440; // 24 ชั่วโมง = 1440 นาที
    }

    // ตรวจสอบว่าต้องข้ามวันหรือไม่
    let diffMinutes;
    if (endMinutes >= startMinutes) {
        diffMinutes = endMinutes - startMinutes;
    } else {
        diffMinutes = (24 * 60 - startMinutes) + endMinutes;
    }

    return diffMinutes;
}

async function CreateUI() {
    $("#sc-shift-pattern").kendoDropDownList({
        dataTextField: "shiftName",
        dataValueField: "shiftCode",
        dataSource: dataShiftList,
        optionLabel: '- Select All  -'
    });
    sc_shift_pattern = $("#sc-shift-pattern").data("kendoDropDownList");


    //$("#sc-status").kendoDropDownList({
    //    dataTextField: "text",
    //    dataValueField: "value",
    //    dataSource: state,
    //    index: 1,

    //});

    //sc_status = $("#sc-status").data("kendoDropDownList");

    ui_loading = $("#ajax-notifications").kendoNotification({
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

}



//#endregion



//window.addEventListener("load", (event) => {
//    console.log("page is fully loaded");
//});


//  1

document.addEventListener("DOMContentLoaded", async (event) => {
    //console.log("DOMContentLoaded !");
    dataShiftList = common.APIPost("/api/product/getcomboshift", {})
    await CreateUI();


    await loadUIDialog();

    await serachData();
});


// 2
$(document).ready(async function () {

    //console.log(" document ready!");

    await grid_inquire.using([]);

});

// 3
window.addEventListener("load", async (event) => {
    //console.log("load !");


});

//document.addEventListener("readystatechange", (event) => {
//    console.log("readystatechange !");
//});


async function serachData() {



    //public string ? ReturnID { get; set; }
    //       public DateTime ? StartDate { get; set; }
    //       public DateTime ? ToDate { get; set; }

    //       public string ? CompanyReturnScrap { get; set; }

    let SendData = {
        //ListTransport: ListTranspot.value(),
        ShiftName: sc_shift_pattern.value(),
        // IsActiveString: sc_status.value(),


    };

    ui_loading.show({ message: app.messages.ajax.loading }, "progress");


    try {
        await app.ui.clearAlert("#message-container");
        let DataCallApi = await APIPost("/master/shiftpatterndetails/search", SendData);
        if (DataCallApi.length == 0) {
            Event.showWarning("Data Not Found");
            grid_inquire.using([]);
            app.ui.uiEnable(["#export-button"], false);
            return;
        }
        for (var i = 0; i < DataCallApi.length; i++) {
            let data_rows = DataCallApi[i]
            data_rows.No = i + 1;
            //data_rows.StockDate = kendo.toString(new Date(data_rows.StockDate), formatDatePicker);
            data_rows.CreateDate = data_rows.CreateDate !== null ? kendo.toString(new Date(data_rows.CreateDate), formatDatePicker) : "";
            data_rows.UpdateDate = data_rows.UpdateDate !== null ? kendo.toString(new Date(data_rows.UpdateDate), formatDatePicker) : "";

            //data_rows.WasteProcessorName = data_rows.Vendorid !== null ? dataWasteProcessor.find(item => item.WasteProcessorID === data_rows.Vendorid)?.WasteProcessorNameTH : "";
        }


        grid_inquire.using(DataCallApi);

        app.ui.uiEnable(["#export-button"], true);

        //console.log(DataCallApi);
        //ui_loading.hide();
    } catch (e) {
        app.ui.uiEnable(["#export-button"], false);
        console.log(e);
        // ui_loading.hide();
    } finally {
        ui_loading.hide();
    }

}

async function LoadDefault() {

    $("#message-container").css("display", "none");
    await ui.Input.Clear("search-container", () => {
        sc_status.value("true")
    });
    await app.ui.clearAlert("#message-container");
    app.ui.uiEnable(["#export-button"], false);
    await grid_inquire.using([]);
}



let grid_inquire = {
    grid_ID: "#grid-inquiry",
    using: async (DataApi) => {

        if ($(grid_inquire.grid_ID).data("kendoGrid") == undefined) {
            await grid_inquire.create(DataApi)
        } else {
            await grid_inquire.update(DataApi);
        }
    },
    create: async (DataApi) => {
        //console.log("AAAA");



        let dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    // On success.
                    //e.success([]);
                    e.success(DataApi);
                },
                destroy: function (e) {
                    // On success.
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
        let grid = $(grid_inquire.grid_ID).kendoGrid({
            dataSource: dataSource,
            pageable: {
                pageSizes: GridPageSizes(),

            },
            excel: {
                allPages: true
            }, excelExport: function (e) {
                GridExcelExport(e, "Miscellaneous")
            },
            toolbar: [
                setPagerInfoToToolbar(grid_inquire.grid_ID),
                { name: "search", text: Resources("COMMON", "ToolbarSearch") }
            ],
            scrollable: true,
            columns: [
                {
                    field: "No",
                    title: "No",
                    width: "60px", attributes: { class: "text-center " },
                    //template: dataItem => grid.dataSource.indexOf(dataItem) + 1
                },
                {
                    //field: "No",
                    title: "",
                    width: "130px", attributes: { class: "text-center " },
                    command: [

                        {
                            name: "editmode",
                            text: ``,
                            iconClass: "k-icon k-i-edit",
                            className: "k-button k-button-icontext btn-editmode btn-icon-grid",
                            visible: function (dataItem) { return permissions.AllowEdit && dataItem.CheckReject != 5 },
                            click: function (e) {
                                e.preventDefault();
                                var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                var data = this.dataItem(tr);
                                console.log("Click =>>>>>> ", data);
                                dialog_windows.edit(e, data);
                            },
                        },
                        {
                            className: "k-button k-button-icontext btn-delete k-danger"

                            , name: "remove", text: "", iconClass: "k-icon k-i-trash"
                            , visible: function (dataItem) { return permissions.AllowDelete && dataItem.CheckReject != 5 }
                            , click: async function (e) {
                                // prevent page scroll position change
                                e.preventDefault();
                                var tr = $(e.target).closest("tr"); // get the current table row (tr)
                                var data = await this.dataItem(tr);

                                let dataShiftCode = data.ShiftCode;
                                let dataPattern = data.Pattern;
                                const confirmationDialog = new ConfirmationDialog("dialogdelete");
                                confirmationDialog.open({
                                    yes: async function () {

                                        ui_loading.show({ message: app.messages.ajax.loading }, "progress");
                                        try {


                                            let ApiDelete = await APIPost("/master/shiftpatterndetails/delete", { ShiftCode: dataShiftCode, Pattern: dataPattern })
                                            var grid = $(grid_inquire.grid_ID).data("kendoGrid");
                                            grid.removeRow(tr);
                                            await grid.data('kendoGrid').refresh();



                                            // confirmationDialogDeleteOpen = 0;
                                        } catch (e) {
                                            //confirmationDialogDeleteOpen = 0;
                                        } finally {
                                            ui_loading.hide();
                                            //confirmationDialogDeleteOpen = 0;
                                        }

                                    }, no: async function () {
                                        // confirmationDialogDeleteOpen = 0;


                                    }





                                }, common.format("Are you sure you want to delete?"));
                                //, common.format("Confirm Delete CutTriesID : {0} ? ", data.CutTriesID));

                                //console.log(data.CutTriesID);
                                $(document).ready(function () {
                                    try {
                                        var Selector = document.querySelectorAll("#dialogdelete");
                                        for (let loop = 0; loop < Selector.length; loop++) {
                                            if (loop < (Selector.length - 1)) {
                                                Selector[loop].parentElement.remove()
                                            }
                                        }
                                    } catch (e) {

                                        console.log(e);

                                    }
                                });

                            }
                        },


                    ]

                },
                {
                    field: "ShiftName",
                    title: "Shift / Pattern Name",
                    width: "220px", attributes: { class: "k-text-center " }
                    //template: dataItem => grid.dataSource.indexOf(dataItem) + 1
                },
                {
                    field: "StartTime",
                    title: "Start Time",
                    width: "120px", attributes: { class: "text-center " },
                    template: (data) => {
                        if (data.StartTime !== null) {
                            return convertToHHMM(data.StartTime);
                        }
                        return "";
                    }
                },
                {
                    field: "EndTime",
                    title: "End Time",
                    width: "120px", attributes: { class: "text-center " },
                    template: (data) => {
                        if (data.EndTime !== null) {
                            return convertToHHMM(data.EndTime);
                        }
                        return "";
                    }
                },
                {
                    field: "DurationInMinutes",
                    title: "Duration (Min)",
                    width: "120px", attributes: { class: "text-center " }
                },
                {
                    field: "Description",
                    title: "Description",
                    width: "320px"//, attributes: { class: "text-center " },
                },
                {
                    field: "Type",
                    title: "Type Work",
                    width: "180px", attributes: { class: "text-center " },
                    template: function (data) {
                        if (data.Type !== null) {
                            let textDisplay = statusWorkTime.find(item => item.value === data.Type).textGrid;
                            //console.log(textDisplay);
                            //k-primary
                            if (data.Type == "W") {
                                return `<span class="badge badge-success fs-md">${textDisplay}</span>`;
                            } else if (data.Type == "S"){
                                return `<span class="badge badge-primary fs-md">${textDisplay}</span>`
                            }
                            else {

                                return `<span class="badge badge-warning fs-md">${textDisplay}</span>`
                            }
                        }
                        return "";
                    }
                },
                { field: "CreateBy", title: "Create By", headerAttributes: { class: "k-text-center !k-justify-content-center" }, attributes: { style: "text-align: left" } },
                { field: "CreateDate", title: "Create Date", headerAttributes: { class: "k-text-center !k-justify-content-center" }, attributes: { style: "text-align: center" } },
                { field: "UpdateBy", title: "Upadate By", headerAttributes: { class: "k-text-center !k-justify-content-center" }, attributes: { style: "text-align: left" } },
                { field: "UpdateDate", title: "Update Date", headerAttributes: { class: "k-text-center !k-justify-content-center" }, attributes: { style: "text-align: center" } }






            ],
            dataBound: function (e) {
                var preferedHeight = Math.round($(window).height() - $(grid_inquire.grid_ID).position().top) - 120;
                let grid = $(grid_inquire.grid_ID).data('kendoGrid');
                if (preferedHeight < 300) {
                    preferedHeight = 540;
                }
                app.ui.toggleVScrollable(grid, { height: preferedHeight });
                movePagerInfoToToolbar(grid_inquire.grid_ID)
                //console.log(preferedHeight);

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