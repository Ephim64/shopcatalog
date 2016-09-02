var merchandise = [],
count = 0,
action=true;//true = add, false = update
//EVENT BINDING
$(function(){
  //Add new handler
  $('#add-new').click(function(event){
    action = true;
    toInput();
    $('#add-update').text('Add');
    $('#price').removeAttr('data-price');
  })
  //Add or Update handler
  $('#add-update').click(function(event) {
    var item = {'name':$('#merch-name').val(),'count':$('#count').val(),'price':$('#price').attr('data-price')};
    if(item.name && item.count && item.price && action){
    addItem(item);
    appendToTable(item);
    toInput();
  }
  else if(item.name && item.count && item.price && !action){
    if($(this).attr('data-index')) {
      $('tr[data-index="'+$(this).attr('data-index')+'"]').empty();
      updateItem($(this).attr('data-index'),item);
      toInput();
    }
  }
  $('#price').removeAttr('data-price');
  });
  //Applies search filter to merchandise list
  $('#apply-filter').click(function(event){
    var filterString = $('#filter').val();
    if(filterString){
      var filteredList = merchandise.filter(function(item){
        return item.name.toLowerCase().includes(filterString.toLowerCase());
      })
      updateTable(filteredList);
    }
    else updateTable(merchandise);
  })
  //Actions handler
  $('#list').on('click','button',function(){
    if($(this).attr('value') === 'edit'){
      console.log('edit' + $(this).attr('data-index'));
      $('#price').attr('data-price', merchandise[$(this).attr('data-index')].price);
      toInput(merchandise[$(this).attr('data-index')]);
      $('#add-update').attr('data-index',$(this).attr('data-index'));
      action = false;
      $('#add-update').text('Update');
    }
    if($(this).attr('value') === 'delete'&&confirm('Are you willing to remove this item?')){
      removeItem($(this).attr('data-index'));
      updateTable(merchandise);
      toInput();
    }
  });
  //On focusout event handler for price input
  $('#price').focusout(function(event){
    console.log('focusout');
    var tempPrice = $('#price').val();
    tempPrice? $('#price').val(toUS(tempPrice)):$('#price').val('');
    $('#price').attr('data-price',tempPrice);
  })
  $('#price').focusin(function(event){
    console.log('focus in');
    $('#price').attr('data-price')? $('#price').val($('#price').attr('data-price')):$('#price').val('');
  })
  //Order handler
  $('table').on('click','.glyphicon',function(event) {
    if(count%2){
      updateTable(order($(this).attr('data-type')).reverse());
      count++;
    }
    else{
      updateTable(order($(this).attr('data-type')));
      count++;
    }
  });
  $('#merch-name').on('focusout',function(event){
    var reg = /^[^0-9.]{1,15}$/g;
    var name = $('#merch-name').val();
    if(name){
      if(name.length<16){
        if(reg.test(name)){
          $('#add-update').attr('disabled', false);
          removeError(this);
        }
        else hasError(this,'Name can only consist of letters!');
      }
      else hasError(this,'The length of the field can not be greater than 15 symbols!')
    }
    else hasError(this,'Name is blank!')
  })
})
//EVENT BINDING ENDS
//DATA PROCESSING
//Add new item to merchandise list
function addItem(item){
  console.log('add');
  console.log(item.name);
  console.log(item.count);
  console.log(item.price);
  merchandise.push(item);
}
//Updates item in merchandise list
function updateItem(index,item){
  console.log('update');
  merchandise[index] = item;
  appendToTable(item);
}
//Removes item from merchandise list
function removeItem(index){
  console.log('remove');
  console.log(index);
  merchandise = merchandise.filter(function(element){
    return merchandise.indexOf(element) != index;
  });
}
function order(parameter){
  var orderedList = merchandise;
  return orderedList.sort(function(a,b){
    if(a[parameter] > b[parameter]) return 1;
    if(a[parameter]<b[parameter]) return -1;
    return 0;
  })
}
//Converts numbers to us dollars
function toUS(number){
  var regString = /(\d)(?=(\d{3})+\.)/;
  return '$'+ parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,'$&,')
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
  console.log(merchandise.indexOf(item));
  var row = '<tr data-index="'+merchandise.indexOf(item)+'">';
  row += '<td>'+item.name;
  row += '<td>'+item.count;
  row += '<td>'+toUS(item.price);
  row += '<td><button value="edit" data-index="'+merchandise.indexOf(item)+'">Edit</button>';
  row += '<button value="delete" data-index="'+merchandise.indexOf(item)+'">Delete</button>';
  $('#list tbody').append(row);
}
//Updates table with data from merchandise list
function updateTable(list){
  console.log('update table');
  console.log(!list);
  recreateTable();
  if(list){
    list.forEach(function(item){
      appendToTable(item);
    })
  }
}
//Recreates table header row
function recreateTable(){
  var header = '<tr>';
  header += '<td>Name<span class="glyphicon glyphicon-collapse-down" aria-hidden="true" data-type="name" data-order>';
  header += '<td class="count"><span class="glyphicon glyphicon-collapse-down" aria-hidden="true" data-type="count" data-order>'
  header += '<td>Price<span class="glyphicon glyphicon-collapse-down" aria-hidden="true" data-type="price" data-order>';
  header += '<td>Actions';
  $('#list tbody').empty();
  $('#list tbody').append(header);
}
//Sets an error status to inputs and show error message
function hasError(object,error){
  $(object).addClass('form-control');
  $('#error').text(error);
  $('#add-update').attr('disabled',true);
}
//Removes status indication
function removeError(object){
  $(object).removeClass('form-control')
  $('#error').text('');
}
//END VISUAL OPERATIONS
