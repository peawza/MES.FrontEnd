
function searchButtonClicked(e) {
    e.preventDefault();
    serachData();
}

async function exportButtonClicked(e) {
    var gridexport = $(grid_inquire.grid_ID).data("kendoGrid");
    gridexport.saveAsExcel();

}


async function clearButtonClicked(e) {
    e.preventDefault();
    LoadDefault();
}

function newdocumentButtonClicked(e) {
    //console.log("New Mode");
    dialog_windows.new(e);
}
