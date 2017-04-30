
function getMsgs(){
    var template = "<ul> {{ #liste}} <li> {{contenu}} </li> {{ /liste }} </ul>";
    $('#dynamicListe').html(
        Mustache.render(
            template,
            {liste: [
            {contenu: data.data[0].contenu},
            {contenu: data.data[1].contenu}
            ]}
        )
        //liste: [{value: "un"},{value: "deux"}]})
    );
}