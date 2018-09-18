# tiny-angular-wordcloud
Tiny-angular-wordcloud is a simple wordcloud generator for AngularJS without any external dependencies. Only 2kb in size!

### Version
0.2.0

### Demo
http://plnkr.co/edit/zcC4v6

### Installation
You can easily install tiny-angular-wordcloud with bower:

```sh
$ bower install tiny-angular-wordcloud --save
```

Once that is done you must add the 'tangcloud' module to your Angular application:
```sh
angular.module('test', ['tangcloud'])
```

Now you can use the tangcloud directive in your html:
```sh
<tang-cloud></tangcloud>
```

### Supported variables
##### words - *required*
1. The name of a scope variable containing words in format showed below (id is optional).
```sh
        $scope.words = [
            {id: 1, word: "woord1", size: 1},
            {id: 2, word: "woord2", size: 2},
            {id: 3, word: "woord3", size: 3},
            {id: 4, word: "woord4", size: 4},
        ];
```

2. An array of words in the format:
```sh
<tang-cloud words="[{word: 'woord1', size: 1},{word: 'woord2', size: 2}]"></tang-cloud>
```

##### on-click - *optional*
The method that has to be called when a word is clicked on. Supported parameters are word and/or id.
```sh
<tang-cloud on-click="method(word)"></tang-cloud>
<tang-cloud on-click="method(id)"></tang-cloud>
```

#### cloudsize
The size of each wordcloud is determined by the space the element has on the screen. The size can be controlled by adding 'weight' and 'height' to the 'tangcloud' css class. (see demo)
#### word placement
Words are placed in a circular pattern, if the supplied dimensions are to small to accommodate all the given words, the words that can not be placed will be left out.

### Styling
The size and styling of the different words is done using CSS based on the size of each word. You must implement these CSS classes yourself by using the following format:

```sh
.tangcloud-item-1 {
    font-size: 15em;
    color: green;
}
```

the 'size' number specified in the word objects determines the CSS class. So a word with size 6 will have the CSS class '.tangcloud-item-6'

In order to work properly each item has to have a line-height of 100% (the height of each word is calculated based on the line height). There should also be a class called 'tangcloud-item-hidden' which sets visibility to hidden. This makes sure the cloud doesn't show up untill all items are placed correctly.

```sh
.tangcloud-item span {
        line-height: 100%;
}

.tangcloud-item-hidden {
        visibility: hidden;
}
```

a default CSS file with all required classes can be found in the 'example' folder

License
----
MIT
