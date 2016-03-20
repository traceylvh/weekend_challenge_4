$(document).ready(function() {
    // console.log("this works!");
    $('#submit-button').on('click', getFormData);
    //listen for complete button click
    $('.list').on('click', '.true', markComplete);
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
    $('.list').append('<p class="line-item"><button data-id="' + item.id + '" class="' + item.status + '">&#10004</button> ' +
    '<button data-id="' + item.id + '" class="delete">&#10008</button> ' + item.task + '</p>');
  });
}

//mark task complete
function markComplete(values) {
 $(this).removeClass('true');
 $(this).addClass('false');
 $(this).parent().toggleClass('line-item-done');
 values.id = $(this).data("id");
 values.status = "false";
 console.log(values);
}

//mark task complete
function deleteTask() {
    $(this).parent().remove();
}

function updateStatus(){
  $.ajax({
      type: 'POST',
      url: '/complete',
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
