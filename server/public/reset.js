$(document).ready(function(){
    $('#form').on('submit', function(e){
        e.preventDefault();
        

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var token = getUrlParameter('token');

        var pword = $('#form').serializeArray()[0].value;
        var conf = $('#form').serializeArray()[1].value;

        if(pword != conf){
          alert("Re check");
        } else{
          alert(token);
          axios.get("https://localhost:3000/resetpassword?token=" + token + "&password=" + pword).then((res)=>{
            alert(res);
          })
        }

    });
});