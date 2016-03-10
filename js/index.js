// Honeypot Client vers 0.0.0
// Uses fetch module to fetch data from endpoint
// Note: Server does not respond with 'normal' json.
// Instead, treat it as a string, split data into
// an array using newline seperator and then parse
// json for each index...

// ----- Functions ----- //

function getData() {
    // Endpoint URL
    var URL = 'http://54.200.61.193/clientInfoData.json'
        // Make a new promise to fetch data
    var promise = fetchJsonFromEndpoint(URL)
        // Promise is fulfilled
    promise.then(function(data) {
            $('#app').html('')

            var dataItems = data.split('\n')

            dataItems.map(function(item, index) {
                addDataItem(item, index)
            })
            console.log('Done...')
        })
        .catch(function(err) {
            $('#app').html('')
            console.error(err.log())
            $('#app').append(err.node())
        })
}

function fetchJsonFromEndpoint(url) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'text', // server responds w/ invalid json 
            success: function(data) {
                resolve(data)
            },
            error: function(xhr, options, err) {
                reject(new FetchError(xhr, err))
            }
        })
    })
}

function addDataItem(item, index) {
    var div = document.createElement('div')
    var dataIndex = document.createElement('h4')
    var dataId = document.createElement('h5')
    var dataItem = document.createElement('p')

    dataIndex.innerHTML = "Data Item " + index
    dataId.innerHTML = "$oid: " + ((item) ? JSON.parse(item)._id.$oid : 'No id for item')
    dataItem.innerHTML = (item) ? item.toString() : "No data for item"

    div.appendChild(dataIndex)
    div.appendChild(dataId)
    div.appendChild(dataItem)

    $('#app').append(div)
}

// ----- Objects ----- //

function FetchError(xhr, err) {
    this.error = err
    this.status = xhr.status
    this.response = xhr.responseText
    this.node = function() {
        // Add error to DOM
        var node = document.createElement('div')
        node.className = 'error'
        node.style.textAlign = 'center'
        node.style.color = 'red'
        node.innerHTML = this.response
        return node
    }
    this.log = function() {
        return (
            "Error:" + this.error + "\n\n" +
            "Status: " + this.status + "\n\n" +
            "Response: " + this.response
        )
    }
}

// ----- Script ----- //
getData()
setInterval(function() {
    getData()
}, 10000)
