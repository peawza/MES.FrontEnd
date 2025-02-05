
function searchButtonClicked(e) {
    e.preventDefault();
    serachData();
}

async function exportButtonClicked(e) {
   

}


async function clearButtonClicked(e) {
    e.preventDefault();
    LoadDefault();
}

function newdocumentButtonClicked(e) {
    //console.log("New Mode");
    dialog_windows.new(e);
}
