/**
 * Created by amadev on 26.11.16.
 */
$(document).ready(function(){
    $('.log-btn').click(function(){
        $('.log-status').addClass('wrong-entry');
        $('.alert').fadeIn(500);
        setTimeout( "$('.alert').fadeOut(1500);",3000 );
    });
    $('.form-control').keypress(function(){
        $('.log-status').removeClass('wrong-entry');
    });

});


