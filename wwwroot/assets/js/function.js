var formatDateTimePicker = "dd/MM/yyyy HH:mm";
var formatDatePicker = "dd/MM/yyyy";
var formatDateWithTime = "dd/MM/yyyy HH:mm:ss";
var formatDateWithTime_export = "yyyy/MM/dd HH:mm:ss";
/** Call Api Start **/

//function APIPost(url, data) {
//    var result;


//  axios.post(url, data)
//        .then(function (response) {
//            console.log(response.data);
//           result= response.data
//        }).catch(function (error) {
//            console.log(error);
//        });
//    return result;
//}
const dateTransformer = function (data) {
    if (data instanceof Date) {
        //var date1 = new Date("2020-06-24 22:57:36");
        return moment(data).format("MM/DD/YYYY HH:mm:ss");

        //return "10/15/2023 02:57:23"
    } else if (data === "") {
        return null
    }


    if (Array.isArray(data)) {
        return data.map(dateTransformer);
    }
    if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, dateTransformer(value)]));
    }
    return data;
};

//const axiosInstance = axios.create({
//    transformRequest: [dateTransformer, ...(axios.defaults.transformRequest)]
//});

let call_Apitimeout = 2400 * 1000

async function APIGet(url, data) {
    try {

        //console.log(JSON.stringify(body));
        const response = await axios.get(url, dateTransformer(data), {
            timeout: call_Apitimeout, maxRedirects: 0,
            validateStatus: (status) => {
                return status >= 200 && status < 400; // Default validation status (2xx and 3xx)
            }
            //, validateStatus: () => true
        });
        if (response.headers['content-type'] === 'text/html; charset=utf-8') {
            window.location.href = response.request.responseURL;
        }
        return response.data; // Return the response data if the request is successful
    } catch (error) {

        //$.notify({
        //    icon: 'fas fa-times-circle',
        //    message: error.message
        //}, {
        //    delay: 3000,
        //    type: 'danger'
        //});
        // console.error('Error:', error);
        //return error.response;

        throw TypeError(error.message);
    }
}


async function APIPost(url, data) {
    try {

        //console.log(JSON.stringify(body));
        const response = await axios.post(url, dateTransformer(data), {
            timeout: call_Apitimeout, maxRedirects: 0,
            validateStatus: (status) => {
                return status >= 200 && status < 400; // Default validation status (2xx and 3xx)
            }
            //, validateStatus: () => true
        });
        if (response.headers['content-type'] === 'text/html; charset=utf-8') {
            window.location.href = response.request.responseURL;
        }
        return response.data; // Return the response data if the request is successful
    } catch (error) {

        //$.notify({
        //    icon: 'fas fa-times-circle',
        //    message: error.message
        //}, {
        //    delay: 3000,
        //    type: 'danger'
        //});
        // console.error('Error:', error);
        //return error.response;

        throw TypeError(error.message);
    }
}

function objectToFormData(obj) {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {

        if (value instanceof Date) {
            // ทำการจัดรูปแบบพิเศษของคุณที่นี่
            //var date1 = new Date("2020-06-24 22:57:36");
            formData.append(key, moment(value).format("MM/DD/YYYY HH:mm:ss"));
            //return "10/15/2023 02:57:23"
        } else if (value === "" || value == null) {
            //return 
           // formData.append(key, null);
        }
        else {
            formData.append(key, value);
        }

    });

    return formData;
}
async function APIPostUploadFile(url, data) {
    try {

        //console.log(objectToFormData(dateTransformer(data)));
        const response = await axios.post(url, objectToFormData(data), {
            timeout: call_Apitimeout,
            maxRedirects: 0,
            //validateStatus: () => true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.headers['content-type'] === 'text/html; charset=utf-8') {
            window.location.href = response.request.responseURL;
        }
        return response.data; // Return the response data if the request is successful
    } catch (error) {

        $.notify({
            icon: 'fas fa-times-circle',
            message: error.response
        }, {
            delay: 3000,
            type: 'danger'
        });


        throw TypeError(error.message);
    }
}

//,


//async function APIPost(url, data) {
//    // Default options are marked with {}
//    const response = await fetch(url, {
//        method: 'POST', // HTTP request method
//        headers: {
//            'Content-Type': 'application/json', // Specify the content type as JSON
//            // Add any additional headers if needed
//        },
//        body: JSON.stringify(dateTransformer(data)), // Convert data to JSON format
//    });

//    // Handle the response
//    if (!response.ok) {
//        throw new Error('Network response was not ok');
//    }

//    return await response.json(); // Parse and return the response data as JSON
//}


/** Call Api End  **/




/*** Function Fix bug kendo Start ***/

function SetFormatsNumber(Number) {
    try {
        return Number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (ex) {
        return "";
    }
}

function setFileName(NameFile) {
    var date = new Date();

    return NameFile + "_" + (date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + "_" + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2));
}


function setNameExtension(extension) {

    var extension = "." + extension.split('.').pop();
    return extension
}

function SetFormatsDate(date) {

    let result = null
    try {
        if (date != null) {
            //console.log("Grid DateTime ", date);
            result = kendo.toString(kendo.parseDate(date, 'yyyy-MM-ddTHH:mm:ss'), formatDateWithTime)

            if (result == null) {
                result = kendo.toString(date, formatDateWithTime)
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


var AutoCompleteChangeIsValid = false;
// This was a valid account! Set the accountIsValid flag.
function AutoCompleteSelect(e) {
    AutoCompleteChangeIsValid = true;
}
// Clear the account field if the choice was not valid
function AutoCompleteChange(e) {
    if (!AutoCompleteChangeIsValid) {
        this.value('');
    }
    // Reset the accountIsValid flag for next run
    AutoCompleteChangeIsValid = false;
}


function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}



/*** Function Fix bug kendo End ***/



function GenerateId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


function format(str, col) {
    col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

    return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }

        if (col[n] == undefined) {
            return "";
        }

        return col[n] !== undefined ? col[n] : `{${n}}`;
    });
};



//showAlert

function showError(message) {
    app.ui.showAlertWarning("#message-container", message);
}

function showSuccess(message) {
    $.notify({
        icon: 'fas fa-check-circle fs-lg',
        message: message
    }, {
        delay: 3000,
        type: 'success'
    });
    app.ui.showAlertSuccess("#message-container", message);
}

function showWarning(message) {
    app.ui.showAlertWarning("#message-container", message);
}
//showAlert



// encode decode
function encode(data) {
    try {
        if (data == null) return null;
        return btoa(data);
    }
    catch {
        return null;
    }
}

function decode(data) {
    try {

        if (data == null) return null;
        return atob(data)
    }
    catch {
        return null;
    }
}




function urlParams(Id) {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const page_type = urlParams.get(Id);

        if (page_type != "") {
            return page_type;
        } else {
            return null;
        }
    }
    catch {
        return null;
    }
}

