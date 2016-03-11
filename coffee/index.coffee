# ----- Script ----- //
URL = 'http://54.200.61.193/clientInfoData.json'

requestData = (url) ->
  promise = fetchJson(url)
  promise.then((data) ->
    $('#app').html ''
    dataItems = data.split('\n')
    dataItems.map (item, index) ->
      addDataItems item, index
      return
    console.log 'Done...'
    return
  ).catch (err) ->
    notFound = document.createElement('div')
    notFound.className = 'center'
    notFound.innerHTML = err
    console.error err
    $('#app').html ''
    $('#app').append notFound
    return
  return

fetchJson = (url) ->
  new Promise((resolve, reject) ->
    $.ajax
      type: 'GET'
      url: url
      dataType: 'text'
      success: (data) ->
        resolve data.trim()
        return
      error: (xhr, options, err) ->
        reject new Error(xhr.responseText or err)
        return
    return
)

addItem = (key, data, div) ->
  try
    elem = document.createElement('p')
    elem.innerHTML = key + ': ' + data.replace(/[<>]/ig, '')
    div.appendChild elem
  catch e
    #console.log(e.message)
  return

addDataItems = (item, index) ->
  data = JSON.parse(item)
  # Div for whole item
  div = document.createElement('div')
  div.className = 'data-item'
  # Server data item number
  dataIndex = document.createElement('h4')
  dataIndex.innerHTML = 'Server Data Item ' + index + 1
  div.appendChild dataIndex
  # Add data items to display
  addItem 'ID', data._id.$oid, div
  addItem 'IP', data.Client.IP, div
  addItem 'Username', data.Client.Data.Username, div
  addItem 'Passwords', data.Client.Data.Passwords, div
  addItem 'Key', data.Client.Data.Key, div
  addItem 'Time', data.Client.Data.Time, div
  addItem 'Port', data.Client.Port, div
  addItem 'Socket', data.Client.Socket, div
  # Uncomment for whole json response

  ###dataItem.innerHTML = (data) ? data.toString() : "No data for item"
  div.appendChild(dataItem)
  ###

  $('#app').append div
  return

requestData URL
setInterval (->
  requestData URL
  return
), 10000
