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
            async: true,
            crossDomain: true,
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
 * Construct display itms and append them to the passed in div. 
 * @return the div
 */
function constructTable(values, div) {
    var table = document.createElement('table')
    table.className = 'data-table'

	for (var key in values) {
		if (values.hasOwnProperty(key)) {
            var tr = document.createElement('tr')
			var th = document.createElement('th')
            var td = document.createElement('td')
			th.innerHTML = "<strong>" + key + "</strong>" 
            td.innerHTML = values[key]
            tr.appendChild(th)
            tr.appendChild(td)
			table.appendChild(tr)
		}
	}
	return table
}

/**
 * Add all data items to DOM
 */
function addDataItems(item, index) {
    var data = JSON.parse(item)

    // Div for whole item
    var dataDiv = document.createElement('div')
    dataDiv.className = 'data-item'

    // Server data item number
    var dataIndex = document.createElement('h4')
    dataIndex.innerHTML = "Server Item (" + (index + 1) + ")"
    dataDiv.appendChild(dataIndex)

     $('#app').append(dataDiv)

    // JSON value table
    var displayValues = {
    	"IP": data.Client.IP,
    	"Username": data.Client.Data.Username,
    	"Passwords": data.Client.Data.Passwords,
    	"ID": data._id.$oid,
    	"Key": data.Client.Data.Key,
    	"Time": data.Client.Data.Time,
    	"Port": data.Client.Port,
    	"Socket": data.Client.Socket.toString()
    }

    // Construct display items
    var itemTable = constructTable(displayValues, dataDiv)

    // Add div to DOM
    $('#app').append(itemTable)
}

requestData(URL)
setInterval(function() {
    requestData(URL)
}, 10000)