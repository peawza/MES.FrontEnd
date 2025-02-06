﻿
let ip_hiden_Mode = $("#status-mode")
let ip_hiden_Pattern = $("#ip-pattern")
let ip_shift_code, ip_shift_type, ip_start_time, ip_end_time, ip_description;






let arryDisableInputNoWorking = []
async function loadUIDialog() {

    $("#ip-shift-code").kendoDropDownList({
        dataTextField: "shiftName",
        dataValueField: "shiftCode",
        dataSource: dataShiftList,
        optionLabel: '- Select -'
    });
    ip_shift_code = $("#ip-shift-code").data("kendoDropDownList");

    $("#ip-shift-type").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: statusWorkTime,
        optionLabel: '- Select  -'

    });
    ip_shift_type = $("#ip-shift-type").data("kendoDropDownList");

    $("#ip-start-time").kendoTimePicker({
        adaptiveMode: "auto",
        componentType: "modern"
    });
    ip_start_time = $("#ip-start-time").data("kendoTimePicker");
    ui.TimePickerClick("#ip-start-time");


    $("#ip-end-time").kendoTimePicker({
        adaptiveMode: "auto",
        componentType: "modern"
    });
    ip_end_time = $("#ip-end-time").data("kendoTimePicker");
    ui.TimePickerClick("#ip-end-time");



    $("#ip-description").kendoTextArea({
        rows: 3,
    });
    ip_description = $("#ip-description").data("kendoTextArea");

}

let validataDialog = $("#window-dialog").kendoValidator(
    {
        //validationSummary: true,
        messages: {
            required: function (input) {

                //return "Please input Start Test ."
            },
            custom: "Please enter valid value for my custom rule",
        }, rules: {
            custom: function (input) {
                if (input.is("[name=ip-cut-stock]")) {
                    return input.val() === true;
                }
                return true;
            }
        }

        , validateOnBlur: false
    }
).data('kendoValidator');

