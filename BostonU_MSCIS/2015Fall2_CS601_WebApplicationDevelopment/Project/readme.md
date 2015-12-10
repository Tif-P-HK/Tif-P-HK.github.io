# **Welcome to Hong Kong!**
[View it live](http://tif-p-hk.github.io/BostonU\_MSCIS/2015Fall2\_CS601\_WebApplicationDevelopment/Project)

## Introduction

This website introduces Hong Kong to those who want to visit the city. Users can learn about the city's demographic data presented in charts (statistics.html), as well as information about different districts (districts.html). Useful tips are shared on the site for those who want to live like a local and act like a pro (tips.html). News and upcoming events can also be found to help users plan their trip (news.html).

## Technical Features

-  **All pages** – The site uses a "sticky" header that can respond to page scrolling by reducing its height while staying at the top of the page when the page is scrolled down.

-  **All pages except for index.html** – A "breadcrumb" text is shown right under the header section to show users which page they're viewing. To avoid hardcoding, this control is constructed dynamically using the "current items" from the navigation menu.

-  **Statistics.html** – The page uses a 2-column layout built by divs floating on the left and right. Each div is further split into a "text" div and a "chart" div. The ArcGIS API for JavaScript and c3.js API are used to construct the map and the charts, but some customization was made to make the charts' UI look better on the dark background.

-  **Districts.html:** – An accordion menu is shown on the left for users to switch between districts. On page scrolling, the position of the menu will be adjusted to keep it stay on the visible area.

 When a menu item is clicked, the page content (map center, images, copyright text, district description, and external links) will be refreshed.

 The entire page content is pulled in from an external JSON file, jQuery and JavaScript are used to create the UI elements based on the JSON object created from the file. For those districts that have more than one image (e.g. HK Island --> Central, Eastern; Kowloon --> Kwun Tong), the images will be presented in a slideshow.

-  **Tips.html** – This page also uses an accordion menu, with all data also coming from JSON file.

 For the tips that have an image, the image will scale in a bit on hovering. If the image is clicked, it will be expanded and opened with a "lightbox" effect. The lightbox effect was implemented using jQuery with no third party plugin involved.

-  **News.html** – This page uses a tab layout and show the upcoming events. The images will be blurred a bit on hovering to make the caption more legible. A revolving section of "news" div is available on the right side, the div scrolls through the current news at a constant time interval. No third party plugin/API was used to create the revolving effect.

- **Supported browsers** – Chrome 47.0.2526.80, Firefox 42.0, IE11, Edge20

## Known Limitations/By Design Behaviors

- The HTML and CSS files used in this website were validated. All HTML files passed the validation while the CSS validator indicated some errors. The errors fall into the following types and they should not be considered as valid errors:
  - Browser vendors specific CSS properties
  - SVG specific properties
  - Properties not supported by the spec. An example is the "shape-outside" properties. This property is [documented in MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside) as a valid property

- Using IE11, the image blurring effect used on the news.html page is not supported. This property has been dropped since IE9 (see [here](http://thenewcode.com/534/Crossbrowser-Image-Blur-with-CSS) for details).

- This website was tested in Chrome 47.0.2526.80, Firefox 42.0, IE11 and Edge20. IE9 or below are not supported since the "overrideMimeType" method was not implemented in these versions of IE.

- On the statistics page, colors of the bar charts' labels are controlled by the bars' own colors. Since this property is determined by c3.js in rumtime and is set at the text element level, the style cannot be overwritten.
