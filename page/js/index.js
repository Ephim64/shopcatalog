var merchandise = [],
count = 0,
action=true,
listOfGlyphs;//true = add, false = update
//EVENT BINDING
$(function(){
  //Add new handler
  $('#add-new').click(function(event){
    action = true;
    toInput();
    $('#add-update').text('Add');
    $('#price').removeAttr('data-price');
    $('.add-edit-modal').text('Add new item');
    $('#merch-name').focus();
  })
  //Add or Update handler
  $('#add-update').click(function(event) {
    var item = {'name':$('#merch-name').val(),'count':$('#count').val(),'price':$('#price').attr('data-price')};
    $('#merch-name').trigger('focusout');
    if(item.name && item.count && item.price && action){
    addItem(item);
    //appendToTable(item);
    toInput();
    var test = !!$("#filter").val();
    $("#filter").val()? filter($("#filter").val()): updateTable();
  }
  else if(item.name && item.count && item.price && !action){
    if($(this).attr('data-index')) {
      $('tr[data-index="'+$(this).attr('data-index')+'"]').empty();
      updateItem($(this).attr('data-index'),item);
      toInput();
      $('.order').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
  }
  $('#price').removeAttr('data-price');
  });
  //Applies search filter to merchandise list
  $('#apply-filter').click(function(event){
    var filterString = $('#filter').val();
    filter(filterString);
  })
  //Actions handler
  $('#list').on('click','button',function(){
    if($(this).attr('value') === 'edit'){
      $('#price').attr('data-price', merchandise[$(this).attr('data-index')].price);
      toInput(merchandise[$(this).attr('data-index')]);
      $('#add-update').attr('data-index',$(this).attr('data-index'));
      action = false;
      $('#add-update').text('Update');
      $('.add-edit-modal').text('Edit item');
      $("#filter").val()? filter($("#filter").val()): updateTable();
    }
    if($(this).attr('value') === 'delete'){
      $('#delete-modal-confirm').attr('data-index',$(this).attr('data-index'));
    }
  });
  //Modal delete handler
  $('#delete-modal-confirm').click(function(event){
    removeItem($(this).attr('data-index'));
    updateTable(merchandise);
    toInput();
    $('#price').removeAttr('data-price');
    $("#filter").val()? filter($("#filter").val()): updateTable();
  })
  //On focusout event handler for price input
  $('#price').focusout(function(event){
    var tempPrice;
    var reg = /^([0-9.]+)$|^([0-9,]+)$/g;
    tempPrice = $('#price').val();
    var result = reg.test(tempPrice);
    if(tempPrice){
      if(!result){
        hasError(this,'Price can be numeric only!');
        $('#price').removeAttr('data-price');
        return;
    }
    else removeError(this);
  }
  else hasError(this,'Field can not be empty!');;
    tempPrice? $('#price').val(toUS(tempPrice)):$('#price').val('');
    $('#price').attr('data-price',tempPrice);
  })
  $('#price').focusin(function(event){
    $('#price').attr('data-price')? $('#price').val($('#price').attr('data-price')):$('#price').val('');
  });
  var list = $('[class ~= order]');
  for(var t=0;t<list.length;t++){
    assign(t);
  }
  function assign(index){
    var count = counter();
    return $(list[index]).click(function(event){
      if(count()%2){
        updateTable(order($(this).attr('data-type')));
        $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      }
      else{
        updateTable(order($(this).attr('data-type')).reverse());
        $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    })
  }
  $('#merch-name').on('focusout',function(event){
    var reg = /^\S.{0,15}$/g;
    var name = $('#merch-name').val();
    if(name){
      if(name.length<16){
        if(reg.test(name)){
          $('#add-update').attr('disabled', false);
          removeError(this);
        }
        else hasError(this,'Name is blank!');
      }
      else hasError(this,'The length of the field can not be greater than 15 symbols!')
    }
    else hasError(this,'Name is blank!');
  })
})
//EVENT BINDING ENDS
//DATA PROCESSING
//Add new item to merchandise list
function addItem(item){
  merchandise.push(item);
}
//Updates item in merchandise list
function updateItem(index,item){
  merchandise[index] = item;
  appendToTable(item);
}
//Removes item from merchandise list
function removeItem(index){
  merchandise = merchandise.filter(function(element){
    return merchandise.indexOf(element) != index;
  });
}
//Orders list
function order(parameter){
  var orderedList = merchandise;
  return orderedList.sort(function(a,b){
    if(a[parameter] > b[parameter]) return 1;
    if(a[parameter]<b[parameter]) return -1;
    return 0;
  })
}
//Filter. Returns new list
function filter(filterString){
  if(filterString){
    var filteredList = merchandise.filter(function(item){
      return item.name.toLowerCase().includes(filterString.toLowerCase());
    })
    updateTable(filteredList);
  }
  else updateTable(merchandise);
}
//Converts numbers to us dollars
function toUS(number){
  var regString = /(\d)(?=(\d{3})+\.)/;
  return '$'+ parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$&,')
}
//Meh, counter
function counter(){
  var ctr = 0;
  return function(){
    return ctr++;
  };
}
//END DATA PROCESSING
//VISUAL OPERATIONS
//Set inputs to value handed to it or empties them
function toInput(item){
  item? $('#merch-name').val(item.name):$('#merch-name').val('');
  item? $('#count').val(item.count):$('#count').val('');
  item? $('#price').val(toUS(item.price)):$('#price').val('');
}
//Appends item to table
function appendToTable(item){
  var row = '<tr data-index="'+merchandise.indexOf(item)+'">';
  row += '<td>'+item.name;
  row += '<td>'+item.count;
  row += '<td>'+toUS(item.price);
  row += '<td><button class="btn btn-sm btn-primary" value="edit" data-index="'+merchandise.indexOf(item)+'" data-toggle="modal" data-target="#add-edit-modal">Edit</button>';
  row += '<button class="btn btn-sm btn-danger" value="delete" data-index="'+merchandise.indexOf(item)+'"data-toggle="modal" data-target="#delete-modal">Delete</button>';
  $('#list tbody').append(row);
}
//Updates table with data from merchandise list
function updateTable(list){
  $('.merch-table-header ~tr').empty();
  list = list?list:merchandise;
  if(list){
    list.forEach(function(item){
      appendToTable(item);
    })
  }
}
//Sets an error status to inputs and show error message
function hasError(object,error){
  $(object).parent().addClass('has-error');
  $('#error').text(error);
  $('#add-update').attr('disabled',true);
}
//Removes status indication
function removeError(object){
  $(object).parent().removeClass('has-error')
  $('#error').text('');
  $('#add-update').attr('disabled',false);
}
//END VISUAL OPERATIONS
