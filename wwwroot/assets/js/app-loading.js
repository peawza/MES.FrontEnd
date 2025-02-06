function onNotificationShow(e) {
    document.getElementById('loadingOverlay').classList.remove('d-none');
    document.getElementById('loadingOverlay').innerText = '';
}

function onNotificationHide(e) {
    document.getElementById('loadingOverlay').classList.add('d-none');
    document.getElementById('loadingOverlay').innerText = '';
}
var axios_loading = $("#axios-loading").kendoNotification({
    show: onNotificationShow, hide: onNotificationHide,
    position: {
        pinned: true,
        bottom: 10,
        left: 10
    },
    animation: {
        open: {
            effects: "fadeIn"
        },
        close: {
            effects: "fadeOut"
        }
    },
    width: 400,
    autoHideAfter: 0,
    stacking: "down",
    templates: [
        {
            type: "progress",
            template: "<div class=\"\"><i class=\"fa-duotone fa-spinner-third fa-spin\"></i> #= message #</div>"
        }
    ]
}).data("kendoNotification");
$(document).ready(async function () {
    try {
        if ($("#ajax-notifications").data("kendoNotification") != undefined) {
            $("#ajax-notifications").data("kendoNotification")._events = $("#axios-loading").data("kendoNotification")._events
        }
    } catch (e) {
        console.error("", e);
    }
    
});


let api_axios_count = 0;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
axios.interceptors.request.use(function (config) {
    api_axios_count += 1;

    let axios_loading_length = document.querySelectorAll("." + axios_loading._guid).length;

    if (axios_loading_length == 0 && document.readyState === 'complete') {

        axios_loading.show({ message: 'Please wait while data is loading..' }, "progress");
    }



    return config;
}, async function (error) {
    api_axios_count--;
    setTimeout(() => {
        if (api_axios_count == 0 && document.readyState === 'complete') {
            axios_loading.hide();
        }
    }, api_axios_delay);


    return Promise.reject(error);
});



// Add a response interceptor
axios.interceptors.response.use(async function (response) {
    api_axios_count--;
    setTimeout(() => {
        if (api_axios_count == 0) {
            axios_loading.hide();
        }
    }, api_axios_delay);

    return response;
}, async function (error) {
    api_axios_count--;
    setTimeout(() => {
        if (api_axios_count == 0) {
            axios_loading.hide();
        }
    }, api_axios_delay);

    return Promise.reject(error);
});





window.addEventListener('load', async (event) => {
    if (document.readyState === 'complete') {

        await delay(500);
        //document.getElementById('loadingOverlay').classList.add('d-none');
        document.getElementById('page-content').classList.remove('d-hidden');
        //console.log('Document and all sub-resources have finished loading');
    }
    document.getElementById('loadingOverlay').classList.add('d-none');
});