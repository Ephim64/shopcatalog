$(function(){
//VARIABLES
  var table = $('#list tbody').clone();
  var merchandise = [];
  var action = true;//fals = update true = add
  var purgItem = {};
//EVENTS
  $('#add-update').click(function(e){
    var item = {'name':$('#merch-name').val(),'count':$('#count').val(),'price':$('#price').val()};
    if(item.name && item.price && item.count){
      if(action) addItem(item);
      else updateItem(item,purgItem);
    }
  });
  $('#list').on('click','button',function(e){
    console.log($(this).attr('value'));
    if($(this).attr('value')==='edit'){
      toInput(merchandise[$(this).attr('data-index')]);
    }
    else if($(this).attr('value')==='delete'){
      removeItem($(this).attr('data-index'));
      updateTable();
    }
  });
  $('#price').on('focusout',function(){
    console.log('focus out');
    $('price').val('$ '+$('price').attr('data-price').replace(/(\d)(?=(\d{3})+\.)/g, '$&,'))
  })
//FUNCTIONS
  function addItem(item){
    merchandise.push(item);
    appentToTable(item);
    toInput();
  }
  function updateItem(item,newItem){
    console.log('update');
  }
  function removeItem(index){
    console.log(merchandise.length === 1);
    if(merchandise.length === 1) merchandise = [];
    else{
      merchandise = merchandise.filter(function(element){
        return merchandise.indexOf(element) != index;
      })
    }
  }
  function appentToTable(item){
    var print = '<td>'+item.name+'</td>'+'<td>'+item.count+'</td>'+'<td>'+item.price+'</td>';
    print += '<td><button value="edit" data-index="'+merchandise.indexOf(item)+'">Edit</button>'
    print += '<button value="delete" data-index="'+merchandise.indexOf(item)+'">Delete</button></td>'
    $('#list tbody').append('<tr data-index=\''+merchandise.indexOf(item)+'\'>');
    var row = $('[data-index=\''+merchandise.indexOf(item)+'\']');
    row.append(print);
  }
  function toInput(item){
    item? $('#merch-name').val(item.name):$('#merch-name').val('');
    item? $('#price').val(item.price).attr('data-price',item.price):$('#price').val('');
    item? $('#count').val(item.count):$('#count').val('');
  }
  function updateTable(){
    $('#list tbody').replaceWith(table);
    if(merchandise) merchandise.forEach(function(element){
      appentToTable(element);
    })
    else $('#list tbody').empty();
  }
  $('#add-new').click(function(){
    var number = 1342568.255;
    var reg = '(\d)(?=(\d{3})+(?:\.\d+)?&)'
    console.log('$ ' + number.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$&,'));
  })
})
