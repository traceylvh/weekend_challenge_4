$(document).ready(function() {
    // console.log("this works!");
    $('#submit-button').on('click', getFormData);
    //listen for complete button click
    $('.list').on('click', '.true', updateStatus);
    //listen for delete button click
    $('.list').on('click', '.delete', deleteTask);

    getServerData();

});

var values = {};

function getFormData() {
    event.preventDefault();


    $.each($('#todo-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    //clear out form
    $('#todo-form').find('input[type=text]').val('');

    console.log(values);

    postData(values);


}

function postData(){
  $.ajax({
      type: 'POST',
      url: '/todos',
      data: values,
      success: function(data) {
          if(data) {
              // everything went ok
              console.log('from server:', data);
              getServerData();
          } else {
              console.log('error');
          }
      }
  });
}

function getServerData() {
    $.ajax({
        type: 'GET',
        url: '/todos',
        success: function(data) {
            console.log(data);
            $('.list').empty();
            appendDom(data);
        }
    });
}


function appendDom(listItems) {
  console.log(listItems);
  $('.list').empty();
  listItems.forEach(function(item){
    $('.list').append('<p class="line-item-' + item.status + '"><button data-id="' + item.id + '" class="' + item.status + '">&#10004</button> ' +
    '<button data-id="' + item.id + '" class="delete">&#10008</button> ' + item.task + '</p>');
  });
}


//delete task
function deleteTask() {

  //check before deleting with popup
  if (confirm("Are you sure?") == true) {

    // $(this).parent().remove();
    var deleteTask = {};
    deleteTask.id = $(this).data('id');

    $.ajax({
        type: 'DELETE',
        url: '/deleteTask',
        data: deleteTask,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getServerData();
            } else {
                console.log('error');
            }
        }
    });

  } else {
      console.log("no don't delete");
  }

}

function updateStatus(){
  var updateTask = {};
  updateTask.id = $(this).data('id');
  updateTask.status = "false";

  $.ajax({
      type: 'POST',
      url: '/complete',
      data: updateTask,
      success: function(data) {
          if(data) {
              // everything went ok
              console.log('from server:', data);
              getServerData();
          } else {
              console.log('error');
          }
      }
  });
}
