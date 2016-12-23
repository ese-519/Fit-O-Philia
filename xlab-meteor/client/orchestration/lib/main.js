var count = []; //a global array to save the count of each effect, for register id for each draggable object
var loadData = false; //load flag for metadata
var namestack = [];
var dictstack = [];
var dictstack1 = [];
var dictstack2 = [];
var saveEvent = []; 
var dur;
var effectvalue;
var deletion;
var jsonUpdateStack = null;
var abstracteventstack = []; //saved abstractevent, with attr of id, start_time, name,type
var select = 0;
var k = 0;
var k1 = 0;
var abstractlength = 0;
var timelinelength = window.innerWidth * 0.85; //px length of the slider
var video_url = '';
var video_name = '';
var video_id = '';
var EPSILON = 0.2;
var prev_id = '';
var timelinedrag_width = 0;
var loadVideo = false; //load flag for video 
var totalTimelineLayers = 0;
var cActiveLayer = 0;
var drageffect = "";
var isEffectDraging = false;
var colorArray = {"a":"123"};
var SelectedEffectOnDictionary = "";

var currentSelectedModule = 0;
//the priority queue to save all the draggable objects, use object id as data, use offset().left as priority, the draggable object with the smallest offset will be poped first
var heap = new BinaryHeap(
    function(element) {
        return element.offset;
    },
    function(element) {
        return element.id;
    },
    'offset'
);

Template.addvideo.events({
    'click #cancelvideo': function() {
        Session.set('renderTemplate', 'videoDetails');
    },
    'submit form': function(){
        event.preventDefault();
        var newurl = event.target.url.value;
        var newname = event.target.newname.value;
        //var newimage = event.target.thumbnail.value;
        var newid = Math.floor(Date.now() / 1000)
        console.log('url: ' +newurl+ ' name of clip ' +newname);
        console.log('id: ' +newid);
        //console.log('this is current data ' +JSON.stringify(OrchVideos.findOne({})));
        var newstring = '{"id" : "'+newid+'", "videoSource" : "'+newurl+'",  "metaSource" : "", "name" : "'+newname+'", "rating" : "", "thumbnail" : "/images/play.jpg"}';
        console.log('newstring: '+newstring);
        var metaData = OrchVideos.findOne({});
        var json = $.parseJSON(newstring);
        metaData.videos[newid] = json
        console.log('metaData: '+JSON.stringify(metaData));
        OrchVideos.update({
       _id: metaData._id
     }, {
         $set: {
            videos: metaData.videos
         }
     });
    }
});

Template.orchestration.events({
    'click #addTotimeline': function() {
        console.log('value of select is' + select);
        onclickaddtotimeline(select);
    },
    'click #clear': function() {
        clearAll();
    },
    'click #updateData': function(){
            updateAbstractStack();
    },

    'click #Creepy_vest': function() {
        vestVanish();
        effectvalue = document.getElementById("Creepy_vest").value; 
    },
    'click #shooting_vest': function() {
        vestVanish();
        effectvalue = document.getElementById("shooting_vest").value;
    },
    'click #LeftStrongExplode_vest': function() {
        vestVanish();
        effectvalue = document.getElementById("LeftStrongExplode_vest").value;
    },
    'click #RightSideExplode_vest': function() {
        vestVanish();
        effectvalue = document.getElementById("RightSideExplode_vest").value;
    },
    'click #kick_light': function() {
        lightVanish();
        effectvalue = document.getElementById("kick_light").value; 
    },
    'click #shooting_light': function() {
        lightVanish();
        effectvalue = document.getElementById("shooting_light").value; 
    },
    'click #dodging_bullets_light': function() {
        lightVanish();
        effectvalue = document.getElementById("dodging_bullets_light").value; 
    },
    'click #transform_light': function() {
        lightVanish();
        effectvalue = document.getElementById("transform_light").value; 
    },
    'click #wiggle_couch': function() {
        couchVanish();
        effectvalue = document.getElementById("wiggle_couch").value; 
    },
    'click #knife_couch': function() {
        couchVanish();
        effectvalue = document.getElementById("knife_couch").value; 
    },
    'click #shoot_couch': function() {
        couchVanish();
        effectvalue = document.getElementById("shoot_couch").value; 
    },
    'click #kick_couch': function() {
        couchVanish();
        effectvalue = document.getElementById("kick_couch").value; 
    },
    'click #lights': function() {
        lights();
    },
    'click #vest': function() {
        vest();
    },
    'click #couch': function() {
        couch();
    },
    'click #removeFromtimeline': function() {
        onclickremovefromtimeline();
    },
    'click #switch': function() {
        switchElement();
    },
    'click #done': function() {
        done();        
    },

    'click #loadData': function() {
        load_Data();
    },
    'click #saveData': function() {
        saveData();
    },
    'click #playlist': function() {
        Session.set('renderTemplate', 'videoDetails');
        abstracteventstack = [];
        count = [];
        namestack = [];
        dictstack = [];
        dictstack1 = [];
        dictstack2 = [];
        clearAll();
    }
});

Template.orchestration.helpers({

    name: function() {
        return Session.get('videoName');
    },
    source: function() {
        return Session.get('videoSource');
    }

});

Template.orchestration.rendered = function() {
    $(function() {
        //this is where everything starts

        //video_id = '2089841711'; //default video
        var alreadyDisplayed = [];
        video_id = Session.get('id');
        console.log('this is video_id ' +video_id);
        //video_url = 'https://s3.amazonaws.com/xlab-media/matrixClip.mp4'; //default url
        var v = document.getElementById('videoId');
        console.log('is this v' +v);
        pageInit(v);


        v.ontimeupdate = function() {
            

                update();
            }

             //ontimeupdate is called whenever the video is playing
        $('#effect_list_wrapper_lights').hide();
        $('#effect_list_wrapper_vest').hide();
        $('#effect_list_wrapper_couch').hide();
        $('#effect_list_wrapper_duration').hide();
        $('#presets').hide();
        $('#presets1').hide();
        $('#presets2').hide();
        
    });
}

