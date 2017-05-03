var tmp_storage = window.sessionStorage;

function GetContacts(){

    var template = "<ul> {{ #liste}} <li> {{emetteur}}: {{contenu}} </li> {{ /liste }} </ul>";
    var template2 = "<li><a class='fonction' href='#' data-name='{{ emetteur }}'>{{ contenu }}</a></li>";
    var template3 = "<ul class='table-view'><li class='table-view-cell table-view-cell'>Messages reçus</li>{{#data}}<li class='table-view-cell'>{{emetteur}}: {{contenu}}</li>{{#data}}</ul>"
    var template4 = "<ul class='table-view'>  {{ #liste}}  <li class='table-view-cell media'>    <div class='media-body'> {{idcontact}} </div> </li>  {{ /liste }} </ul>"
    
    var data = tmp_storage.getItem("Contacts");

    $('#dynamicContact').html(
        Mustache.render(
            template4,
            {liste: data}
        )
    );
}
