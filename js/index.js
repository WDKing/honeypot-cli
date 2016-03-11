// Honeypot Client vers 0.0.1
// Uses fetch module to fetch data from endpoint
// Note: Server does not respond with 'normal' json.
// Instead, treat it as a string, split data into
// an array using newline seperator and then parse
// json for each index...

var URL = 'http://54.200.61.193/clientInfoData.json'

/**
 * Requests data from URL
 */
function requestData(url) {

    var promise = fetchJson(url)

    promise.then(function(data) {
            $('#app').html('')
            var dataItems = data.split('\n')
            dataItems.map(function(item, index) {
                addDataItems(item, index)
            })
            console.log('Done...')
        })
        .catch(function(err) {
            var notFound = document.createElement('div')
            notFound.className = 'center'
            notFound.innerHTML = err
            console.error(err)
            $('#app').html('')
            $('#app').append(notFound)
        })
}

/**
 * Returns a new promise to fetch json through ajax call
 */
function fetchJson(url) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'text', // server responds w/ invalid json 
            success: function(data) {
                resolve(data.trim())
            },
            error: function(xhr, options, err) {
                reject(new Error(xhr.responseText || err))
            }
        })
    })
}

/**
 * Adds an individual element to a div
 */
function addItem(key, data, div) {
    try {
        var elem = document.createElement('p')
        elem.innerHTML = "<strong>" + key + "</strong>: " + data.replace(/[<>]/ig, "")
        div.appendChild(elem)
    } catch (e) {
        //console.log(e.message)
    }
}

/**
 * Add all data items to DOM
 */
function addDataItems(item, index) {
    var data = JSON.parse(item)

    // Div for whole item
    var div = document.createElement('div')
    div.className = 'data-item'

    // Server data item number
    var dataIndex = document.createElement('h4')
    dataIndex.innerHTML = "Server Item (" + (index + 1) + ")"
    div.appendChild(dataIndex)

    // Add data items to display
    addItem('IP', data.Client.IP, div);
    addItem('Username', data.Client.Data.Username, div)
    addItem('Passwords', data.Client.Data.Passwords, div)
    addItem('ID', data._id.$oid, div);
    addItem('Key', data.Client.Data.Key, div)
    addItem('Time', data.Client.Data.Time, div)
    addItem('Port', data.Client.Port, div)
    addItem('Socket', data.Client.Socket, div)

    // Add div to DOM
    $('#app').append(div)
}

requestData(URL)
setInterval(function() {
    requestData(URL)
}, 10000)