function vestVanish(){
    $('#effect_list_wrapper_vest').hide();
    $('#effect_list_wrapper_duration').show();
    $('#presets1').hide();
}

function lightVanish(){
    $('#effect_list_wrapper_lights').hide();
    $('#effect_list_wrapper_duration').show();
    $('#presets').hide();
}

function couchVanish(){
    $('#effect_list_wrapper_couch').hide();
    $('#effect_list_wrapper_duration').show();
    $('#presets2').hide();
}

function vestAppear() {
    $('#effect_list_wrapper_vest').show();
    $('#effect_list_wrapper_duration').hide();
    $('#presets1').show();
}

function lightAppear(){
    $('#effect_list_wrapper_lights').show();
    $('#effect_list_wrapper_duration').hide();
    $('#presets').show();
}

function couchAppear(){
    $('#effect_list_wrapper_couch').show();
    $('#effect_list_wrapper_duration').hide();
    $('#presets2').show();
}

function done() {
    dur = /*$("#select-result").text();*/ $("#effect_list_duration option:selected").text();
    console.log('this is dur' + dur);
    //transform();
    if (select == 1) {
        onclickaddtotimeline(select);
        lightAppear();
    }
    else if (select == 2) {
        onclickaddtotimeline(select);
        vestAppear();
    }
    else if(select == 3) {
        onclickaddtotimeline(select);
        couchAppear();
    }
    

}

function clearAll() {
    for (var i in count) {
            if (count[i].cnt > 0) {
                for (var j = 1; j <= count[i].cnt; ++j) {
                    var k = 0;
                    //delete the jquery draggable object
                    if ($('#' + count[i].name + j).length) {
                        $('#' + count[i].name + j).remove();
                    }

                    for (k = 0; k < abstracteventstack.length; ++k) {
                        if (abstracteventstack[k].id == (count[i].name + j))
                            break;
                    }

                    if (k > -1) abstracteventstack.splice(k, 1);

                }
                count[i].cnt = 0;
            }
        }
}

function lights() {
    $('#effect_list_wrapper_lights').show();
    $('#presets').show();
    $('#presets1').hide();
    $('#presets2').hide();
    $('#effect_list_wrapper_vest').hide();
    $('#effect_list_wrapper_couch').hide();
    select = 1;
}

function vest() {
    $('#effect_list_wrapper_vest').show();
    $('#effect_list_wrapper_couch').hide();
    $('#effect_list_wrapper_lights').hide();
    $('#presets').hide();
    $('#presets2').hide();
    $('#presets1').show();
    select = 2;
    //$('#presets').show();
}

function couch() {
    $('#effect_list_wrapper_couch').show();
    $('#effect_list_wrapper_lights').hide();
    $('#effect_list_wrapper_vest').hide();
    $('#presets1').hide();
    $('#presets').hide();
    $('#presets2').show();
    select = 3;
    //$('#presets').show();
}
var prevTime = 0;
function update() {
    var v = document.getElementById('videoId');
    $("#slider").slider("value", v.currentTime);  
     var val = $('#slider').slider("option", "value");
    moveneedle(val, v.duration);
 

    //Check the draggable starting time.
    update_start_time();
    var curTime = Math.floor(v.currentTime);

  //  var test_string = '{"test":{';
  //  console.log('this is abstracteventstack' + JSON.stringify(abstracteventstack));
    // console.log('currentTime : ' + v.currentTime);
   // console.log(jsonUpdateStack);
    if (jsonUpdateStack != null){
        if(jsonUpdateStack[curTime] != undefined ){
            if(prevTime != curTime){
                prevTime = curTime;
                console.log(jsonUpdateStack[curTime]);
                Meteor.call('updateTimeAndEvent', 'xlab_module_3', curTime, jsonUpdateStack[curTime]); 

            }

        }
    

    }
    // for(var i in abstracteventstack)
    // {
    //     if(abstracteventstack[i].start_time>v.currentTime - EPSILON && abstracteventstack[i].start_time < v.currentTime+EPSILON && prev_id != abstracteventstack[i].id)
    //     {
            
    //         for(var j in dictstack)
    //         {
    //             if(dictstack[j].name == abstracteventstack[i].name)
    //             {
    //                 test_string = test_string + '"addr":{"duration":"' + (dictstack[j].addr_duration * 1000).toString() + '","pattern":"' + dictstack[j].addr_pattern + '","color":"' + dictstack[j].addr_color + '","direction":"' + dictstack[j].direction + '","shape":"' + dictstack[j].shape + '"},"nonAddr":{"duration":"' + (dictstack[j].nonAddr_duration * 1000).toString() + '","pattern":"' + dictstack[j].nonAddr_pattern + '","color":"' + dictstack[j].nonAddr_color + '"}}}';
    //                 //console.log(dictstack[j].name);
    //               //  var test_json = $.parseJSON(test_string);
    //                 console.log('this is test_json' + test_json);
    //             //    Meteor.call('updateTimeAndEvent', 'xlab_module_3', 0, test_json.test); 
    //                 prev_id = abstracteventstack[i].id;
    //                 break;
    //             }
    //         }
    //     }
    // }
}

function initslider(duration) {

var totalLen = $('#effecttimelines').width();
    $("#slider").slider({
        min: 0,
        max: duration,
        animate: true,
        step: 0.1,
        slide : function(e, ui) { 
           //user is dragging
                moveneedle(ui.value,duration);
           },
        change: function(event, ui) {
            $("#amount").val(ui.value);
  
            if (event.originalEvent) {
                videoSkip(ui.value);
            }

        }
    }).width(totalLen + 'px'); //setting the width of the slider
}

function moveneedle(val,duration){
        var needle = $('#needle');
    var totalLen = $('#effecttimelines').width();
    var ratio = totalLen / duration / 1.0;
 needle.css(({left:val * ratio +78}));    
}

