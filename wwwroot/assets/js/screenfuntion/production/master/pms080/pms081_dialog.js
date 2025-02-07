﻿

let ip_hiden_Mode = $("#status-mode")
let text_mode = $("#text-mode");

let hidden_create_by = $("#hidden-create-by");

let hidden_create_date = $("#hidden-create-date-time");

let hidden_update_by = $("#hidden-update-by");
let hidden_update_date = $("#hidden-update-date-time");


//Input

let ip_ng_code, ip_ng_name, ip_status
let arryDisableInputNoWorking = ["ip-item-group-name", "ip-status"]
window.addEventListener("load", async (event) => {
    //console.log("load !");
    $("#ip-ng-code").kendoTextBox({

    });
    ip_ng_code = $("#ip-ng-code").data("kendoTextBox");
    $("#ip-ng-name").kendoTextBox({

    });
    ip_ng_name = $("#ip-ng-name").data("kendoTextBox");
    
    $("#ip-status").kendoSwitch({
    });

    ip_status = $("#ip-status").data("kendoSwitch");




});


let validataDialog = $("#window-dialog").kendoValidator(
    {
        messages: {
            required: function (input) {

                //return "Please input Start Test ."
            }

        }
        , validateOnBlur: false
    }
).data('kendoValidator');
let dialog_windows = {
    new: async (e, data) => {
        validataDialog.reset()
        await ui.Input.Clear("window-dialog");

        await dialog_windows.setValue(data);
        window_dialog.open();
        ip_hiden_Mode.val("new");
        text_mode.html("New");
        //ip_item_group_code.enable(true);





    },
    edit: async (e, data) => {
        //console.log("Edit Data => ",data);
        await ui.Input.Clear("window-dialog");
        ip_item_group_code.enable(false);

        ip_hiden_Mode.val("edit");
        text_mode.html("Edit");
        await dialog_windows.setValue(data);

        window_dialog.open();





    },
    save: async (e) => {

        if (!validataDialog.validate()) {
            //ui_loading.hide();
            //console.log("XXXXXX XXXXXXX");

            return;
        }

        let result
        try {
            //let dataSendAPI = dialog_windows.getValue();

            let StatusMode = $("#status-mode").val();



            let Send_DataApiSave = dialog_windows.getValue()

            if (StatusMode == "new") {
                //add Data
                //grid_inquire.addData({ pr: 2, pp: 5, codecut: 555 });

                console.log(dialog_windows.getValue());


                let Send_DataApiSave = dialog_windows.getValue()

                result = await APIPost("/api/master/mas030/insertitemgroup", Send_DataApiSave);



            } else if (StatusMode == "edit") {

                result = await APIPost("/api/master/mas030/updateitemgroup", Send_DataApiSave);

                //add Update Index Data
            }

        } catch (e) {



        } finally {
            if (result.MessageCode == "UpdateSuccess" || result.MessageCode == "SaveSuccess") {
                await ui.Input.Clear("window-dialog");
                await serachData();

                showSuccess(result.MessageName);
                validataDialog.reset()
                $("#window-dialog").data("kendoWindow").close();

            } else {
                messageDialog.error(format(result.MessageName, ip_item_group_code.value()), () => {
                    ip_item_group_code.focus()

                });
            }
        }



    },
    setValue: async (data) => {

        //console.log("Mode =>", ip_hiden_Mode.val(), data);
        if (ip_hiden_Mode.val() == "edit") {
            hidden_create_by.val(data.CreateBy);
            hidden_create_date.val(common.DateTime(data.CreateDateTime));
            hidden_update_by.val(data.UpdateBy);
            hidden_update_date.val(common.DateTime(data.UpdateDateTime));


            ip_item_group_code.value(data.ItemGroupCode);
            ip_item_group_name.value(data.ItemGroupName);
            ip_status.value(data.Status);


        } else {
            ip_status.value(true);
            //ip_status.value("");
        }


    },
    getValue: () => {
        return {
            NGCode: ip_ng_code.value(),
            NGName: ip_ng_name.value(),
            Status: Number(ip_status.value()),

        }
    }

}

function onCancelDialog(e) {
    var confirmationDialog = new ConfirmationDialog();
    confirmationDialog.open({
        yes: function () {
            validataDialog.reset()
            $("#window-dialog").data("kendoWindow").close();

        }
    }, Message("Confirmation", "ConfirmExitDialog"), "Confirmation");


}


function onSaveDialog(e) {

    if (!validataDialog.validate()) {
        
        return;
    }

    const TextConfirmation = Message("Confirmation", "ConfirmSave")
    var confirmationDialogShowDetails = new ConfirmationDialog("dialogshowdetails");
    confirmationDialogShowDetails.open({
        yes: function () {
            dialog_windows.save(e);
        }
    }, TextConfirmation, "Confirmation ");

}
var kendoWindow = $("#window-dialog").kendoWindow({
    width: "50%",
    /*height: '60%',*/
    title: Resources("PMS081","H001"),
    visible: false,
    modal: true,
    draggable: false,
    resizable: false,
    open: function () {
        this.center();


    }
});
//kendoWindow.title(`<i class="fas fa-database" style="padding-right:10px;"></i> ng Master Detail`);
// Wait for the window to initialize and then modify the title
setTimeout(function () {
    var titleElement = $("#window-dialog_wnd_title"); // Select the title element
    titleElement.prepend(' <i class="fas fa-database" style="padding: 5px;"></i>');
}, 100);
$("#window-dialog").data("kendoWindow").wrapper.append(`
            <div class="dropdown-divider m-0"></div>
            <div class="k-dialog-actions k-actions k-actions-horizontal k-actions-center ">
                <button type="button" id="windowsSaveButton" class="k-dark k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onclick="onSaveDialog()">
                    <span class="k-icon k-i-save k-button-icon"></span><span class="k-button-text" id="text-export">Save</span>
                </button>
                <button type="button" id="windowsCancalButton" class="  k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onclick="onCancelDialog()">
                    <span class="k-icon k-i-arrow-left k-button-icon"></span><span class="k-button-text">CANCEL</span>
                </button>
                
            </div>
        `);

let window_dialog = $("#window-dialog").data("kendoWindow");
$("#window-dialog").parent().find(".k-window-action").css("visibility", "hidden");


