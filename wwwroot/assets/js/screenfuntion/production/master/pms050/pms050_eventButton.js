function newdocumentButtonClicked(e) {
    dialog_windows.new(e);
}


function searchButtonClicked(e) {
    e.preventDefault();
    serachData();
}

function exportButtonClicked(e) {
    var gridexport = $(grid_inquire.grid_ID).data("kendoGrid");
    gridexport.saveAsExcel();
}


async function clearButtonClicked(e) {
    e.preventDefault();
    LoadDefault();


}



async function saveButtonClicked(e) {
    e.preventDefault();
 



}