function initializeTimeCode(videolen){
    var time = $('#time');
    var timeCodeStepSize = 8;
    var totalTimelineLength = $('#timecode_bar').width();
    var s = parseInt(videolen / timeCodeStepSize);
    var mspacing = totalTimelineLength / (timeCodeStepSize+1);
    var str = "";
    console.log(s);
    time.css("word-spacing", mspacing+"px");
    for(var i = 0 ; i < timeCodeStepSize ; i++){
        str += " " + "00:00:"+(i * s);
    }
    time.html(str);
}
function getValue(key, obj){
    for(var p in obj){
        if(key == p)
            return obj[key];
    }
    return "";
}

function in_array(key, obj){
    for(var p in obj){
        if(p == key)
            return true;
    }
    return false;
}


function delay() {
        return;
    }
    //TODO: finish the update on the html/jquery elements
function videoSkip(time) {
    document.getElementById('videoId').currentTime = time;
    //$("#slider").slider('refresh');
}


function pageInit(video) {

    //initialize slider
    video.addEventListener('loadedmetadata', function() {
        if (loadVideo) $("#slider").slider("option", "max", video.duration);
        else {
            initslider(video.duration);
            $("#amount").val($("#slider").slider("value"));
            setTimeout(load_Data,300);
            //setTimeout(resetMainPanel, 310);
            setTimeout(refreshList,320);
     
        }
    });
}


function refreshList(){
    // $("#effect_list").selectbox("detach");
    $("#effect_list").empty();
    $("#effect_list_vest").empty();
    $("#effect_list_couch").empty();
    //$("#effect_list_duration").empty();
    //console.log('this is name' + JSON.stringify(dictstack[1].name))
    /*for (var name in namestack) {
        console.log('this is name' + namestack[name]);
       $("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name]));
       //$("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name])); //fastfind fastdelete

    }*/
    for (var j in dictstack) {
        $("#effect_list").append($("<option></option>").attr("value",j).text(dictstack[j].name));
    }
    $("#effect_list").selectbox();

    for (var j in dictstack1) {
        $("#effect_list_vest").append($("<option></option>").attr("value",j).text(dictstack1[j].name));
        
    }
    $("#effect_list_vest").selectbox();

    for (var j in dictstack2) {
        $("#effect_list_couch").append($("<option></option>").attr("value",j).text(dictstack2[j].name));
        
    }
    $("#effect_list_couch").selectbox();

    for (j=1; j<10; j++) {
        $("#effect_list_duration").append($("<option></option>").attr("value",j).text(j));
    }
    $("#effect_list_duration").selectbox();
    
    // $("#effect_list").selectbox("attach");
}

function resetMainPanel(){

         $('#Panel').height(($(window).height() - $('#MainTimeLineFooter').height() - 10));
}

function onclickaddtotimeline(select) {
    if (select == 1){

    //var selectedId = /*$("#select-result").text();*/ $("#effect_list option:selected").text();
    var selectedId = effectvalue;
    if (selectedId != 'none' && selectedId != null){   //add a new draggable
        console.log(selectedId.toString());
        abstractlength = abstracteventstack.length;
        console.log('length at beginning' + abstractlength);
        for (var p in dictstack) {
            //console.log(p +":" +dictstack[p].name);
            if (selectedId == dictstack[p].name) {   //locate the selected effect 
                console.log("locate the selected effect");
                //var duration = Math.max(dictstack[k].addr_duration, dictstack[k].nonAddr_duration);
                //get current active layer
                console.log(" current active layer is " + cActiveLayer)
                //add_draggable(selectedId, 0, duration, cActiveLayer);
                //applyColors(selectedId);
                /*var abstractlength = abstracteventstack.length;
                console.log('this is length' + abstractlength);*/
                initializeColor(selectedId);
                for (var j in count) {
                    console.log('this is selectedId' + selectedId);
                    if (count[j].name == selectedId) {

                        add_draggable(selectedId, 0, dur, 1, abstractlength);
                        applyColors(selectedId);
                        abstracteventstack.push(new abstractevent(selectedId, selectedId + count[j].cnt, 0, 'abstract_event',1, 'light', dur));                        k = abstracteventstack.length;
                        }
                        else {
                            console
                            k = abstracteventstack.length;
                        }
                    }
                    //abstractlength = k;
                    console.log('this is new length' + k);
                    console.log('this is old length' + abstractlength);
                   
                if ( k == abstractlength ) {
                    count.push(new counter(selectedId));
                    namestack.push(selectedId);
                    abstracteventstack.push(new abstractevent(selectedId, selectedId + '1', 0, 'abstract_event',1, 'light',dur));
                    k = 0;
                    console.log('this is count' + JSON.stringify(count));
                    add_draggable(selectedId, 0, dur, 1, abstractlength);
                    applyColors(selectedId);
                    //abstractlength = abstracteventstack.length;
                                    }

            } 
        }
    }
}
    if (select == 2){

    //var selectedId = /*$("#select-result").text();*/ $("#effect_list_vest option:selected").text();
    var selectedId = effectvalue;
    //var selectedId = document.getElementById("transform").value;
    if (selectedId != 'none' && selectedId != null){   //add a new draggable
        console.log(selectedId.toString());
        abstractlength = abstracteventstack.length;
        for (var p in dictstack1) {
            console.log(p +":" +dictstack1[p].name);
            if (selectedId == dictstack1[p].name) {   //locate the selected effect 
                console.log("locate the selected effect");
                //var duration = dictstack1[k].duration;
                //get current active layer
                console.log(" current active layer is " + cActiveLayer)
                //add_draggable(selectedId, 0, duration, cActiveLayer);
                initializeColor(selectedId);
                
                for (var j in count) {
                    console.log('this is count' + count[j].name);
                    if (count[j].name == selectedId) {
                        add_draggable(selectedId, 0, dur, 2, abstractlength);
                        applyColors(selectedId);
                        abstracteventstack.push(new abstractevent(selectedId, selectedId + count[j].cnt, 0, 'abstract_event',2, 'vest',dur));
                        k = abstracteventstack.length;
                    }
                    else {
                        k = abstracteventstack.length;
                    }

                }
                if ( k == abstractlength ) {
                    count.push(new counter(selectedId));
                    abstracteventstack.push(new abstractevent(selectedId, selectedId + '1', 0, 'abstract_event',2, 'vest',dur));
                    k = 0;
                    console.log('this is count' + JSON.stringify(count));
                    add_draggable(selectedId, 0, dur, 2, abstractlength);
                    applyColors(selectedId);
                    
                }
            }
        }
    }
}
    if (select == 3){

    //var selectedId = /*$("#select-result").text();*/ $("#effect_list_couch option:selected").text();
    var selectedId = effectvalue;
    if (selectedId != 'none' && selectedId != null){   //add a new draggable
        console.log(selectedId.toString());
        for (var p in dictstack2) {
            console.log(p +":" +dictstack2[p].name);
            if (selectedId == dictstack2[p].name) {   //locate the selected effect 
                console.log("locate the selected effect");
                //var duration = dictstack2[k].duration;
                //get current active layer
                //console.log(" current active layer is " + cActiveLayer)
                //add_draggable(selectedId, 0, duration, cActiveLayer);
                initializeColor(selectedId);
                for (var j in count) {
                    if (count[j].name == selectedId){
                        add_draggable(selectedId, 0, dur, 3, abstractlength);
                        applyColors(selectedId);
                        abstracteventstack.push(new abstractevent(selectedId, selectedId + count[j].cnt, 0, 'abstract_event', 3, 'couch',dur));
                        k = abstracteventstack.length;
                    }
                    else {
                        k = abstracteventstack.length;
                    }
                }
                if ( k == abstractlength ) {
                    count.push(new counter(selectedId));
                    abstracteventstack.push(new abstractevent(selectedId, selectedId + '1', 0, 'abstract_event', 3, 'couch',dur));
                    k = 0;
                    console.log('this is count' + JSON.stringify(count));
                    add_draggable(selectedId, 0, dur, 3, abstractlength);
                    applyColors(selectedId);
                    //abstractlength = abstracteventstack.length;
                }
            }
        }
    }
}
//console.log('this is abstracteventstack' + JSON.stringify(abstracteventstack));
//console.log('this is select' + select);
}

