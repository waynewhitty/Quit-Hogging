

/**
 * Default vars, etc.
 */
var quitHoggingParams;
var quitHoggingBlock = false;
var quitHoggingBlockTitle = "AdBlock Detected!";
var quitHoggingBlockMessage = "Please whitelist our website in order to view our content.";
var quitHoggingId;
var quitHoggingDisplayMessage = false;
var quitHoggingDisplayMessageId;
var quitHoggingDisplayContent = "Please whitelist our website from AdBlock.";







/**
 * CSS style for our modal background. Will be inline.
 */
var quitHoggingModalStyle = {
    'position' : 'absolute',
    'top': '0',
    'left': '0',
    'right': '0',
    'bottom': '0',
    'background-color': 'rgba(0, 0, 0, 0.85)',
    'z-index': '9999',
    'padding-top': '15px'
};


/**
 * CSS style for the message box that is displayed when the modal appears. Will
 * be inline.
 */
var quitHoggingModalInfoStyle = {
    'margin': 'auto',
    'width': '80%',
    'background-color': '#3b6ccd',
    'color': '#FFF',
    'text-shadow': '1px 1px 1px #111',
    'padding': '10px 20px',
    'font-family': 'Arial,Liberation Sans,DejaVu Sans,sans-serif',
    'font-weight': 'bold'
}







/**
 * Setup. Takes in params / options via an object.
 */
function QuitHogging(params){
    
    quitHoggingParams = params;
    quitHoggingId = quitHoggingRandId();
    
    if(quitHoggingParams.block !== undefined){
        quitHoggingBlock = quitHoggingParams.block;
    }
    if(quitHoggingParams.blockTitle !== undefined){
        quitHoggingBlockTitle = quitHoggingParams.blockTitle;
    }
    if(quitHoggingParams.blockContent !== undefined){
        quitHoggingBlockMessage = quitHoggingParams.blocContent;
    }
    if(quitHoggingParams.displayMessage !== undefined){
        quitHoggingDisplayMessage = quitHoggingParams.displayMessage;
    }
    if(quitHoggingParams.displayMessageId !== undefined){
        quitHoggingDisplayMessageId = quitHoggingParams.displayMessageId;
    }
    if(quitHoggingParams.displayMessageContent !== undefined){
        quitHoggingDisplayContent = quitHoggingParams.displayMessageContent;
    }
    
    window.onload = function () { 
        quitHoggingDetect();
    }
}









/**
 * Detect whether AdBlock is enabled or not.
 */
function quitHoggingDetect(){
    if(window.iExist === undefined){ 
        //Adblock is enabled.
        if(quitHoggingBlock){
            quitHoggingBlocker();
        }
        if(quitHoggingDisplayMessage){
            quitHoggingMessage();
        }
    }
}







/**
 * Block page by displaying modal.
 */
function quitHoggingBlocker(){    
    var html = quitHoggingModal();
    $('body').append(html);
}







/**
 * Display a message to the user.
 */
function quitHoggingMessage(){
    $('#' + quitHoggingDisplayMessageId).html(quitHoggingDisplayContent);
    $('#' + quitHoggingDisplayMessageId).fadeIn();
}








/**
 * Create the HTML for our modal.
 */
function quitHoggingModal(){
    
    var modalStyle = ' style="' + quitHoggingBuildInlineStyle(quitHoggingModalStyle) + '" ';
    var infoStyle = ' style="' + quitHoggingBuildInlineStyle(quitHoggingModalInfoStyle) + '" ';
    
    var html = new Array();    
    
    html.push('<div id="' + quitHoggingId + '"' + modalStyle + '>');
    html.push('<div' + infoStyle + '>');
        
    html.push('<h1>' + quitHoggingBlockTitle + '</h1>');
    html.push('<p>' + quitHoggingBlockMessage + '</p>');
        
    html.push('</div>');
    html.push('</div>');
    return html.join('');
}








/**
 * Build inline CSS style from an object.
 */
function quitHoggingBuildInlineStyle(obj){
    var style = new Array();
    $.each(obj, function(key, val){
        style.push(key + ": " + val);
    });
    return style.join('; ');
}








/**
 * Generate a random ID for our modal blocker.
 */
function quitHoggingRandId(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i < 8; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
