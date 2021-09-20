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
//it loops through post users, which user is logged in, which post, floating button for location stylizing 
const edit =  (postUser, loggedUser, postId, floating = true) => {
  if (postUser._id.toString() == loggedUser._id.toString()) {
    return (floating) 
      ? `<a href="/posts/edit/${postId}" class="btn"><i class="fas fa-edit fa-small"></i>Edit</a>` 
      : `<a href="/posts/edit/${postId}"><i class="fas fa-edit"></i>Edit</a>`
  } else {
    return '<span class="text-small">not the logged in user</span>'
  }
}

//further improvement to improve above helper, there's no need for floating
const edits = () => {
  return `<p class="btn"><a href="/posts/edit/"><i class="fas fa-edit fa-small"></i>Edit</a></p>` 
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

const upperCaseHelper = (input) => {
  return input.toUpperCase() 
}

module.exports = { formatDate, truncate, stripTags, edit, select, upperCaseHelper }