function onclickremovefromtimeline() {
    var selectedEffect =  deletion;  //$("#select-result").text();
    removeFromTimeLine(selectedEffect); //remove all the draggable from the timeline but still keep the timeline div
}

function removeFromTimeLine(selectedId) {

    if (selectedId != 'none' && selectedId != null) {

        for (var i in count) {
            if (count[i].name == selectedId && count[i].cnt > 0) {
                for (var j = 1; j <= count[i].cnt; ++j) {
                    var k = 0;
                    //delete the jquery draggable object
                    if ($('#' + selectedId + j).length) {
                        $('#' + selectedId + j).remove();
                    }

                    for (k = 0; k < abstracteventstack.length; ++k) {
                        if (abstracteventstack[k].id == (selectedId + j))
                            break;
                    }

                    if (k > -1) abstracteventstack.splice(k, 1);

                }
                count[i].cnt = 0;
            }
        }

        $("#select-result").empty();
        $('#selecteffect').selectable("refresh");
    }

}



function switchElement(id){
    id = id || 0;

    $("#effect_list").find("option[value='"+id+"']").attr("selected", "selected");
    $("#effect_list").selectbox("detach");
     $("#effect_list").selectbox("attach");
     //continue here monday for making the elements corresponding to the timeline
}

function add_draggable(selectedId, start_time, duration, layerid, uid) //start_time and duration are floats
    {
        if(selectedId != undefined && layerid != undefined ){
        console.log("adding draggable , current layer is " + layerid);
        var v = document.getElementById('videoId');
        var display_width = ((duration / v.duration) * timelinelength).toString(); //handle the width of the draggable object according to the effect duration
        
        var pixel_per_sec = parseFloat(timelinelength / v.duration);
        
        var cnt

   
        

        for (var i in count) {

            if (count[i].name == selectedId) { 
                cnt = ++count[i].cnt;
             }

        }


         $('#layer_'+layerid).append("<div id=\"" + selectedId +  cnt + "\"  class=\"draggable timelineContent "+selectedId+"\" layerid=\""+layerid+"\" start=\""+start_time+"\" duration=\""+duration+"\" sel=\""+selectedId + cnt+"\"><p>"+selectedId+"</p></div>");
         //bind events
        
        if(display_width  > (selectedId.length * 10)){
            $('#'+selectedId +  cnt +" p").css("visibility","visible");
        } 

        var display_offset = ((start_time / v.duration) * timelinelength + $('#' + selectedId + cnt).parent().offset().left).toString();
         $('#' + selectedId + cnt).resizable({
            resize: function(event, ui) {
                ui.size.height = ui.originalSize.height;
                ckdisplayText(this.id, selectedId.length * 6, ui.size.width);
            }
        });
        
         

        $('#' + selectedId + cnt).draggable({
            axis: "x",
            drag: function(){
           drageffect = this.id;
           console.log('this is drageffect' + drageffect);
            isEffectDraging = true;},
            grid: [pixel_per_sec, 0] //make sure the draggable object moves every time with one second
        }).width(display_width + 'px').offset({
            left: display_offset
        });

        
         $( "#"+selectedId+cnt ).bind( "click", function() {
            console.log('this is id' + selectedId);
            deletion = selectedId;
            var sid = getSIDByName(selectedId);
            console.log('this is sid' + sid);
            var uniqueid = uid;
            console.log('this is unique id' + uid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          }); 
         $( "#"+selectedId+cnt ).bind( "mouseup", function() {
            var sid = getSIDByName(selectedId);
            console.log(sid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          });

        $("#select-result").empty();
    }
}



function ckdisplayText(eid, textlength, containerLength){
    if((textlength +30)> containerLength){
        $('#'+eid +" p").css("visibility","hidden");
    } else{
        $('#'+eid +" p").css("visibility","visible");
    }
}
function highLight(div){
   $(div).animate({
          backgroundColor: "rgba(251,238,22,0.2)",
          color: "#fff"
     }, 100,function(){
        $(div).animate({backgroundColor: "rgba(0,0,0,0)"},600)
     });
}
function getSIDByName(name){
    for(i in namestack){
        if(namestack[i] == name){
            return i;
        }
    }
    return 0;
}


function load_Data() {

    if (!loadData) {
        loadTimestamp(video_id);
        loadDictionary();
        setTimeout(loaddraggable, 500); //wait till the above json request finishes

       }
}

function loaddraggable() {
    //add draggable here (use the global data structures saved from json files)
    console.log(print_r(colorArray));
    for (var i in abstracteventstack) {
        //var name = abstracteventstack[i].name;
        if (abstracteventstack[i].effect == 'light'){
            var name = abstracteventstack[i].name;
        for (var k in dictstack) {
            if (name == dictstack[k].name) {
                var duration = abstracteventstack[i].duration;
                //var duration = Math.max(dictstack[k].addr_duration, dictstack[k].nonAddr_duration);
                add_draggable(name, abstracteventstack[i].start_time, duration, abstracteventstack[i].layerid, i);
                //add_draggable(name, abstracteventstack[i].start_time, duration, dictstack[k].layer);
                applyColors(name);
            }
        }
    }
          if (abstracteventstack[i].effect == 'vest'){
            console.log('this is vest' + abstracteventstack[i].name);
          var name = abstracteventstack[i].name;      
        for (var k in dictstack1) {
            if (name == dictstack1[k].name) {
                var duration = abstracteventstack[i].duration //dictstack1[k].duration;
                add_draggable(name, abstracteventstack[i].start_time, duration, abstracteventstack[i].layerid, i);
                    //add_draggable(name, abstracteventstack[i].start_time, duration, dictstack1[k].layer);
                applyColors(name);
                
            } 
        }}
        if (abstracteventstack[i].effect == 'couch'){
            console.log('this is couch' + abstracteventstack[i].name);
            var name = abstracteventstack[i].name;
        for (var k in dictstack2) {
            if (name == dictstack2[k].name) {
                var duration = abstracteventstack[i].duration;
                add_draggable(name, abstracteventstack[i].start_time, duration, abstracteventstack[i].layerid, i);
                //    add_draggable(name, abstracteventstack[i].start_time, duration, dictstack2[k].layer);
                applyColors(name);
                
            } 
        }}

    }
}


function loadDictionary() {
    //Meteor.log.info(JSON.stringify(orch_dict_data)); //for testing
    var dictData = Dictionary.findOne({});
    //console.log(dictData.dict);
    initEffectFactory(dictData.dict);
}

function loadTimestamp(video_id) {
    //Meteor.log.info(JSON.stringify(orch_time_data)); //for testing

    //check if video_name is already in the cloud. if it's already in the cloud, we load it. if not, we load a blank timestamp json object
    //if orch_time_data has video_name object
    var metaData = Metadata.findOne({});
    console.log(metaData.meta);
    if(metaData.meta.hasOwnProperty(video_id))
    {
        console.log('video exists');
        console.log('this is metadata' + JSON.stringify(metaData.meta[video_id]));
        initTimeline(metaData.meta[video_id]);
        initializeTimeCode(document.getElementById('videoId').duration);
    }    
    else 
        {
            console.log('video not exist');
            initTimeline(metaData.meta['default']);
            //initTimeline(metaData.meta['2089841711']);
            initializeTimeCode(document.getElementById('videoId').duration);
        }
}


function initEffectFactory(json) {
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            //only save the duration status this time
            //addr_duration in sec, nonAddr_duration in sec
            //dictstack.push(new dictobj(key, parseFloat(json[key]['light']['addr'].duration) / 1000.0, json[key]['light']['addr'].pattern, json[key]['light']['addr'].color, json[key]['light']['addr'].direction, json[key]['light']['addr'].shape, parseFloat(json[key]['light']['nonAddr'].duration) / 1000.0, json[key]['light']['nonAddr'].pattern, json[key]['light']['nonAddr'].color, json[key]['light']['layer']));
            //dictstack1.push(new dictobj1(key, parseFloat(json[key]['vest']['duration']) / 1000.0, json[key]['vest'].chest, json[key]['vest'].stomach, json[key]['vest'].upperback, json[key]['vest'].lowerback, json[key]['vest'].layer));
            dictstack.push(new dictobj(key, json[key]['light'].layer));
            dictstack1.push(new dictobj1(key, json[key]['vest'].layer));
            dictstack2.push(new dictobj2(key, json[key]['couch'].layer));
            //console.log('this is dictstack' + JSON.stringify(dictstack));
            
            //console.log('this is dictstack2  ' + JSON.stringify(dictstack2));
        }
    }
    console.log('this is dictstack1  ' + JSON.stringify(dictstack1));

    //console.log(dictstack);

}

