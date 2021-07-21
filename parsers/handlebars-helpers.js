const moment = require('moment')

const formatDate = (date, format) => {
  return moment(date).utc().format(format)
}

const truncate = (str, len) => {
  if (str.length > len && str.length > 0) {
    let new_str = str + ' '
    new_str = str.substr(0, len)
    new_str = str.substr(0, new_str.lastIndexOf(' '))
    new_str = new_str.length > 0 ? new_str : str.substr(0, len)
    return new_str + '...'
  }
  return str
}

const stripTags = (input) => {
  return input.replace(/<(?:.|\n)*?>/gm, '')
}

//This function takes number of things: 
//it loops through post users, which user is logged in, which story, floating button for location stylizing 
const edit =  (postUser, loggedUser, postId, floating = true) => {
  if (postUser._id.toString() == loggedUser._id.toString()) {
    return (floating) 
      ? `<a href="/posts/edit/${postId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>` 
      : `<a href="/posts/edit/${postId}"><i class="fas fa-edit"></i></a>`
  } else {
    return ''
  }
}


const select = (selected, options) => {
  return options
    .fn(this)
    .replace(
      new RegExp(' value="' + selected + '"'),
      '$& selected="selected"'
    )
    .replace(
      new RegExp('>' + selected + '</option>'),
      ' selected="selected"$&'
    )
}

module.exports = { formatDate, truncate, stripTags, edit, select}


