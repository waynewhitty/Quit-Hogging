Quit-Hogging
============

AdBlock blocker / detection. Block or display a message to AdBlock users. Requires JQuery.

Example:

```html
<h1>Welcome!</h1>
<div id="message" style="display:none;"></div>
<p>
    Content example. Integer et ipsum eu est interdum lobortis. 
    Nunc nec nisl sollicitudin, suscipit ante eget, auctor nisl. 
    Etiam accumsan nunc eget fringilla rhoncus. Pellentesque eget venenatis sem, sed ornare felis. 
    Suspendisse volutpat odio in egestas bibendum. Aliquam scelerisque purus at tristique fermentum. 
</p>
        
        
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="js/ads.js"></script>
<script src="js/quit-hogging.js"></script>
<script>
    QuitHogging({
        block: false,
        blockTitle: 'Adblock Detected',
        blockContent: 'Please whitelist our website in order to view our content',
        displayMessage: true,
        displayMessageId: 'message',
        displayMessageContent: 'Please whitelist our website from AdBlock.'
    });
</script>
```

Params / Options:

- block: true|false - If you want to block the user or not.

- blockTitle: string - The header / title that will be displayed if the user is blocked.

- blockContent: string - Paragraph text that will be displayed if the user is blocked.

- displayMessage: true|false - If you want to display a message to the user or not.

- displayMessageId: string - The ID of the div that you want to display the message in.

- displayMessageContent: string - Text / HTML that you want to be displayed in the message box.