// var_dump function in js
var print_r = function (obj, t) {
 
    // define tab spacing
    var tab = t || '';
 
    // check if it's array
    var isArr = Object.prototype.toString.call(obj) === '[object Array]';
    
    // use {} for object, [] for array
    var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');
 
    // walk through it's properties
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var val1 = obj[prop];
            var val2 = '';
            var type = Object.prototype.toString.call(val1);
            switch (type) {
                
                // recursive if object/array
                case '[object Array]':
                case '[object Object]':
                    val2 = print_r(val1, (tab + '\t'));
                    break;
                    
                case '[object String]':
                    val2 = '\'' + val1 + '\'';
                    break;
                    
                default:
                    val2 = val1;
            }
            str += tab + '\t' + prop + ' => ' + val2 + ',\n';
        }
    }
    
    // remove extra comma for last property
    str = str.substring(0, str.length - 2) + '\n' + tab;
    
    return isArr ? (str + ']') : (str + '}');
};

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    return out;
}
//handles initialization of the selectable in the control panel first and then add it to timeline according to time stamp
function initTimeline(json) {
    //initialize namestack
    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            /*for (var i = 0; i < json[key].length; i++) {
                //console.log('in namestack' + json[key][i].name )
                if (!arrayContains(json[key][i].name, namestack)) {
                    namestack.push(json[key][i].name);
                }
            }*/
                if(json[key]['light'].name){
                    if (!arrayContains(json[key]['light'].name, namestack)) {
                        namestack.push(json[key]['light'].name);
                    }
                }
                if(json[key]['vest'].name){
                    if (!arrayContains(json[key]['vest'].name, namestack)) {
                        namestack.push(json[key]['vest'].name);
                    }
                }
                if(json[key]['couch'].name){
                    if (!arrayContains(json[key]['couch'].name, namestack)) {
                        namestack.push(json[key]['couch'].name);
                    }
                }


                console.log('this is namestack' +namestack);
        }
    }
           

     //layer initialized
    //handles initialization of the selectable in the control panel
    //initialize countstack
    for (var eid in namestack) {
       // $('#selecteffect').append("<li id = \"e" + namestack[name] + "\" class=\"ui-widget-content\">" + namestack[name] + "</li>");
        //console.log(name);
        if(eid % 2 == 1){
            $('#effecttimelines').append("<div id=layer_" + eid + " style=\"background-color:#151515; width:100%; height:35px; position:relative;\"></div>");
        }
        else{
            $('#effecttimelines').append("<div id=layer_" + eid + " style=\"background-color:#1d1d1d; width:100%; height:35px; position:relative;\"></div>");
        }
        //console.log('what si this' + namestack[eid]);
        count.push(new counter(namestack[eid]));
        console.log('this is count' + JSON.stringify(count));

        // $("#effect_list").append($("<option></option>").attr("value",name).text(namestack[name])); 
        // get total number of layers
        totalTimelineLayers = eid;
    }

   
    //fastfind
    //window.location.reload();
    initEffectList();

    for (var key in json) {
        if (json.hasOwnProperty(key)) {
            /*for (var i = 0; i < json[key].length; i++) {
                       //add_draggable(json[key][i].name,parseFloat(key),parseFloat(json[key][i].duration)); 

                        //
                        console.log(json[key][i]['light'])
                initializeColor(json[key][i]['light'].name);
                abstracteventstack.push(new abstractevent(json[key][i]['light'].name, json[key][i]['light'].id, parseFloat(key), json[key][i]['light'].type, json[key][i]['light'].layer, json[key][i]['light'].effect));
            }*/
            if (json[key]['light'] != undefined){
                if (json[key]['light'].name){
                    console.log(json[key]['light']);            
                    initializeColor(json[key]['light'].name);
                    abstracteventstack.push(new abstractevent(json[key]['light'].name, json[key]['light'].id, parseFloat(key), json[key]['light'].type, json[key]['light'].layer, json[key]['light'].effect,json[key]['light'].duration));
                }
            }
            if (json[key]['vest'] != undefined){
                if (json[key]['vest'].name   ) {
                    initializeColor(json[key]['vest'].name);
                    abstracteventstack.push(new abstractevent(json[key]['vest'].name, json[key]['vest'].id, parseFloat(key), json[key]['vest'].type, json[key]['vest'].layer, json[key]['vest'].effect,json[key]['vest'].duration));
                }
            }
            if ( json[key]['couch'] != undefined){
                if (json[key]['couch'].name) {
                    initializeColor(json[key]['couch'].name)
                    abstracteventstack.push(new abstractevent(json[key]['couch'].name, json[key]['couch'].id, parseFloat(key), json[key]['couch'].type, json[key]['couch'].layer, json[key]['couch'].effect,json[key]['couch'].duration));
                }
            }

        }
        abstractlength = abstracteventstack.length;
        console.log('this is lenth' + abstractlength);
    }
    console.log('this is abstracteventstack' + JSON.stringify(abstracteventstack));

    for(var i = 0 ; i < totalTimelineLayers+1; i++){
     $( "#layer_"+i ).bind( "click", function() {
           highlightTimeline(this.id);
          
        });


     $( "#layer_"+i ).bind( "mouseup", function() {
         console.log("mouse up on ::: " + this.id + " "+ this.effect + ";;; current eid is " + i);
         //ckswitchLayer(this.id);
      });

    }
    highlightTimeline("layer_0");

}