function onDateTimePicker(e) {
    //const date = new Date(this.value());
    const date = kendo.parseDate(this.value(), "dd-MM-yy HH:mm");
    if (date == null) {
        this.value(null);
        return
    }
    const dateTimeNow = new Date();;
    if (date.getHours() == 0 && date.getMinutes() == 0) {
        date.setHours(dateTimeNow.getHours());
        date.setMinutes(dateTimeNow.getMinutes());
        this.value(date);
    }
}



function saveCapture(element) {
    return html2canvas(element, {
        scale: 5,
        dpi: 300,
    }).then(function (canvas) {
        console.log("canvas =>", canvas, canvas.toDataURL("image/png"));
        return canvas.toDataURL("image/png");
    })
}


function onNotificationShow(e) {
    //document.querySelector('main').classList.add('disabled-input-screen-load')

    document.getElementById('site-section').classList.add('disabled-input-screen-load');
}

function onNotificationHide(e) {
    //document.querySelector('main').classList.remove('disabled-input-screen-load')

    document.getElementById('site-section').classList.remove('disabled-input-screen-load');
}
//site-section


function MessageResources(screenCode, objectId, col) {
    //console.time()
    const screenData = _data_LocalizedResources[screenCode];
    col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 2);
    if (screenData) {
        let result = null
        try {
            if (CurrentCulture_now == "th") {
                result = screenData.find(item => item.ObjectID === objectId).ResourcesTH;
            } else {
                result = screenData.find(item => item.ObjectID === objectId).ResourcesEN;

            }
            if (col != null) {
                result = format(result, col)
            }


        } catch (e) {
            console.log("Error", e);
            return screenCode + "_" + objectId;
        }

        //console.timeEnd()
        return result || screenCode + "_" + objectId;
    }

    //console.timeEnd()
    return screenCode + "_" + objectId;
}


function Message(MessageType, messagecode, col) {
    const screenData = _data_LocalizedMessages[MessageType];
    col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 2);
    if (screenData) {
        let result = null
        try {
            if (CurrentCulture_now == "th") {
                result = screenData.find(item => item.MessageCode === messagecode).MessageNameTH;
            } else {
                result = screenData.find(item => item.MessageCode === messagecode).MessageNameEN;

            }
            if (col != null) {
                result = format(result, col)
            }


        } catch (e) {
            console.log("Error", e);
            return MessageType + "_" + messagecode;
        }


        return result || MessageType + "_" + messagecode;
    }
    return MessageType + "_" + messagecode;
}




let Event = {
    clearMessage: () => {
        app.ui.clearAlert("#message-container");
    },
    showWarning: (message) => {

        $.notify({
            icon: 'fas fa-exclamation-triangle fs-lg',
            message: message
        }, {
            delay: 3000,
            type: 'warning'
        });
        app.ui.showAlertWarning("#message-container", message);
    },

    showSuccess: (message) => {
        $.notify({
            icon: 'fas fa-check-circle fs-lg',
            message: message
        }, {
            delay: 3000,
            type: 'success'
        });
        app.ui.showAlertSuccess("#message-container", message);
    },

    showError: (message) => {
        $.notify({
            icon: 'fas fa-times-circle',
            message: message
        }, {
            delay: 3000,
            type: 'danger'
        });
        //app.ui.showAlertError("#message-container", message);
    }
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}