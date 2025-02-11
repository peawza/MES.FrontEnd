

let ip_hiden_Mode = $("#status-mode")
let text_mode = $("#text-mode");

let hidden_create_by = $("#hidden-create-by");

let hidden_create_date = $("#hidden-create-date-time");

let hidden_update_by = $("#hidden-update-by");
let hidden_update_date = $("#hidden-update-date-time");


//Input

let ip_process_code, ip_Process_name_en, ip_status
let arryDisableInputNoWorking = ["ip-item-group-name", "ip-status"]
window.addEventListener("load", async (event) => {
    //console.log("load !");
    $("#ip-process-code").kendoTextBox({

    });
    ip_process_code = $("#ip-process-code").data("kendoTextBox");
    $("#ip-Process-name-en").kendoTextBox({

    });
    ip_Process_name_en = $("#ip-Process-name-en").data("kendoTextBox");
    //$("#ip-process-name-th").kendoTextBox({

    //});
    //ip_process_name_th = $("#ip-process-name-th").data("kendoTextBox");
    $("#ip-status").kendoSwitch({
        //checked: true,
        //label: "Active",
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
        ip_process_code.enable(true);




    },
    edit: async (e, data) => {
        //console.log("Edit Data => ",data);
        await ui.Input.Clear("window-dialog");
        ip_process_code.enable(false);

        ip_hiden_Mode.val("edit");
        text_mode.html("Edit");
        await dialog_windows.setValue(data);

        window_dialog.open();





    },
    save: async (e) => {

        if (!validataDialog.validate()) {
            
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

                result = await APIPost("http://localhost:4443/api/production/master/pms020/insert", Send_DataApiSave);



            } else if (StatusMode == "edit") {

                result = await APIPost("http://localhost:4443/api/production/master/pms020/update", Send_DataApiSave);

                //add Update Index Data
            }

        } catch (e) {



        } finally {
            if (result.data.messageCode == "UpdateSuccess" || result.data.messageCode == "SaveSuccess") {
                await ui.Input.Clear("window-dialog");
                await serachData();

                showSuccess(Message("Information", "SaveSuccess"));
                validataDialog.reset()
                $("#window-dialog").data("kendoWindow").close();

            }

            else {
                //howSuccess(Message("Warning", "DataAlreadyExist"));
                messageDialog.error(Message("Warning", "DataAlreadyExist", ip_process_code.value() ), () => {
                    ip_process_code.focus()

                });
            }
        }



    },
    setValue: async (data) => {

        //console.log("Mode =>", ip_hiden_Mode.val(), data);
        if (ip_hiden_Mode.val() == "edit") {
            


            ip_process_code.value(data.processcode);
            ip_Process_name_en.value(data.processname);
            ip_status.value(data.isactive);


        } else {
            hidden_create_by.val("");
            hidden_create_date.val("");
            hidden_update_by.val("");
            hidden_update_date.val("");
            ip_status.value(1);
            //ip_status.value("");
        }


    },
    getValue: () => {


        return {
            processCode: ip_process_code.value(),
            processName: ip_Process_name_en.value(),
            isActive: ip_status.value(),
            updateBy: "system",
            createdBy: "system",

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
    }, Message("Confirm", "ConfirmExit"), "Confirmation");


}


function onSaveDialog(e) {

    if (!validataDialog.validate()) {
        
        return;
    }

    const TextConfirmation = Message("Confirm", "ConfirmSave")
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
    title: `Process Master Detail`,
    visible: false,
    modal: true,
    draggable: false,
    resizable: false,
    open: function () {
        this.center();


    }
});
//kendoWindow.title(`<i class="fas fa-database" style="padding-right:10px;"></i> Process Master Detail`);
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