function initializeColor(name){
    if(!in_array(name,colorArray)){
        //store
        setColorValue(name);
    }
}

function applyColors(name){
        if(getValue(name, colorArray)!= ""){
        $("."+name).css("background-color", getValue(name,colorArray));
        $("."+name).css("background-image", "url('images/effectblock_back.png?new=123')");
        $("."+name).css("background-repeat", "repeat-x");
        } else {
          setColorValue(name);
        }
}

function setColorValue(name){
     colorArray[name] = "rgb("+parseInt(Math.random() * 100)+","+parseInt(Math.random() * 100)+","+parseInt(Math.random() * 100)+")";
}

function highlightTimeline(div){
    cActiveLayer = parseInt(div.split("_")[1]);

    for(var i = 0 ; i < totalTimelineLayers+1; i ++){
        $("#layer_"+i).css("background-image", "none");    
    }
    var t = $("#"+div);
    t.css("background-image", "url('images/timeline_highlights.png?renew=29014')");
    t.css("background-repeat","repeat-x");
}


function ckswitchLayer(layername){
    if(isEffectDraging){
        //ck if on the same layer
        var drag = $('#'+drageffect);

        var targetLayer = parseInt(layername.split("_")[1]);
        var effectLayer = drag.attr("layerid");
        console.log(" effect current on layer " + effectLayer + ", targetLayer is " + targetLayer);
        if(targetLayer != effectLayer){
            // move to target layer
            // change layer id
            console.log(drageffect+" is removed from layer :::: " + effectLayer);
            drag.remove();
            drag.clone(true).appendTo("#" + layername);
            var ndrag =  $("#"+drageffect);
            ndrag.attr("layerid", targetLayer);
            ndrag.draggable({
                axis: "x",
                drag: function(){
               drageffect = this.id;
               console.log(drageffect);
                isEffectDraging = true;}
                
            });
            ndrag.resizable({
            resize: function(event, ui) {
                ui.size.height = ui.originalSize.height;
                ckdisplayText(this.id, drageffect.length * 6, ui.size.width);
                }
            });
            ndrag.bind( "click", function() {
            var sid = getSIDByName(drageffect);
            console.log('hpefully this the one' + sid);
            switchElement(sid);
            var sbid = $('#effect_list').attr("sb");
            highLight('#sbSelector_'+sbid);
          });
            ndrag.bind( "mouseup", function() {
                var sid = getSIDByName(drageffect);
                console.log(sid);
                switchElement(sid);
                var sbid = $('#effect_list').attr("sb");
                highLight('#sbSelector_'+sbid);

            });


            console.log(" adding back to layer --- " + targetLayer);

            /*for (var i in abstracteventstack) {
                if (abstracteventstack[i].id = drageffect)
                    abstracteventstack[i].layerid = targetLayer;
            } */
            
           
           
         //   drag.attr("layerid", targetLayer);
          //  var marginShift = 35 * (targetLayer - effectLayer);
         //   var currentMargin = parseInt(drag.css("marginTop"),10);
        //    var finalMarginShift = marginShift + currentMargin;
            // console.log(" margin shift is " + marginShift);
            // console.log(" current margin " + currentMargin);
            // console.log("final margin is " + finalMarginShift);
            // delete from current layer;
       //     drag.css("marginTop", marginShift + currentMargin + "px");
            // console.log(" margin after move " + drag.css("marginTop"));
        }
        isEffectDraging = false;
    }
}

