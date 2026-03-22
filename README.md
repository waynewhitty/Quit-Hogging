Quit-Hogging
============

JavaScript-based AdBlock blocker / detection. Block or display a message to AdBlock users. No dependencies required.

Note: Updated old library w/ Claude as test.

## How It Works

1. `ads.js` sets a variable (`iExist = true`). AdBlock blocks files with "ads" in the name, so the variable stays undefined for AdBlock users.
2. `quit-hogging.js` checks for that variable on page load and shows a blocking overlay or inline message.
3. If `persistent` is enabled (default), a MutationObserver watches for removal of the popup via DevTools and automatically recreates it.

## Quick Start

### Block AdBlock users

```html
<script src="js/ads.js"></script>
<script src="js/quit-hogging.js"></script>
<script>
    QuitHogging({
        block: true,
        blockTitle: 'AdBlock Detected',
        blockContent: 'Please whitelist our website in order to view our content.'
    });
</script>
```

### Display a message to AdBlock users

```html
<div id="message" style="display:none;"></div>

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

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `block` | boolean | `false` | Show a full-screen blocking overlay |
| `blockTitle` | string | `'AdBlock Detected!'` | Overlay heading text |
| `blockContent` | string | `'Please whitelist our website...'` | Overlay body text |
| `blockButtonText` | string | `''` | Optional button text (e.g. `'I have disabled AdBlock'`) |
| `blockButtonLink` | string | `''` | URL the button navigates to (empty = reload page) |
| `displayMessage` | boolean | `false` | Show an inline message in a target element |
| `displayMessageId` | string | `''` | ID of the element to display the message in |
| `displayMessageContent` | string | `'Please whitelist...'` | Message text/HTML |
| `persistent` | boolean | `true` | Recreate popup if user removes it via DevTools |
| `animation` | string | `'fade'` | Animation style: `'fade'`, `'slide'`, or `'none'` |
| `animationDuration` | string | `'0.3s'` | CSS animation duration |
| `customClass` | string | `''` | Extra CSS class added to the overlay |
| `zIndex` | number | `9999` | z-index of the overlay |
| `onDetected` | function | `null` | Callback when AdBlock is detected |
| `onDismissAttempt` | function | `null` | Callback when user tries to remove the popup |

## Theme Customization

Pass a `theme` object to customize the overlay appearance:

```js
QuitHogging({
    block: true,
    theme: {
        overlayBackground: 'rgba(0, 0, 0, 0.9)',
        boxBackground: '#2c5ea8',
        textColor: '#ffffff',
        titleColor: '#ffffff',
        fontFamily: 'Georgia, serif',
        buttonBackground: '#ffffff',
        buttonColor: '#2c5ea8',
        borderRadius: '12px',
        maxWidth: '500px'
    }
});
```

All theme properties are optional — only override what you need.

## Deletion Detection

When `persistent: true` (default), the library uses three layers of protection:

1. **MutationObserver** on the document body detects immediate removal of the overlay element
2. **MutationObserver** on the document head detects removal of the injected `<style>` tag
3. **Fallback interval** (every 2 seconds) catches edge cases

Use the `onDismissAttempt` callback to track removal attempts.

## Programmatic Control

`QuitHogging()` returns an object with control methods:

```js
var qh = QuitHogging({ block: true });

// Manually re-run detection
qh.detect();

// Remove overlay and clean up observers
qh.destroy();
```

## Notes

- Requires `style-src 'unsafe-inline'` if your site uses a Content Security Policy, since styles are injected at runtime.
- Some aggressive ad blockers may add `quit-hogging.js` to their filter lists. Consider renaming the file if this becomes an issue.
