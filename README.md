# Modulab (prev. sf-ntp-ff)
 Yet another NewTab replacement extension for Firefox; this time, with a modern aesthetic inspired by Apple's Safari browser and Google's Material You.

 One of the main ideas here is to incorporate different elements from various different browser's new tabs.  
 e.g., the 'Chrome bar', which is made to replicate the 'Gmail', 'Images', and waffle menu from Google Chrome's new tab page.   

 This is more of a passion project, so it's far from bug free. That said, it should be plenty usable for daily use. Just beware of bugs! 👻

## Installing & Updating:  
As of version 0.3, you can click on the '.xpi' file of the [latest release](https://github.com/futur3sn0w/sf-ntp-ff/releases/latest), which will prompt you to install the extension.  
The process is the same for updating, just click the '.xpi' file and follow the prompts!  
 
## Usage & Notes:
_This is very much a beta/pre-release. Expect bugs!_  
- 'Modules' allow you to control what appears on the page, including downloads, favorites, a Google Chrome-inspired 'link bar', and more.
- From the settings sidebar, you can upload and change the page's background, and enable/disable modules.
- Selecting a custom background will also enable a dynamic color theme based on your selected image that applies to folders, download items, input controls, and more.  
  The theme will be selected and applied automatically once you've selected an image, and from there, the background will be brightened or darkened based on your system's light/dark theme.  
- Your favorites are mirrored from Firefox's bookmarks toolbar, so any changes you make in one will automatically update in the other.  
  You can double-click to rename items just like in Safari, and you can right-click to delete or open a bookmark in a new tab.  

## For developers:  
You can download the [main branch code](https://github.com/Futur3Sn0w/sf-ntp-ff/archive/refs/heads/main.zip), and load it as a temporary extension.  
From MDN:
> In Firefox: Open the about:debugging page, click the This Firefox option, click the Load Temporary Add-on button, then select any file in [your] extension's directory.  
> The extension now installs, and remains installed until you restart Firefox.
>   
> Alternatively, you can run the extension from the command line using the web-ext tool.

[Read more](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#trying_it_out)
