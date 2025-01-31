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


let kendo_grid = {
    filter: {
        string: {
            operators: {
                string: {
                    contains: "Contains",
                    eq: "Equal to",
                    neq: "Not equal to",
                    doesnotcontain: "Doesn't contain"
                }
            }
        }
    },
    noRecords:
    {
        template: "<div class='empty-grid'></div>"
    }



}