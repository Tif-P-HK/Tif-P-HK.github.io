//http://javascript.info/tutorial/dom
//https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Readable_CSS
//https://jsperf.com/innerhtml-vs-removechild/6

function inspectDom(){
  //Check properties of document
  //https://developer.mozilla.org/en-US/docs/Web/API/document
  documentProperties();

  //Traverse through the DOM
  //http://javascript.info/tutorial/traversing-dom
  traverseThroughDOM();

  //Dom properties
  //http://javascript.info/tutorial/basic-dom-node-properties
  domProperties();

  //Call Dom methods
  //http://javascript.info/tutorial/searching-elements-dom
  domMethods();
}

//Check properties of document
function documentProperties(){
  console.log("document.readyState: " + document.readyState);

  console.log("document.doctype: " + document.doctype);

  console.log("document.implementation: " + document.implementation);

  console.log("document.documentElement: " + document.documentElement.nodeName);  //top most HTML element

  console.log("document.styleSheets: " + document.styleSheets);

  console.log("document.scripts: " + document.scripts.length);

  console.log("document.domain: " + document.domain);

  console.log("document.cookie: " + document.cookie);

  console.log("document.forms.length: " + document.forms.length);

  //document URI, URL, location: all return the same property
  getURL_URI_Location();

  //get links/anchors
  getAnchor_Links();

  function getURL_URI_Location() {
    console.log("document.documentURI: " + document.documentURI);
    console.log("document.location: " + document.location);
    console.log("document.URL: " + document.URL);
  }

  function getAnchor_Links() {
    console.log("document.anchors: " + document.anchors.length); //<a>
    console.log("document.links: " + document.links[0].nodeName); //<links>
  }
}

//Traverse through DOM
function traverseThroughDOM(){
  //Inspect children/child nodes
  inspectChildren();

  //Traverse through siblings and children
  traverseThroughDom();

  function inspectChildren() {
    var body = document.body;
    //child elements, TextNodes are excluded
    console.log("Length of body.children: " + body.children.length);  //same as body.childElementCount

    //childNodes
    var childNodes = body.childNodes;
    console.log("Length of body.childNodes.length: " + body.childNodes.length);

    for (var i = 0; i < body.childElementCount; i++) {
      console.log("document body's child type: " + printNodeTypeNameValue(childNodes[i]));
      //http://www.w3schools.com/jsref/prop_node_nodetype.asp
      //children[i].nodeType = 1 ==> element node
      //children[i].nodeType = 2 ==> attribute node
      //children[i].nodeType = 3 ==> text node
      //children[i].nodeType = 8 ==> comment node
    }

    //difference between children and childNodes:
    console.log("difference between children and childNodes:");
    //http://stackoverflow.com/questions/7935689/what-is-the-difference-between-children-and-childnodes-in-javascript
    var fooDiv = document.createElement("div");
    fooDiv.textContent = "foo";
    console.log("fooDiv.childNodes.length: " + fooDiv.childNodes.length);  //1 TextNode child
    console.log("fooDiv.children.length: " + fooDiv.children.length);  //0 children element
  }

  function traverseThroughDom() {
    var body = document.body;

    //traverse through DOM elements
    console.log("body.firstElementChild type/name/value: " + printNodeTypeNameValue(body.firstElementChild));
    console.log("body.lastElementChild type/name/value: " + printNodeTypeNameValue(body.lastElementChild));
    var form = document.getElementById("bootstrapFormExampleId");
    console.log("form.nextSibling type/name/value: " + printNodeTypeNameValue(form.nextElementSibling));
    console.log("form.previousSibling type/name/value: " + printNodeTypeNameValue(form.previousElementSibling));
    var checkBoxes = document.getElementById("checkBoxesDiv").childNodes[0];
    console.log("checkBoxes.parentNode type/name/value: " + printNodeTypeNameValue(checkBoxes.parentNode) + ", " + checkBoxes.parentNode.getAttribute("id"));
  }

  function printNodeTypeNameValue(node){
    return "==> " + node.nodeType + "(" + node.nodeName + "): " + node.nodeValue;
  }
}