function updateAbstractStack(){
     var duration = document.getElementById('videoId').duration;
    while (heap.size() != 0) {
        heap.pop();
    }

    update_start_time();
    //then put every draggable objects into the heap (record current position)
    for (var i in abstracteventstack) {
        heap.push({
            offset: abstracteventstack[i].start_time,
            id: abstracteventstack[i].id
        });
    }

    var saveEvent = '{'
    for (var i = 0 ; i < duration ; i++){
        var flag = 0;
        for ( var j = 0 ; j < abstracteventstack.length  ; j++){
            if(abstracteventstack[j].start_time == i){
                if ( flag == 0 ){
                    saveEvent = saveEvent + '"' + abstracteventstack[j].start_time + '":{' + '"' +abstracteventstack[j].effect
                      + '":' + JSON.stringify(abstracteventstack[j]);
                    flag = 1;
                }
                else{
                    saveEvent = saveEvent + ',' + '"' +abstracteventstack[j].effect
                      + '":'+ JSON.stringify(abstracteventstack[j]);
                }
            }
        }
        if (flag != 0 )
            saveEvent = saveEvent + '},'
    }
    saveEvent = saveEvent.substring(0,saveEvent.length - 1 ) + '}';
    jsonUpdateStack =  $.parseJSON(saveEvent);
    console.log("After Update : " + JSON.stringify(jsonUpdateStack));


}

//save the current changes from the application to the local data structures and update json file
function saveData() {
   // console.log('this is heap' +JSON.stringify(heap));
    while (heap.size() != 0) {
        heap.pop();
    }

    update_start_time();
    //then put every draggable objects into the heap (record current position)
    for (var i in abstracteventstack) {
        heap.push({
            offset: abstracteventstack[i].start_time,
            id: abstracteventstack[i].id
        });
    }
    var duration = document.getElementById('videoId').duration;
    var saveEventStack = []; //saved abstractevent, with attr of id, start_time, name,type
    var saveEvent = '{'
    for (var i = 0 ; i < duration ; i++){
        var flag = 0;
        for ( var j = 0 ; j < abstracteventstack.length  ; j++){
            if(abstracteventstack[j].start_time == i){
                if ( flag == 0 ){
                    saveEvent = saveEvent + '"' + abstracteventstack[j].start_time + '":{' + '"' +abstracteventstack[j].effect
                      + '":' + JSON.stringify(abstracteventstack[j]);
                    flag = 1;
                }
                else{
                    saveEvent = saveEvent + ',' + '"' +abstracteventstack[j].effect
                      + '":'+ JSON.stringify(abstracteventstack[j]);
                }
            }
        }
        if (flag != 0 )
            saveEvent = saveEvent + '},'
    }
    saveEvent = saveEvent.substring(0,saveEvent.length - 1 ) + '}';

    console.log('SaveEvent :' + saveEvent);

    // var abstract_event = '{';
    // for (var j = 0 ; j < abstracteventstack.length; j++){
    //      abstract_event = abstract_event +  '"' + abstracteventstack[j].start_time + '":' + JSON.stringify(abstracteventstack[j]) ;
    //       console.log('This is abstract Event : ' + abstract_event);
    //      if( j != abstracteventstack.length - 1 )
    //         abstract_event = abstract_event +',';
    //     else 
    //         abstract_event = abstract_event +'}';
    // }

    // console.log(abstract_event);
     var metaData = Updatedata.findOne({});
     console.log('metaData: ' +JSON.stringify(metaData));
     var json =  $.parseJSON(saveEvent);
     metaData.meta[video_id]  = json;
    

    console.log(metaData);
     Updatedata.update({
       _id: metaData._id
     }, {
         $set: {
            meta: metaData.meta
         }
     });
}


