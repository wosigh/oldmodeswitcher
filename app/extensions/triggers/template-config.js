function TemplateConfig() {
}

TemplateConfig.prototype.version = function() {
	// This function should return the api version that this extension was made for.

	return "1.1";
}

TemplateConfig.prototype.label = function() {
	// This function should return the configuration UI label for this trigger.
	
	return $L("Template Trigger");
}

//

TemplateConfig.prototype.activate = function() {
	// This function is called when application configuration scene is activated.
}

TemplateConfig.prototype.deactivate = function() {
	// This function is called when application configuration scene is activated.
}

//

TemplateConfig.prototype.setup = function(sceneController) {
	// This function should setup all the widgets in the extension-listitem file.

	this.choicesTemplateOptionSelector = [
		{'label': $L("Enabled"), 'value': 1},
		{'label': $L("Disabled"), 'value': 0}
	];  

	sceneController.setupWidget("TemplateOptionSelector", {'label': $L("Template Option"),	
		'labelPlacement': "left", 'modelProperty': "templateOption", 
		'choices': this.choicesTemplateOptionSelector} );
}

//

TemplateConfig.prototype.config = function() {
	// This function is called when new settings group is added into the list.

	// Configuration returned here is the configuration for the UI part.
	
	var triggerConfig = {
		'templateTitle': $L("Template"),
		'templateOption': 0 };
	
	return triggerConfig;
}

//

TemplateConfig.prototype.load = function(triggerPreferences) {
	// This function will do the parsing of the preferences stored by the main 
	// application into the wanted format for the UI part of the configuration.
	
	// The data in application preferences is set by the extension itself.

	var triggerConfig = {
		'templateTitle': $L("Template"),
		'templateOption': triggerPreferences.templateOption };
	
	return triggerConfig;
}

TemplateConfig.prototype.save = function(triggerConfig) {
	// This function will do the parsing of the configuration used in the UI 
	// part into the preferences format stored by the main application.
	
	// The data in the main application preferences should be kept to minimum.

	var triggerPreferences = {
		'templateOption': triggerConfig.templateOption };
	
	return triggerPreferences;
}

