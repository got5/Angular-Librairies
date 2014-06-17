var NoteCtrl = function($scope,$window){
    var ls = $window.localStorage,key,val,notes = {};


    var init = function(){

        if(!ls){
            return;
        }

        for (var i = 0; i < ls.length; i++){
            key = ls.key(i);
            val = ls.getItem(key);
            notes[key]=val;
        }
        return JSON.stringify(notes);
    };

    $scope.saveNotes = function(notesStr){
        if(!ls){
            return;
        }
        var notes;
        try{
           notes =JSON.parse(notesStr);
        }catch(e){
            $window.alert("Error : Unable to parse your notes");
            return;
        }

        for (var key in notes) {
            ls[key] = notes[key];
        }
    };

    $scope.notes = init();


};
NoteCtrl.$inject = ['$scope','$window'];