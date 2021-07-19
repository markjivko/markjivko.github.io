/* global fervoare */
$(document).ready(function(){
    fervoare.toolbox.seo_update = function(h,c){
        $.each(c,function(k,v){
            $('#'+k).val(v);
        });
    };
});