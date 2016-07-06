# Beautiful Soup JS
Leveraging jQuery to perform webpage scraping in Javascript.
#### Dependencies
 - jQuery

####Demo
Determining how far a Wikipedia article is from the article on Philosophy.
https://github.com/maligndrome/The-Root-of-Everything

#### Currently supported functionality
##### HTML to JSON
example-
````
var file=new beautifulSoup(path);
file.onReady('html2json').then(function(jsonForm){
 console.log(jsonForm);
});
````
**path** path to the HTML file

**var** variable to store the JSON
##### Prettify HTML
example-
````
var file=new beautifulSoup(path);
file.onReady('prettify',id);
````
**path** path to the HTML file

**id** ID of the element in which you want the prettified code to appear

##### Find elements
example(print all links on the page)-
````
var file=new beautifulSoup(path);
file.onReady('findAll','a').then(function(linksArray){
 for(var i=0;i<linksArray.length;i++){
	 console.log(get(linksArray[i],'href'));
	}
});
````
**path** path to the HTML file


