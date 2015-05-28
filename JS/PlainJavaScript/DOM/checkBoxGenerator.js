  //an array of fields objects
  //each field has a name and an alias properties
  var fields = [
      {
        "name": "OID",
        "alias": "Object ID"
      },
      {
        "name": "type",
        "alias": "Type"
      },
      {
        "name": "capacity",
        "alias": "Capacity"
      },
      {
        "name": "addr",
        "alias": "Address"
      }
    ];

  createCheckBoxes();

  //Create checkboxes based on the field array
  function createCheckBoxes(){

    var div = document.getElementById("checkBoxesDiv");
    div.innerHTML = "";

    fields.forEach(function(field){
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = field.name;
      checkbox.value = field.name;
      checkbox.className = "checkboxClass"; //This line is only used for testing querySelectorAll()
      checkbox.onclick = getCheckedCount;

      var label = document.createElement("label");
      label.className = "checkBoxLabel";
      label.appendChild(document.createTextNode(field.alias));

      div.appendChild(checkbox);
      div.appendChild(label);
      div.appendChild(document.createElement("br"));
    });

    //Get the number of checked boxes:
    //if count > 0, enable the OK button
    function getCheckedCount(){
      var checkedBoxesCount = document.querySelectorAll("input:checked").length;
      console.log(checkedBoxesCount + " boxes checked");
    }

  }
