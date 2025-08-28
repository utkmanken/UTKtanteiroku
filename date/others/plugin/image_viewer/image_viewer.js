
TYRANO.kag.ftag.master_tag["image_viewer"] = {
    
    vital: ["storage"],
    
    pm : {
        
        folder:"image",
        storage: "",
        
        button_width:"60",
        button_height:"60",
        
    },
    
    start : function(pm) {
        
        var storage_url ="";
        
        if ($.isHTTP(pm.storage)) {
            storage_url = pm.storage;
        } else {
            storage_url = "../../../" + pm.folder + "/" + pm.storage;
        }
        
        var frame_obj = $("<iframe class='image_viewer_frame' frameborder=0></iframe>");
        frame_obj.css({
            top:0,
            "position":"absolute",
            "width":"100%",
            "height":"100%",
            "position":"absolute",
            "background-color":"rgba(0,0,0,0.6)",
            "z-index":99999
        });
        
        frame_obj.attr("src","./data/others/plugin/image_viewer/preview_img.html");
        
        frame_obj.on("load",function(){
            
            frame_obj[0].contentWindow.postMessage({
                action: 'SyncMessage',
                storage_url: storage_url
            },'*',);
            
        });
        
        var j_close_button = $("<img src='./data/others/plugin/image_viewer/button_close.png' />");
        j_close_button.css({
            cursor:"pointer",
            position:"absolute",
            width:parseInt(pm.button_width),
            height:parseInt(pm.button_height),
            top:20,
            right:20,
            "z-index":999999
        });

        j_close_button.on("click",(e)=>{
            
            frame_obj.remove();
            j_close_button.remove();      
            
            TYRANO.kag.ftag.nextOrder();        
            
        })
        
        $("body").append(j_close_button);
        $("body").prepend(frame_obj);
        
        
    }

};