function domProperties(){
  //set innerHtml then append more text
  setInnerHTML();

  //set a custom attribute on element using code
  editCustomAttributeByCode();

  //And the only times you really need an attribute are:
  // To get a custom HTML attribute, because it is not synced to DOM property.
  // To get an "original value" of the standard HTML attribute, like <INPUT value="...">.

  //Standard DOM properties e.g. href are synchronized with attributes.
  //There are also built-in properties which are synced one-way only. e.g. text value
  propertyVsAttribute();

  function setInnerHTML(){
    var innerHTMLDiv = document.getElementById("innerHTMLDiv");
    console.log("innerHTMLDiv's innerHTML - START: " + innerHTMLDiv.innerHTML);
    innerHTMLDiv.innerHTML = "text 1 set";
    console.log("innerHTMLDiv's innerHTML -  TEXT_START: " + innerHTMLDiv.innerHTML);
    innerHTMLDiv.innerHTML += " new text added";
    console.log("innerHTMLDiv's innerHTML -  TEXT_THEN: " + innerHTMLDiv.innerHTML);
  }

  function editCustomAttributeByCode() {
    var chkBoxDiv = document.getElementById("checkBoxesDiv");
    chkBoxDiv.setAttribute("jsAttr", "checkBoxesDivAttr_Value");
    console.log("chkBoxDiv.getAttribute(jsAttr): " + chkBoxDiv.getAttribute("jsAttr"));

    chkBoxDiv.removeAttribute("jsAttr");
    console.log("chkBoxDiv has attribute jsAttr? " + chkBoxDiv.hasAttribute("jsAttr"));
  }

  function propertyVsAttribute(){
    var chkBoxDiv = document.getElementById("checkBoxesDiv");
    console.log("chkBoxDiv.class: " + chkBoxDiv.className);

    //chkBoxDiv attributes
    var attributes = chkBoxDiv.attributes;  //3 attributes: class, id, htmlAttr
    console.log("chkBoxDiv.attributes[1]: " + attributes[1].nodeName + ", " + attributes[1].nodeValue);

    //chkBoxDiv properties
    var properties = chkBoxDiv.properties;  //this is undefined

    //Standard DOM properties e.g. href are synchronized with attributes.
    //but they can return different values
    var anchor1 = document.getElementById("anchor1");
    console.log("href attribute: " + anchor1.getAttribute("href"));
    console.log("href property: " + anchor1.href);
  }
}

//Go crazy with dom methods
function domMethods(){
  //getElementsById: document
  //getElementsByTagName: document, element
  //getElementsByName: document
  //getElementsByClassName: document, element
  //querySelector: document, element
  //querySelectorAll: document, element

  //query results are live, unless:
  //1. the result is not a collection e.g by id
  //2. results from querySelectorAll (for performance purpose)

  //getElementsByTagName(): the element before the . is called the context
  getElementsByTagName();

  //getElementsByName(), getElementsByClassName()
  getElementsByName_ClassName();

  //querySelectorAll: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors
  querySelector();

  function getElementsByTagName(){
    var allEleByTagName = document.body.getElementsByTagName("*");  //31
    var children = document.body.children;  //7
    console.log("is body.getElementsByTagNameAll count === body.childElementCount: " +
      allEleByTagName.length === children.length);

    //get all children elements inside checkBoxesDiv
    var inputEles = document.getElementById("checkBoxesDiv").getElementsByTagName("input");
    console.log("Number of elements under checkBoxesDiv: " + inputEles.length); //expecting 4
  };

  function getElementsByName_ClassName(){
    console.log("Elements in document with name = capacity: " +
      document.getElementsByName("capacity").length); //expecting 2

    console.log("Elements in jumbotron div with name = capacity: " +
      document.getElementsByClassName("jumbotron")[0].children[0].getElementsByTagName("input").length); //expecting 4

    var jumbotronDiv = document.getElementById("jumbotron");
    console.log("Elements in jumbotron div with id = container: " +
      jumbotronDiv.getElementsByClassName("container")[0].id);
  }

  function querySelector(){
    var idSelector = document.querySelectorAll("#innerHTMLDiv");
    console.log("idSelector.length (expecting 1): " + idSelector.length);

    var classSelector = document.querySelectorAll(".checkboxClass");
    console.log("classSelector.length (expecting 4): " + classSelector.length);

    var pseudoClassSelector = document.querySelectorAll(".checkboxClass:checked");
    console.log("pseudoClassSelector.length (expecting 0): " + pseudoClassSelector.length);

    var tagNameSelector = document.querySelectorAll("a");
    console.log("tagNameSelector.length (expecting 2): " + tagNameSelector.length);

    var descendantSelector = document.querySelectorAll("#bootstrapFormExampleId span");
    console.log("descendantSelector.length (expecting 5): " + descendantSelector.length);

    var childSelector = document.querySelectorAll("#bootstrapFormExampleId > span");
    console.log("childSelector.length (expecting 1): " + childSelector.length);

    var siblingSelector = document.querySelectorAll("#basic-addon1 + input");
    console.log("siblingSelector.type (expecting text): " + siblingSelector[0].type);

    //#bootstrapFormExampleId span:first-child means:
    //within the context of #bootstrapFormExampleId
    //get all span elements that are the the first child of their RESPECTIVE parents
    //that include child of #bootstrapFormExampleId, and grandchild of #bootstrapFormExampleId
    //i.e. basic-addon0, basic-addon3
    var firstChildSelector_descendant = document.querySelectorAll("#bootstrapFormExampleId span:first-child");
    for(var i=0; i<firstChildSelector_descendant.length; i++){
      console.log("firstChild (from descendant): " + firstChildSelector_descendant[i].id);
    }

    //similar concept as first-child, but choosing the last child this time
    //i.e. basic-addon2, basic-addon4, basic-addon5
    var lastChildSelector_descendant = document.querySelectorAll("#bootstrapFormExampleId span:last-child");
    for(var i=0; i<lastChildSelector_descendant.length; i++){
      console.log("lastChild (from descendant): " + lastChildSelector_descendant[i].id);
    }

    //search only the children of #bootstrapFormExampleId
    //i.e. basic-addon5
    var lastChildSelector_child = document.querySelectorAll("#bootstrapFormExampleId > span:last-child");
    for(var i=0; i<lastChildSelector_child.length; i++){
      console.log("lastChild (from children): " + lastChildSelector_child[i].id);
    }
  }
}























