class ImageSliderDialog {
    constructor(options) {
        var _this = this;
        this.name = "image-slider-dialog";
        // dialog options
        this.options = $.extend(true, {
            visible: false,
            modal: true,            
            title: 'Preview Image',
            animation: {
                open: {
                    effects: "fade:in"
                },
                close: {
                    effects: "fade:out"
                }
            },
            actions: [
                "Close"
            ]
        }, options);
        this.dialog = $('#' + this.name).kendoWindow(this.options).data("kendoWindow"); 
    }

    open(data,options) {
        var html = kendo.template($("#carousel-template").html())(data);
        var carousel = $("#carousel-controls", this.dialog.wrapper);
        //options = $.extend(true, { interval: 5000 }, options);
        carousel.html(html);
        //carousel.carousel(options);
        this.dialog.open().maximize(); 
    } 

}