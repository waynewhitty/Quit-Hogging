Quit-Hogging
============

JavaScript-based AdBlock blocker / detection. Block or display a message to AdBlock users. Requires JQuery.

If you want to block AdBlock users:

```html
<h1>Welcome!</h1>
<p>
    This content will be blocked if AdBlock is enabled.
</p>
        
        
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="js/ads.js"></script>
<script src="js/quit-hogging.js"></script>
<script>
    QuitHogging({
        block: true,
        blockTitle: 'Adblock Detected',
        blockContent: 'Please whitelist our website in order to view our content'
    });
</script>
```

If you want to display a message to Adblock users:

```html
<h1>Welcome!</h1>
<div id="message" style="display:none;"></div>
<p>
    My content.
</p>
        
        
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="js/ads.js"></script>
<script src="js/quit-hogging.js"></script>
<script>
    QuitHogging({
        displayMessage: true,
        displayMessageId: 'message',
        displayMessageContent: 'Please whitelist our website from AdBlock!'
    });
</script>
```

Params / Options:

- block: boolean - If you want to block the user or not. FALSE by default.

- blockTitle: string - The header / title that will be displayed if the user is blocked.

- blockContent: string - Paragraph text that will be displayed if the user is blocked.

- displayMessage: boolean - If you want to display a message to the user or not. FALSE by default.

- displayMessageId: string - The ID of the div that you want to display the message in.

- displayMessageContent: string - Text / HTML that you want to be displayed in the message box.
