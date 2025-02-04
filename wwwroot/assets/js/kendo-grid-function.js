function checkGridRowEdit(IdGrid) {
    const ElementGridComponent = document.getElementById(IdGrid);
    var nodes = ElementGridComponent.childNodes[2].childNodes[0];
    nodes = ElementGridComponent.childNodes[2].childNodes[0].getElementsByTagName('tr')
    var indexInsert = null;
    var checkEditData = false;
    for (var indexNode = 0; indexNode < nodes.length; indexNode++) {
        if (nodes[indexNode].className.includes("k-grid-edit-row")) {
            checkEditData = true;
            break;
        }
    }
    return checkEditData;
}

function GridPageSizes() {
    return [20, 40, 60, 80, 100, "All"];
}

function GridPageSizeDefault() {
    return 20;
}
function GridCommonPageSizeDefault() {
    return 40;
}

function GridFillterable() {
    return {
        mode: "menu",
        operators: {
            string: {
                contains: "Contains",
                startswith: "Starts with",
                eq: "Is equal to",
                neq: "Is not equal to",
                endswith: "Ends with",
                isnull: "Is null",
                isnotnull: "Is not null",
                isempty: "Is empty"
            },

            date: {
                eq: "Is equal to",
                neq: "Is not equal to",
                gt: "After",
                lt: "Before",
                isnull: "Is null",
                isnotnull: "Is not null"
            }

        },
        //extra: false,
    }
}
function GridExcelExport(e, filename, displayColumeNo) {
    let check_DisplayColume_No = true;
    if (displayColumeNo == undefined || displayColumeNo == null) {
        check_DisplayColume_No = true
    } else {
        check_DisplayColume_No = displayColumeNo
    }

    let file = setFileName(filename);
    e.workbook.fileName = file + ".xlsx";

    var sheet = e.workbook.sheets[0];
    var columns = sheet.columns; // Ensure columns are fetched properly

    if (check_DisplayColume_No == true) {
        // Add a new column for "Column No" at the beginning
        columns.unshift({
            width: 50, // Set a suitable width for the column
            title: "No", // Title for the column
        });

        // Add "Column No" values for each row
        sheet.rows.forEach((row, rowIndex) => {
            if (row.type !== "header") { // Skip header row
                row.cells.unshift({
                    value: String(rowIndex), // Running number starts from 1
                    textAlign: "center", // Optional alignment
                });
            } else {
                // Add header cell for "Column No" with background color
                row.cells.unshift({
                    value: "No",
                    textAlign: "center",
                    background: "#7A7A7A", // Set the desired background color
                    color: "#FFFFFF", // Optional: Set font color (white)
                });
            }
        });

        columns.forEach(function (column) {
            // Also delete the width if it is set
            delete column.width;
            column.autoWidth = true;
        });
    }

    // Process the rows and cells for formatting
    for (var rowIndex = 0; rowIndex < sheet.rows.length; rowIndex++) {
        var row = sheet.rows[rowIndex];
        for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            var cell = row.cells[cellIndex];
            if (cell.value && cell.value.toString().indexOf("<br>") >= 0) {
                cell.value = cell.value.replace(/<br>/g, ' ');
                cell.wrap = true;
            }
        }
    }

    for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
        var row = sheet.rows[rowIndex];
        for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
            var cell = row.cells[cellIndex];

            if (cell.value && typeof cell.value === "number") {
                cell.format = "#,##0.00"; // Set the format for decimal numbers
            } else if (cell.value && typeof cell.value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(cell.value)) {
                var date = kendo.parseDate(cell.value, "yyyy-MM-ddTHH:mm:ss");
                if (date) {
                    cell.value = kendo.toString(date, "dd/MM/yyyy HH:mm:ss");
                    cell.format = "dd/MM/yyyy HH:mm:ss";
                }
            } else if (cell.value && typeof cell.value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(cell.value)) {
                var date = kendo.parseDate(cell.value, "yyyy-MM-ddTHH:mm:ss");
                if (date) {
                    cell.value = kendo.toString(date, "dd/MM/yyyy");
                    cell.format = "dd/MM/yyyy";
                }
            }
        }
    }
}


let kendo_grid = {
    filter: {
        string: {
            operators: {
                string: {
                    contains: "Contains",
                    startswith: "Starts with",
                    eq: "Is equal to",
                    neq: "Is not equal to",
                    endswith: "Ends with",
                    isnull: "Is null",
                    isnotnull: "Is not null",
                    isempty: "Is empty"
                }
            }
        },
        filter_Active_Inactive: {
            ui: function (element) {
                //console.log(element);
                // 
                element.kendoDropDownList({
                    dataSource: [
                        { text: "Active", value: "Active" },
                        { text: "Inactive", value: "Inactive" },

                    ],
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: Resources("COMMON", "DropDownAll")
                });

                $(document).ready(function () {
                    // Add 'd-none' class to the dropdown with the title "Operator"
                    $($('.k-filter-menu-container .k-picker.k-dropdownlist.k-picker-solid.k-picker-md.k-rounded-md')[0]).addClass('d-none');
                });


                //$('.k-filter-menu-container').find('label:contains("Operator")')
                //    .closest('.k-dropdownlist') // Get the closest dropdown
                //    .addClass('d-none');

            }
            , operators: {
                string: {
                    eq: "Contains",
                }
            },
            extra: false,

        },

        filter_0_1: {
            ui: function (element) {
                //console.log(element);
                // 
                element.kendoDropDownList({
                    dataSource: [
                        { text: "Yes", value: true },
                        { text: "No", value: false }
                    ],
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: Resources("COMMON", "DropDownAll")
                });

                $(document).ready(function () {
                    // Add 'd-none' class to the dropdown with the title "Operator"
                    $($('.k-filter-menu-container .k-picker.k-dropdownlist.k-picker-solid.k-picker-md.k-rounded-md')[0]).addClass('d-none');
                });
            }
            , operators: {
                string: {
                    contains: "Contains",
                }
            },
            extra: false,

        },

        filter_true_false: {
            ui: function (element) {
                //console.log(element);
                // 
                element.kendoDropDownList({
                    dataSource: [
                        { text: "Yes", value: true },
                        { text: "No", value: false }
                    ],
                    dataTextField: "text",
                    dataValueField: "value",
                    optionLabel: Resources("COMMON", "DropDownAll"),
                });

                $(document).ready(function () {
                    // Add 'd-none' class to the dropdown with the title "Operator"
                    $($('.k-filter-menu-container .k-picker.k-dropdownlist.k-picker-solid.k-picker-md.k-rounded-md')[0]).addClass('d-none');
                });
            }
            , operators: {
                string: {
                    contains: "Contains",
                }
            },
            extra: false,

        },

    },
    noRecords:
    {
        template: "<div class='empty-grid'></div>"
    }
}

