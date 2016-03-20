$(document).ready(function() {
    // console.log("this works!");
    $('#submit-button').on('click', getFormData);
    //listen for Change button click
  $('.list').on('click', '.true', markComplete);

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
    $('.list').append('<p class="line-item"><button id="' + item.id + '" class="' + item.status + '">&#10004</button> ' +
    '<button id="' + item.id + '" class="delete">&#10008</button> ' + item.task + '</p>');
  });
}

//change the background color
function markComplete() {
 $(this).toggleClass('false');
 $(this).parent().toggleClass('line-item-done');
}
