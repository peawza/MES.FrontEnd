
var date = new Date(), y = date.getFullYear(), m = date.getMonth();
var firstDay = new Date(y, m, 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
//#region Input


let sc_shift_name, sc_status
var state = [
    { text: "All", value: 'All' },
    { text: "Active", value: true },
    { text: "Inactive", value: false }
];

async function CreateUI() {
    $("#sc-shift").kendoTextBox({});
    sc_shift_name = $("#sc-shift").data("kendoTextBox");


    $("#sc-status").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: state,
        index: 1,

    });

    sc_status = $("#sc-status").data("kendoDropDownList");

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
        ShiftName: sc_shift_name.value(),
        IsActiveString: sc_status.value(),


    };

    ui_loading.show({ message: app.messages.ajax.loading }, "progress");


    try {
        await app.ui.clearAlert("#message-container");
        let DataCallApi = await APIPost("/master/shiftpattern/search", SendData);
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
                    field: "Process Code",
                    title: "ProcessCode",
                    attributes: { class: "k-text-right" },
                    width: "250px"
                },
                {
                    field: "ProcessNameTH",
                    title: "Process Name TH",
                    attributes: { class: "k-text-left" },
                    width: "200px"
                },
                {
                    field: "ProcessNameEN",
                    title: "Process Name EN",
                    attributes: { class: "k-text-left" },
                    width: "200px"
                },
                {
                    field: "Status",
                    title: "Status",
                    attributes: { class: "k-text-left" },
                    width: "250px"
                }
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