let dialog_windows = {
    new: async (e, data) => {
        validataDialog.reset()
        ui.display("windowsSaveButton");
        await ui.Input.Clear("window-dialog", () => {
            ip_description.value("");
            ip_start_time.value("");
            ip_end_time.value("");
            //ip_return_date.value(new Date());
        });
        ip_hiden_Mode.val("new");
        ui.Input.DisableCondition("window-dialog", true, arryDisableInputNoWorking)

        // dialog_windows.checkWorkFlow("new", null);
        ip_shift_code.enable(true);
        window_dialog.open();
    },
    edit: async (e, data) => {
        ui.display("windowsSaveButton");

        await ui.Input.Clear("window-dialog", () => {
            ip_description.value("");
            ip_start_time.value("");
            ip_end_time.value("");
            //ip_return_date.value(new Date());
        });
        ip_hiden_Mode.val("edit");
        await ui.Input.DisableCondition("window-dialog", true, arryDisableInputNoWorking)
        await dialog_windows.setValue(data);
        ip_shift_code.enable(false);
        window_dialog.open();


    },
    view: async (e, data) => {
        ui.hiden("windowsSaveButton");
        //ui.hiden("validate-stock-type");
        await ui.Input.Clear("window-dialog", () => {
            //ip_description.value("");
            //ip_start_time.value("");
            //ip_end_time.value("");
            //ip_return_date.value(new Date());
        });
        // ui.Input.DisableCondition("window-dialog", false, arryDisableInputNoWorking)
        await dialog_windows.setValue(data);
        //ip_section.enable(false);
        ui.Input.DisableCondition("window-dialog", false, arryDisableInputNoWorking)

        //dialog_windows.checkWorkFlow("view", null);
        window_dialog.open();
    },
    save: async (e) => {
        ui_loading.show({ message: app.messages.ajax.loading }, "progress");
        let StatusMode = $("#status-mode").val();


        if (!validataDialog.validate()) {
            ui_loading.hide();
            return;
        }




        let result = null
        try {
            //let StatusModel = $("#status-mode").val();
            //console.log(dialog_windows.getValue());

            // DisplayName = dataWasteProcessorTransportor.find(item => item.WasteProcessorID === data.ProcessorID).WasteProcessorNameTH;

            let Send_DataApiSave = dialog_windows.getValue()
            //let dataProcessorAndWasteTransport = dataWasteProcessorTransportor.find(item => item.WasteTransportorID === "WT001")

            result = await APIPost("/master/shiftpatterndetails/save", Send_DataApiSave);
            //console.log("result =>>>>  ", result.StockID);
            //ip_StockID.val(result.StockID)
            await serachData();



        } catch (e) {
            console.log("Erorr", e);

        } finally {
            await ui.Input.Clear("window-dialog");
            ui_loading.hide();
            $("#window-dialog").data("kendoWindow").close();
        }

        return result

    },
    getValue: () => {


        return {
            Mode: ip_hiden_Mode.val(),
            Pattern: ip_hiden_Pattern.val(),
            ShiftCode: ip_shift_code.value(),
            Type: ip_shift_type.value(),
            StartTime: kendo.toString(new Date(ip_start_time.value()), "HH:mm:ss"),
            EndTime: kendo.toString(new Date(ip_end_time.value()), "HH:mm:ss"),
            DurationInMinutes: diffInMinutes(kendo.toString(new Date(ip_start_time.value()), "HH:mm:ss"), kendo.toString(new Date(ip_end_time.value()), "HH:mm:ss")),
            Description: ip_description.value(),

        }


    },
    setValue: async (data) => {
        console.log(data);
        // let result_API_User = await APIPost("/api/getuserinfo", { username: data.CreateBy });
        // dropdown_Section_update("ip-section", result_API_User.sectionsList)
        //ip_shift_code.value(data.NGCode);
        //ip_ng_type_name.value(data.NGName);
        ip_hiden_Pattern.val(data.Pattern);
        ip_shift_code.value(data.ShiftCode);
        ip_shift_type.value(data.Type);
        ip_start_time.value(data.StartTime);
        ip_end_time.value(data.EndTime);
        ip_description.value(data.Description);
        //if (data.IsActive == true) {

        //    document.getElementById("ip-active").checked = true;
        //} else {
        //    document.getElementById("ip-active").checked = false;


        //}


        // ip_StockID.val(data.StockID);
        // ip_Status.val(data.Status);
        // ip_stock_date.value(data.StockDate);
        // ip_qty.value(data.Qty);
        // ip_scrap_id.value(data.ScrapID);
        // ip_reason.value(data.Reason);
        // if (data.StockType == "CUT") {
        //     document.getElementById("ip-cut-stock").checked = true;
        // } else if (data.StockType == "ADD") {
        //     document.getElementById("ip-add-stock").checked = true;
        // }

        // ip_create_by.value(data.CreateBy)
        // ip_plan_date.value(data.CreateDate)
        // ip_phone_number.value(data.Tel)
        // ip_section.value(data.Section)

        // //ip_remark.value(data.Remark)+
        // ip_Status.val(data.nextSeq)
        //// console.log(data);
        // text_status.html(data.HTMLStatus);
    },




}





$("#windowsCancalButton").kendoButton({
    click: function () {
        //ui.Input.Clear("window-export-from-input");
        validataDialog.reset()
        $("#window-dialog").data("kendoWindow").close();

    }
});

$("#windowsSaveButton").kendoButton({
    click: async function (e) {


        const TextConfirmation = "Are you sure you want to save data?"
        var confirmationDialogShowDetails = new ConfirmationDialog("dialogshowdetails");
        confirmationDialogShowDetails.open({
            yes: function () {
                dialog_windows.save(e);
            }
        }, TextConfirmation, "Confirmation ");

    }
});

$("#window-dialog").kendoWindow({
    width: "40%",
    //height: '300px',
    title: "Shift / Pattern Detail Maintenance",
    visible: false,
    modal: true,
    draggable: false,
    resizable: false,
    //actions: [
    //    "Close"
    //],
    open: function () {
        this.center();
    }
});

let window_dialog = $("#window-dialog").data("kendoWindow");
$("#window-dialog").parent().find(".k-window-action").css("visibility", "hidden");



