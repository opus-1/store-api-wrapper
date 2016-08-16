function getjQuery(){
  var ajax = []
  return {
    fakeAjaxResponse: null,
    ajax: function(query){
      var fakeAjaxResponse = this.fakeAjaxResponse;
      ajax.push(query);
      
      return {
        then: function(callback){
          if(fakeAjaxResponse){
            callback(fakeAjaxResponse);  
          }else{
            callback(query);
          }
        }
      }
    },
    responses: ajax,
    lastResponse: function(){
      return this.responses[this.responses.length - 1]
    }
  }
}

module.exports = getjQuery