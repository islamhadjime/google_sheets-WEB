

let rs_arry = [
    //  * < Список районов     
    {"id":"id_1","city":"*"},
    {"id":"id_2","city":"*"},
    {"id":"id_3","city":"*"},
    {"id":"id_4","city":"*"},
    {"id":"id_5","city":"*"},
    {"id":"id_6","city":"*"},
    {"id":"id_7","city":"*"},
    {"id":"id_8","city":"*"},
    {"id":"id_9","city":"*"},
    {"id":"id_10","city":"*"},
    {"id":"id_10","city":"*"},
]




function render(label){
  let tmp;
  tmp = HtmlService.createTemplateFromFile('page')
  tmp.isMaps = label
  tmp.topData = top_data(label)
  tmp.listApp = allBottom_sheets(label)
  tmp.setIngdata = getSetting()
  return  tmp.evaluate()

}



function doGet(e){
  let label;

  if(e.parameters.v == 'dnevnik'){label = 'Отчет Дневник'}
  else if(e.parameters.v == 'pn'){label = 'Пон'}
  else if(e.parameters.v == 'vt'){label = 'Вто'}
  else if( e.parameters.v == 'sr' ){label = 'Сре'}
  else if( e.parameters.v == 'cht' ){label = 'Чет'}
  else if( e.parameters.v == 'pt' ){label = 'Пят'}
  else if( e.parameters.v == 'sb' ){label = 'Суб'}
  else{label = 'По республику'}

  return render(label)
}





function search_rs(item,title){
  if(item.includes(title)){
    return true
  }
}
function average(nums){
  return Math.floor(nums.reduce((a,b)=> {return Number(a)+Number(b)})/nums.length)
}

function filter_mapsFun(ne){
  let newList = []
  for( let item of ne){
    if(item[2] != 'Выходные'){
      newList.push(item)
    }
  }
  return newList
}



function count_mapsList(objectS){
  let avg_listRes  = {}
  for(let item in objectS){
    let x = objectS[item].count
    let y = average(x.map(s =>{ return average(s)}))
    avg_listRes[objectS[item].id] ={
      avg_count:y
    }
  }
  return avg_listRes
}


function maps_sheets(evenDay){
  let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(evenDay)

  let object_all = {}
  let all_range = app.getRange(3,2,app.getLastRow()-2,8).getValues()
  let new_list = all_range.map(element => {return [...element.slice(0,5), ...element.slice(6,8)]})
  for(let item in rs_arry){
    let a = new_list.filter(el => { return search_rs(el[0].split(" "),rs_arry[item].city) })
    if(a.length != 0){
      let fuck_mass = a.map(fack_item =>{ return fack_item.slice(1,fack_item.length)})
      object_all[rs_arry[item].id] ={
        id:rs_arry[item].id,
        count:fuck_mass
      }
    }
  }
  return count_mapsList(object_all)
}

function top_data(evenDay){
  let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(evenDay)

  let numver = (evenDay == 'По республику' || evenDay == 'Отчет Дневник') ? 6 : 7;
  let dataGet  = app.getRange(1,3,1,numver).getValues()
  dataGet[0].map(item =>console.log(Number(item)))
  if(evenDay == 'Отчет Дневник'){
    return dataGet[0].map(item=>{return Math.floor(Number(item )*100) })
  }else if(evenDay == 'По республику'){
    return dataGet[0].map(item =>{return Number(item)})
  }
  let dataSet = dataGet.map(element => {return [...element.slice(0,4), ...element.slice(5,7)]})[0]
  let context = dataSet.map(item=>{return Math.floor(Number(item )*100) })
  return context
}

function makrosBlock(evenDay){
  let sert_list = {
    getCount:0,
    setCount:0,
    sumCount:0,
  }
  let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(evenDay)

  let all_range = app.getRange("G1").getValue()
  let resize = all_range.split(' ')
  sert_list ={
    getCount:resize[0],
    setCount:resize[2],
    sumCount:Number(resize[2]) - Number(resize[0])
  }
  return sert_list;
}


function allBottom_sheets(evenDay){
  let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(evenDay)
  let numver = (evenDay == 'По республику' || evenDay == 'Отчет Дневник') ? 8 : 9;
  let data  = app.getRange(3,1,app.getLastRow()-2,numver).getValues()
  let title  = app.getRange(2,1,1,numver).getValues()
  let context = {
    thead:title[0],
    tbody:data
  }
  return context
}



function getSetting(){
    let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName('места-элк')
    let timeData = app.getRange('B1').getValue()
    let timeStatic = app.getRange('B2').getValue()
    let listRount = app.getRange("A4:F4").getValues()[0]
    return {timeData,timeStatic,listRount}
}


function data_getSet(day,name){
    let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName('места-элк')
}


function filterSheets(evenDay,getEval){
  let app = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(evenDay)

  let header = app.getRange('C2:I2').getValues()
  let table = app.getRange("B3:I37").getValues()
  let filter = table.filter(el => el[0] == getEval)
  return {header,filter}

}







function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
