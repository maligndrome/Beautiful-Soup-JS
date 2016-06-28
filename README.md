# Beautiful Soup JS
Leveraging jQuery to perform webpage scraping in Javascript.
#### Dependencies
 - jQuery
### Currently supported functionality
- #### HTML to JSON
example-
````
var file=new beautifulSoup(path);
file.onReady('html2json',var);
````
**src** path to the HTML file

**var** variable to store the JSON
- #### Prettify HTML
example-
````
var file=new beautifulSoup(path);
file.onReady('prettify',id);
````
**src** path to the HTML file

**id** ID of the element in which you want the prettified code to appear

