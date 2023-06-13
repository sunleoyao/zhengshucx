var dialogIdSeed = 1000000000;
function jQueryValidatorWrapper(formId, rules, messages,exception) {
    // Get an Id for the "<div>" to diaply the error messages.
    // The Id is made sure to be unique in the web page.
    var dialogId = "V_dia_log" + dialogIdSeed++;
    while ($("#" + dialogId).length != 0) {
        //alert(dialogId);
        dialogId = "V_dia_log" + dialogIdSeed++;
    }

    // create the error message "div" and add it to the dom.
    // it will be use to display the validation error messages.
    var dialogText = "<div id='" + dialogId
            + "' title='Please correct the errors ...'>"
            + "<ul /></div>";
    $("body").append(dialogText);
    var $dialog = $("#" + dialogId);
    var $ul = $("#" + dialogId + ">ul");

//    $dialog.dialog({
//        autoOpen: false,
//        modal: true,
//        close: function (event, ui) {
//            $ul.html("");
//        }
//    });

    // hook up the form, the validation rules, and messages with jQuery validate.
    var showErrorMessage = false;
    var validator = $("#" + formId).validate({
        onchange: true,
        rules: rules,
        ignore: "" ,
        messages: messages,
        errorPlacement:exception,
        focusInvalid: false,
//        errorPlacement: function (error, element) {
//            if (showErrorMessage) {
//                var li = document.createElement("li")
//                li.appendChild(document
//                    .createTextNode(error.html()));
//                $ul.append(li);
//            }
//        },
        showErrors: function (errorMap, errorList) {
//        	this.errorMap = errorMap;
//        	this.errorList = errorList;
            this.defaultShowErrors();

//			this.settings.showErrors.call( this, this.errorMap, this.errorList );
//            if ((errorList.length != 0) && showErrorMessage) {
//            	var a = '';
//            	for(var i in errorList) {
//            		a += i + ':' + errorList[i].message;
//            		this.showLabel( errorList[i].element, errorList[i].message );
//            		break;
//            	//	this.optional(errorList[i].element);
//            	}
//               // $dialog.dialog('open');
//            	alert('err ' + a);
//            }
        }
    });

    // This is the function to call whem make the validation
    this.validate = function () {
        showErrorMessage = true;
        var result = validator.form();
        showErrorMessage = false;

        return result;
    };
}