var ui = {
    setContent: function (id, data) {
        if (data != null && data != "") {
            document.getElementById(id).innerHTML = data;
        } else {
            document.getElementById(id).innerHTML = " - ";
        }
    },
    DateTimePickerClick: function (ID) {
        $(ID).click(function () {
            $(ID).data("kendoDateTimePicker").open();
        });
    }
    , DatePickerClick: function (ID) {
        $(ID).click(function () {
            $(ID).data("kendoDatePicker").open();
        });
    }, Input: {
        Readonly: async function (Selector, enable, condition) {

            const from = await document.getElementById(Selector);
            var TagInput = await from.getElementsByTagName('input');
            TagInput.forEach(input => {
                if (condition.includes(input.getAttribute("id")) == true) {
                    //console.log(input.getAttribute("data-role"));
                    //console.log(condition.includes(input.getAttribute("id")) == true);
                } else if (input.getAttribute("data-role") === "dropdownlist") {
                    $("#" + input.getAttribute("id")).data("kendoDropDownList").readonly(enable);
                }
                else if (input.getAttribute("data-role") === "textbox") {
                    $("#" + input.getAttribute("id")).data("kendoTextBox").readonly(enable);
                }
                else if (input.getAttribute("data-role") === "numerictextbox") {
                    $("#" + input.getAttribute("id")).data("kendoNumericTextBox").readonly(enable);

                }
                else if (input.getAttribute("data-role") === "datepicker") {
                    $("#" + input.getAttribute("id")).data("kendoDatePicker").readonly(enable);
                }
                else if (input.getAttribute("data-role") === "datetimepicker") {
                    $("#" + input.getAttribute("id")).data("kendoDateTimePicker").readonly(enable);
                } else if (input.getAttribute("data-role") === "timepicker") {
                    $("#" + input.getAttribute("id")).data("kendoTimePicker").readonly(enable);
                }
                else if (input.getAttribute("type") === "checkbox") {
                    if (enable) {
                        document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                    } else {
                        document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                    }
                } else if (input.getAttribute("type") === "radio") {
                    if (enable) {
                        document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                    } else {
                        document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                    }
                }
            });
        },
        Disable: async function (Selector, enable, condition) {
            const from = await document.getElementById(Selector);
            var TagInput = await from.getElementsByTagName('input');
            TagInput.forEach(input => {
                if (condition.includes(input.getAttribute("id")) == true) {
                    //console.log(input.getAttribute("data-role"));
                    //console.log(condition.includes(input.getAttribute("id")) == true);
                }
                else if (input.getAttribute("data-role") === "dropdownlist") {
                    $("#" + input.getAttribute("id")).data("kendoDropDownList").enable(enable);
                }
                else if (input.getAttribute("data-role") === "textbox") {
                    $("#" + input.getAttribute("id")).data("kendoTextBox").enable(enable);

                }
                else if (input.getAttribute("data-role") === "numerictextbox") {
                    $("#" + input.getAttribute("id")).data("kendoNumericTextBox").enable(enable);

                } else if (input.getAttribute("data-role") === "upload") {
                    $("#" + input.getAttribute("id")).data("kendoUpload").enable(enable);
                }
                else if (input.getAttribute("data-role") === "datepicker") {
                    $("#" + input.getAttribute("id")).data("kendoDatePicker").enable(enable);
                }
                else if (input.getAttribute("data-role") === "timepicker") {
                    $("#" + input.getAttribute("id")).data("kendoTimePicker").enable(enable);
                }
                else if (input.getAttribute("data-role") === "datetimepicker") {
                    $("#" + input.getAttribute("id")).data("kendoDateTimePicker").enable(enable);
                } else if (input.getAttribute("type") === "checkbox") {
                    if (!enable) {
                        document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                    } else {
                        document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                    }

                } else if (input.getAttribute("type") === "radio") {
                    if (!enable) {
                        document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                    } else {
                        document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                    }

                }
            });

            var TagInputTextarea = await from.getElementsByTagName('textarea');
            Textarea = ["remark-approve", "remark-reject", "remark-submit"];
            TagInputTextarea.forEach(input => {
                if (Textarea.includes(input.id)) {

                } else {
                    $("#" + input.id).data('kendoTextArea').enable(enable);
                }

            })
        },
        ViewMode: async function (Selector, enable) {
            //console.log("ViewMode");
            $(document).ready(async function () {
                const from = await document.getElementById(Selector);
                var TagInput = await from.getElementsByTagName('input');

                //console.log(TagInput);
                TagInput.forEach(input => {
                    if (input.getAttribute("data-role") === "dropdownlist") {
                        $("#" + input.getAttribute("id")).data("kendoDropDownList").enable(enable);
                    }
                    else if (input.getAttribute("data-role") === "textbox") {
                        $("#" + input.getAttribute("id")).data("kendoTextBox").enable(enable);
                    }
                    else if (input.getAttribute("data-role") === "numerictextbox") {
                        $("#" + input.getAttribute("id")).data("kendoNumericTextBox").enable(enable);

                    }
                    else if (input.getAttribute("data-role") === "upload") {
                        $("#" + input.getAttribute("id")).data("kendoUpload").enable(enable);
                    }
                    else if (input.getAttribute("data-role") === "datepicker") {
                        $("#" + input.getAttribute("id")).data("kendoDatePicker").enable(enable);
                    }
                    else if (input.getAttribute("data-role") === "datetimepicker") {
                        $("#" + input.getAttribute("id")).data("kendoDateTimePicker").enable(enable);
                    }
                    else if (input.getAttribute("data-role") === "timepicker") {
                        $("#" + input.getAttribute("id")).data("kendoTimePicker").enable(enable);
                    }
                    else if (input.getAttribute("type") === "checkbox") {
                        if (enable) {
                            document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                        } else {
                            document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                        }
                    } else if (input.getAttribute("type") === "radio") {
                        if (enable) {
                            document.getElementById(input.getAttribute("id")).removeAttribute("disabled", "false");
                        } else {

                            document.getElementById(input.getAttribute("id")).setAttribute("disabled", "true");
                        }
                    }
                });
                var TagInputTextarea = await from.getElementsByTagName('textarea');
                Textarea = ["remark-approve", "remark-reject", "remark-submit"];
                TagInputTextarea.forEach(input => {
                    if (Textarea.includes(input.id)) {

                    } else {
                        $("#" + input.id).data('kendoTextArea').enable(enable);
                    }
                })



                $(document).ready(async function () {
                    $(".k-grid-add-data").each(function (e) {
                        $(this).addClass('k-state-disabled')

                    });

                    $(".k-grid-edit").each(function (e) {
                        $(this).addClass('k-state-disabled')
                    });

                    $(".k-grid-delete").each(function (e) {
                        $(this).addClass('k-state-disabled')
                    });

                    //
                    $(".view-mode").each(function (e) {
                        $(this).addClass('k-state-disabled')
                    });
                    $(".view-mode-check-new").each(function (e) {
                        if (permissions.AllowNew == false) {
                            $(this).addClass('k-state-disabled')
                        }

                    });

                    $(".grid-view-mode").each(function (e) {
                        $(this).addClass('grid-state-disabled')
                    });
                });
            });
        }
        , Clear: async function (Selector, arrowFunction) {


            try {
                const from = await document.getElementById(Selector);
                var TagInput = await from.getElementsByTagName('input');
                var textArea = await from.getElementsByTagName('textarea');
                let IdClearData = [];
                TagInput.forEach(input => {
                    IdClearData.push("#" + input.getAttribute("id"));
                });
                textArea.forEach(input => {
                    IdClearData.push("#" + input.getAttribute("id"));
                });
                await app.ui.clear(IdClearData);
                // $(document).ready(async function () {


                if (arrowFunction != null) {
                    arrowFunction()
                }
            } catch (e) {

            }




            // });
        },
    }, click: function (id) {
        document.getElementById(id).click();
    }, display: function (id) {
        document.getElementById(id).style.display = "inline-flex";
    },
    hiden: function hiden(id) {
        document.getElementById(id).style.display = "none";
    }, displayText: {
        date: (date) => {
            let result = null
            try {
                if (date != null) {
                    //console.log("Grid DateTime ", date);
                    result = kendo.toString(kendo.parseDate(date, 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yy')



                    if (result == null) {
                        result = kendo.toString(date, 'dd-MMM-yy HH:mm')
                    }
                    // return kendo.toString(kendo.parseDate(Date.parse(date), 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yyyy HH:mm')



                } else {
                    result = ""
                }



            } catch (e) {



                result = ""
            }



            return result

        }
    }
}

var common = {
    APIPost: function (url, data) {
        var result;
        $.ajax({
            url: url, // Url of backend (can be python, php, etc..)
            type: "POST", // data type (can be get, post, put, delete)
            data: data, // data in json format
            async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
            //beforeSend: function () {
            //    document.getElementById('LoadingAjax').style.display = "block"
            //},
            success: function (response, status, xhr) {
                try {
                    //console.log("status call Data", xhr);
                    //if (xhr.status == 204) {
                    //    console.log("status call Data 204", xhr.status);
                    //} else {

                    //}
                    if (response != null) {
                        result = response
                    } else {
                        result = null
                    }
                } catch (e) {
                    console.log(e);
                    result = null;
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message = jqXHR.responseJSON.message;
                result = message;
            }
        });
        return result;
    },
    APIGet: function (url, data) {
        var result;
        $.ajax({
            url: url, // Url of backend (can be python, php, etc..)
            type: "GET", // data type (can be get, post, put, delete)
            data: data, // data in json format
            async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
            //beforeSend: function () {
            //    document.getElementById('LoadingAjax').style.display = "block"
            //},
            success: function (response) {
                try {
                    if (response != null) {
                        result = response
                    } else {
                        result = null
                    }
                } catch (e) {
                    result = null
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                result = null
            }
        });
        return result;
    },
    UpdateGrid: function (gridId, Data) {
        var dataSource = new kendo.data.DataSource({
            data: Data
        });
        var grid = $("#" + gridId).data("kendoGrid");
        grid.setDataSource(dataSource);
    },
    DisplayElement: function (id) {
        document.getElementById(id).style.display = "block";
    },
    HidenElement: function (id) {
        document.getElementById(id).style.display = "none";
    },
    Encode: function (data) {
        try {
            if (data == null) return null;
            return btoa(data);
        }
        catch {
            return null;
        }
    },
    Decode: function (data) {
        try {

            if (data == null) return null;
            return atob(data)
        }
        catch {
            return null;
        }
    },
    format: function format(str, col) {

        try {


            col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

            return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                if (m == "{{") { return "{"; }
                if (m == "}}") { return "}"; }
                return col[n];
            });


        } catch (e) {
            return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                if (m == "{{") { return "{"; }
                if (m == "}}") { return "}"; }
                return "";
            });
        }

    }, SetFormatsNumber: function (Number) {
        try {
            return Number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch (ex) {
            return "";
        }
    }
    , condition: (text) => {
        try {
            //console.log("condition :: ",text);
            return (eval(text))
        } catch (e) {
            return false
        }

    }
    , Boolean(string) {
        return (string.toLowerCase() === 'true')
    }, TimeRemoveSeconds: (date) => {
        //console.log(date);
        if (date == null || date == "") { return null }
        var Time = new Date(date);
        Time.setSeconds(0, 0)

        return Time;
    },
    NumberHtml: (data, digi) => {
        try {
            if (data == null) {
                return "&nbsp;"
            }
            return (Number(data)).toFixed(digi);
        } catch (e) {
            console.log("Error Data E =>", e, "data", data, "digi", digi);
            return "&nbsp;"
        }

    }, Date: (date) => {

        let result = null
        try {
            if (date != null) {
                //console.log("Grid DateTime ", date);
                result = kendo.toString(kendo.parseDate(date, 'yyyy-MM-ddTHH:mm:ss'), formatDateTimePicker)

                if (result == null) {
                    result = kendo.toString(date, formatDateTimePicker)
                }
                // return kendo.toString(kendo.parseDate(Date.parse(date), 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yyyy HH:mm')

            } else {
                result = ""
            }

        } catch (e) {

            result = ""
        }

        return result

    }, DateTime: (date) => {

        let result = null
        try {
            if (date != null) {
                //console.log("Grid DateTime ", date);
                result = kendo.toString(kendo.parseDate(date, 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yy HH:mm:ss')

                if (result == null) {
                    result = kendo.toString(date, 'dd-MMM-HH:mm:ss')
                }
                // return kendo.toString(kendo.parseDate(Date.parse(date), 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yyyy HH:mm')

            } else {
                result = ""
            }

        } catch (e) {

            result = ""
        }

        return result

    },
    Time: (date) => {

        let result = null
        try {
            if (date != null) {
                //console.log("Grid DateTime ", date);
                result = kendo.toString(kendo.parseDate(date, 'yyyy-MM-ddTHH:mm:ss'), 'HH:mm')

                if (result == null) {
                    result = kendo.toString(date, 'HH:mm')
                }
                // return kendo.toString(kendo.parseDate(Date.parse(date), 'yyyy-MM-ddTHH:mm:ss'), 'dd-MMM-yyyy HH:mm')

            } else {
                result = ""
            }

        } catch (e) {

            result = ""
        }

        return result

    },

}


var Service = {

    closeLockScreen: function (ID) {
        data = common.APIGet("/api/common/apicommonclearopenby", { InspectID: ID });
    },




}






var pdf = {
    text: (text) => {
        try {
            if (text == undefined || null) {
                return "-";
            } else {
                if (String(text) == " " || String(text) == "" || String(text).includes("&nbsp;") == true) {
                    return "-";
                } else {
                    return text;
                }
            }
        } catch (e) {
            return "";
        }


    },
    Number: (data, digi) => {
        try {

            if (data == null || String(data).trim() == "" || String(data).trim() == "null") {

                return "&nbsp;"
            }
            if (digi != null && digi != 0) {
                return kendo.toString(Number(data), "n" + digi)
            } else {
                return (Number(data)).toFixed(digi);
            }

        } catch (e) {
            console.log("Error Data E =>", e, "data", data, "digi", digi);
            return "&nbsp;"
        }

    },
    NumberFormula: (data, digi) => {
        try {

            if (data == null || data == "") {
                return "-"
            }
            if (digi != null && digi != 0) {

                return kendo.toString(Number(data), "n" + digi)
            } else {
                return (Number(data)).toFixed(digi);
            }
        } catch (e) {
            console.log("Error Data E =>", e, "data", data, "digi", digi);
            return "-"
        }

    },
    checkbox(value) {

        if (value == true) {

            return "checked"
        } else {
            return ""
        }
    },
    radioButtonOK(value) {

        if (value == "OK") {

            return "checked"
        } else {
            return ""
        }
    },
    radioButtonOKNG(value) {

        if (value == "NG") {

            return "checked"
        } else {
            return ""
        }
    },
    radioButton(value, index) {

        if ((value == "2" && index == "2") || (value == "1" && index == "1")) {
            return "checked"
        } else {
            return ""
        }
    },
    radioButtonStartLinetrue(value) {

        if (value == true) {

            return "checked"
        } else {
            return ""
        }
    },
    radioButtonStartLine(value) {

        if (value == false) {

            return "checked"
        } else {
            return ""
        }
    },


    options_A3_Portrait: {
        margin: [0, -0.1, 0, 0],
        //filename: 'filename.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            dpi: 300,
            scale: 4,
            scrollX: 0, scrollY: 0,
            letterRendering: false,
            useCORS: false
        },
        jsPDF: {
            unit: 'in',
            format: 'a3',
            orientation: 'p',
            precision: 1
        }
    },
    options_A3_Landscape: {
        margin: [0, -0.1, 0, 0],
        //filename: 'filename.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            dpi: 400,
            scale: 5,
            scrollX: 0, scrollY: 0,
            letterRendering: false,
            useCORS: false
        },
        jsPDF: {
            unit: 'in',
            format: 'a3',
            orientation: 'l',
            precision: 1

        }
    },
    options_A4_Portrait: {
        margin: [0, -0.1, 0, 0],
        //filename: 'filename.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            dpi: 300,
            scale: 2,
            scrollX: 0, scrollY: 0,
            letterRendering: false,
            useCORS: false
        },
        jsPDF: {
            unit: 'in',
            /*format: 'aA',*/
            orientation: 'p',
            precision: 1
        }
    },
    options_A4_Landscape: {
        margin: [0, -0.1, 0, 0],
        //filename: 'filename.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            dpi: 300,
            scale: 2,
            scrollX: 0, scrollY: 0,
            letterRendering: false,
            useCORS: false
        },
        jsPDF: {
            unit: 'in',
            /*format: 'aA',*/
            orientation: 'l',
            precision: 1
        }
    }

}