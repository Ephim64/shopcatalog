var table,
merchandise = [],
tempItem = {};
//EVENT BINDING
$(function(){
  $('#add-update').click(function(event) {
    var item = {'name':$('#merch-name').val(),'count':$('#count').val(),'price':$('#price').val()};
    if(item.name && item.count && item.price){
    addItem(item);
    appendToTable(item);
    toInput();
  }
  });
  $('#list').on('click','button',function(){
    if($(this).attr('value') === 'edit'){
      removeItem($(this).attr('data-index'));
      updateTable();
    }
    if($(this).attr('value') === 'delete'&&confirm('Are you willing to remove this item?')){
      removeItem($(this).attr('data-index'));
      updateTable();
    }
  });
})
$(function(){
  table = $('#list').clone(true);
})
//EVENT BINDING ENDS
//DATA PROCESSING
function addItem(item){
  console.log('add');
  console.log(item.name);
  console.log(item.count);
  console.log(item.price);
  merchandise.push(item);
}
function updateItem(index,item){
  console.log('update');
  merchandise[index] = item;
}
function removeItem(index){
  console.log('remove');
  console.log(index);
  merchandise = merchandise.filter(function(element){
    return merchandise.indexOf(element) != index;
  });
}
//END DATA PROCESSING
//VISUAL OPERATIONS
function toInput(item){
  item? $('#merch-name').val(item.name):$('#merch-name').val('');
  item? $('#count').val(item.count):$('#count').val('');
  item? $('#price').val(item.price):$('#price').val('');
}
function appendToTable(item){
  console.log(merchandise.indexOf(item));
  var row = '<tr>';
  row += '<td>'+item.name;
  row += '<td>'+item.count;
  row += '<td>'+item.price;
  row += '<td><button value="edit" data-index="'+merchandise.indexOf(item)+'">Edit</button>';
  row += '<button value="delete" data-index="'+merchandise.indexOf(item)+'">Delete</button>';
  $('#list tbody').append(row);
}
function updateTable(){
  console.log('update table');
  console.log(!merchandise);
  recreateTable();
  if(merchandise){
    merchandise.forEach(function(item){
      appendToTable(item);
    })
  }
}
function recreateTable(){
  var header = '<tr>';
  header += '<td>Name<span>';
  header += '<td class="count"><span>'
  header += '<td>Price<span>';
  header += '<td>Actions';
  $('#list tbody').empty();
  $('#list tbody').append(header);
}
//END VISUAL OPERATIONS
