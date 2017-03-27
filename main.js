$(document).ready(function(){

  api_root = "https://desolate-badlands-56995.herokuapp.com/"
  api_notes = api_root + 'api/notes'
  tag_notes_url = api_root + 'api/notes/tag/'

  //
  // function set_token(token) {
  //     localStorage.setItem('token', token);
  //   }
  //
  //   function get_token() {
  //     return localStorage.getItem('token')
  //   }



  function note_display(note) {
    return  `
                <div class="media" id="${note.id}">
                    <div class="media-body">
                      <p>${note.body}</p>
                      <p><small>Posted by This Guy <a href="#${note.id}" class="note_show">${moment(note.created_at).fromNow()}</a></small></p>
                      <p>${note.tags.map(function(tag) {
                        return ` <a href=${tag.name}  class='tag_link'>${tag.name}</a>
                                `
                      }).join(', ')}</p>
                    </div>
                  </div>
            `
  }

  function signed_in() {
    if(localStorage.getItem('token') === null) {
      return false
    } else {
      return true
    }
  }

  function populate_notes_from_tags() {
    $('#note_list').empty()
    $.getJSON(tag_notes_url + id_to_fetch)
      .done(function(response){
        response.tag.notes.forEach(function(note){
          $('#note_list').append(
            note_display(note)
          )
        })
      })
    }


  function first_load(){
    $('#note_list').empty()
    $.getJSON(api_notes)
      .done(function(response){
        response.notes.forEach(function(note){
          $('#note_list').append(
            note_display(note)
          )
        })
        if(window.location.hash){
          $('a[href="' + window.location.hash + '"]').click()
        }
      })
  }

  $(document).on('click', '.tag_link', function(ev){
    ev.preventDefault()
    id_to_fetch = $(ev.target).attr("href")
    $('#dynamic_tags').empty().append(`: ${id_to_fetch}`)
    populate_notes_from_tags(id_to_fetch)

  })


  function reset_form(form_id){
    $(form_id)[0].reset()
  }

  $('#post_note').on('submit', function(ev){
      ev.preventDefault()
      $.post(api_root + "api/notes", $(this).serialize())
        .done(function(note){
          $('#note_list').prepend(
            note_display(note.note)
          )
          reset_form('#post_note')
        })
    })


    $(document).on('click', '.note_show', function(ev){
      // ev.preventDefault()
      id_to_fetch = $(ev.target).attr("href")
      $('#modal_one .modal-body').html($(id_to_fetch).html())
      $('#modal_one').modal('show')
    })


    first_load()
})