function update_start_time() {
    var duration = document.getElementById('videoId').duration;
    for (var i in abstracteventstack) {
        //console.log(abstracteventstack[i].id);
        var new_time = (parseFloat($('#' + abstracteventstack[i].id).offset().left- 
        $('#' + abstracteventstack[i].id).parent().offset().left) / timelinelength) * duration;
        /*var end_time = (parseFloat($('#' + abstracteventstack[i].id).offset().top- 
        $('#' + abstracteventstack[i].id).parent().offset().left) / timelinelength) * duration;
        var stop_time = ((parseFloat($('#' + abstracteventstack[i].id).offset().left) / timelinelength) * duration);*/
      //  console.log(timelinelength);
      //console.log(new_time, abstracteventstack[i].id );

        abstracteventstack[i].start_time = Math.round(new_time);
        //abstracteventstack[i].layerid = targetLayer;
    }
  //  console.log('this is abstracteventstack after save' + JSON.stringify(abstracteventstack));

}


//helper function for element finding in an array
function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
}

//initialize effect list the selectables
//changeinieffectlist
function initEffectList() {
    $("#selecteffect").selectable({
        stop: function() {
            var result = $("#select-result").empty();
            $(".ui-selected", this).each(function() {
                var name = $(this).text();
                result.append(name);
            });
        }
    });
    $('#selecteffect').selectable("refresh");
}

function counter(countname) {
    this.name = countname;
    this.cnt = 0;
}


//duration in milisec, color in 0 - 65535
function dictobj(name, layer) {
    this.name = name;
    /*this.addr_duration = addr_duration;
    this.addr_pattern = addr_pattern;
    this.addr_color = addr_color;
    this.direction = direction;
    this.shape = shape;
    this.nonAddr_duration = nonAddr_duration;
    this.nonAddr_pattern = nonAddr_pattern;
    this.nonAddr_color = nonAddr_color;*/
    this.layer = layer;
}

function dictobj1(name, layer) {
    this.name = name;    
    this.layer = layer;
}

function dictobj2(name, layer) {
    this.name = name;    
    this.layer = layer;
}



//this is the element obj in abstracteventstack
function abstractevent(name, id, start_time, type, layerid, effect,duration) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.layerid = layerid;
    this.start_time = start_time;
    this.effect = effect;
    this.duration = duration;
}

/*
=================================
js-binaryheap-decreasekey - v0.1
https://github.com/rombdn/js-binaryheap-decreasekey
Based on a Binary Heap implementation found in the book
Eloquent Javascript by Marijn Haverbeke
http://eloquentjavascript.net/appendix2.html
(c) 2013 Romain BEAUDON
This code may be freely distributed under the MIT License
=================================
*/


function BinaryHeap(scoreFunction, idFunction, valueProp) {
    this.content = [];
    this.scoreFunction = scoreFunction;
    this.idFunction = idFunction;
    this.valueProp = valueProp;
    this.map = {};
}


BinaryHeap.prototype.size = function() {
    return this.content.length;
};

BinaryHeap.prototype.push = function(elt) {
    if (this.map[this.idFunction(elt)] !== undefined) {
        throw 'Error: id "' + this.idFunction(elt) + '" already present in heap';
        return;
    }

    this.content.push(elt);
    var index = this.bubbleUp(this.content.length - 1);
    //this.map[this.idFunction(elt)] = index;
    //console.log(this.map);
};

BinaryHeap.prototype.pop = function() {
    var result = this.content[0];
    var end = this.content.pop();

    delete this.map[this.idFunction(result)];

    if (this.content.length > 0) {
        this.content[0] = end;
        this.map[this.idFunction(end)] = 0;
        var index = this.sinkDown(0);
        //this.map[this.idFunction(end)] = index;
        //console.log(this.map);
    }

    return result;
};

BinaryHeap.prototype.bubbleUp = function(n) {
    var element = this.content[n];
    var score = this.scoreFunction(element);

    while (n > 0) {
        var parentN = Math.floor((n - 1) / 2);
        var parent = this.content[parentN];
        //console.log('Element index: ' + n);
        //console.log('Parent index: ' + parentN + ', Parent element: ' + parent);

        if (this.scoreFunction(parent) < score)
            break;

        //console.log('Element score ', score, ' < Parent score ', this.scoreFunction(parent), ' => swap');
        this.map[this.idFunction(element)] = parentN;
        this.map[this.idFunction(parent)] = n;

        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
    }

    this.map[this.idFunction(element)] = n;

    return n;
};

BinaryHeap.prototype.sinkDown = function(n) {
    var element = this.content[n];
    var score = this.scoreFunction(element);

    while (true) {
        var child2N = (n + 1) * 2;
        var child1N = child2N - 1;
        var swap = null;
        /*
                    console.log('element: ' + element, ', score: ' + score, ', position: ', n);
                    console.log('child1: ' + child1N, ',', this.content[child1N]);
                    console.log('child2: ' + child2N, ',', this.content[child2N]);
        */
        if (child1N < this.content.length) {
            var child1 = this.content[child1N];
            child1score = this.scoreFunction(child1);
            if (score > child1score) {
                //console.log('child1 score < elemscore');
                swap = child1N;
            }
        }

        if (child2N < this.content.length) {
            var child2 = this.content[child2N];
            var child2score = this.scoreFunction(child2);
            //console.log((swap == null ? score : child1score), ' >= ', child2score, ' => ', (swap == null ? score : child1score) >= child2score);
            if ((swap == null ? score : child1score) > child2score) {
                //console.log('child2 score < elemscore');
                swap = child2N;
            }
        }

        if (swap == null) break;


        //console.log('swap ', n, ' with ', swap);
        this.map[this.idFunction(this.content[swap])] = n;
        this.map[this.idFunction(element)] = swap;

        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
    }

    this.map[this.idFunction(element)] = n;

    return n;
};

BinaryHeap.prototype.decreaseKey = function(id, value) {
    var n = this.map[id];
    //console.log('Decreasing key for element ' + id + ' from value ' + this.content[n][this.valueProp] + ' to ' + value);
    this.content[n][this.valueProp] = value;
    this.bubbleUp(n);
};

//generate uuid from current time
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

//hash function 
hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
}

//2089841711