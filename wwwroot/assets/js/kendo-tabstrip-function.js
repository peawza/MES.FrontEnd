function addFunctionRemoveTabStripClickHandlers(IdTabStrip) {
    var tabstrip = jQuery('#' + IdTabStrip).data("kendoTabStrip");
    jQuery('.fa-times').unbind("click").on("click", function () {
        tabstrip.remove(jQuery(this).closest("li"));
        tabstrip.select(tabstrip.items().length - 1);
    });
}

