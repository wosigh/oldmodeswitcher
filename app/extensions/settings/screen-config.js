function ScreenConfig() {
}

ScreenConfig.prototype.version = function() {
	return "1.1";
}

//

ScreenConfig.prototype.label = function() {
	return "Screen Settings";
}

//

ScreenConfig.prototype.activate = function() {
}

ScreenConfig.prototype.deactivate = function() {
}

//

ScreenConfig.prototype.setup = function(controller) {
	// Screen brightness slider, timeout and wallpaper selector
	
	this.controller = controller;

	this.choicesScreenSelector = [
		{'label': controller.defaultChoiseLabel, 'value': -1},
		{'label': "Minimum", 'value': 0},
		{'label': "Maximum", 'value': 100} ];  

	controller.setupWidget("ScreenBrightnessSelector", {'label': "Brightness", 
		'labelPlacement': "left", 'modelProperty': "screenBrightnessLevel",
		'choices': this.choicesScreenSelector});
		
	controller.setupWidget("ScreenBrightnessSlider", {'minValue': -1, 'maxValue': 100, 
		'round': true, 'modelProperty': "screenBrightnessLevel"});

	this.choicesBlinkSelector = [
		{'label': controller.defaultChoiseLabel, 'value': -1},		
		{'label': "Enabled", 'value': 1},
		{'label': "Disabled", 'value': 0} ];  

	controller.setupWidget("ScreenBlinkSelector", {'label': "Blink Notify", 
		'labelPlacement': "left", 'modelProperty': "screenBlinkNotify",
		'choices': this.choicesBlinkSelector});

	this.choicesLockedSelector = [
		{'label': controller.defaultChoiseLabel, 'value': -1},		
		{'label': "Enabled", 'value': 1},
		{'label': "Disabled", 'value': 0} ];  

	controller.setupWidget("ScreenLockedSelector", {'label': "Locked Notify", 
		'labelPlacement': "left", 'modelProperty': "screenLockedNotify",
		'choices': this.choicesBlinkSelector});
		
	this.choicesTimeoutSelector = [
		{'label': controller.defaultChoiseLabel, 'value': -1},
		{'label': "15 Seconds", 'value': 15},
		{'label': "30 Seconds", 'value': 30},
		{'label': "1 Minute", 'value': 60},
		{'label': "2 Minutes", 'value': 120},
		{'label': "3 Minutes", 'value': 180},
		{'label': "5 Minutes", 'value': 300} ];  

	controller.setupWidget("ScreenTimeoutSelector",	{'label': "Turn off After", 
		'labelPlacement': "left", 'modelProperty': "screenTurnOffTimeout",
		'choices': this.choicesTimeoutSelector});

	this.choicesWallpaperSelector = [
		{'label': controller.defaultChoiseLabel, 'value': ""},
		{'label': "Select", 'value': "select"} ];  

	controller.setupWidget("ScreenWallpaperSelector", {'label': "Wallpaper", 
		'labelPlacement': "left", 'modelProperty': "screenWallpaperName",
		'choices': this.choicesWallpaperSelector});
			
	// Listen for tap event for wallpaper selector
	
	controller.listen(controller.get("SettingsList"), Mojo.Event.propertyChange, 
		this.handleListChange.bind(this));
}

//

ScreenConfig.prototype.config = function() {
	var config = {
		'screenBrightnessLevel': -1, 
		'screenTurnOffTimeout': -1, 
		'screenBlinkNotify': -1, 
		'screenLockedNotify': -1, 
		'screenWallpaperName': "", 
		'screenWallpaperPath': "" };
	
	return config;
}

//

ScreenConfig.prototype.load = function(preferences) {
	var config = this.config();
	
	if(preferences.screenBrightnessLevel != undefined)
		config.screenBrightnessLevel = preferences.screenBrightnessLevel;

	if(preferences.screenTurnOffTimeout != undefined)
		config.screenTurnOffTimeout = preferences.screenTurnOffTimeout;

	if(preferences.screenBlinkNotify != undefined)
		config.screenBlinkNotify = preferences.screenBlinkNotify;

	if(preferences.screenLockedNotify != undefined)
		config.screenLockedNotify = preferences.screenLockedNotify; 

	if(preferences.screenWallpaper != undefined) {
		config.screenWallpaperName = preferences.screenWallpaper.name;
		config.screenWallpaperPath = preferences.screenWallpaper.path;
	}
	
	return config;
}

ScreenConfig.prototype.save = function(config) {
	var preferences = {};

	if(config.screenBrightnessLevel != -1)
		preferences.screenBrightnessLevel = config.screenBrightnessLevel;

	if(config.screenTurnOffTimeout != -1)
		preferences.screenTurnOffTimeout = config.screenTurnOffTimeout;
	
	if(config.screenBlinkNotify != -1)
		preferences.screenBlinkNotify = config.screenBlinkNotify;
		
	if(config.screenLockedNotify != -1)
		preferences.screenLockedNotify = config.screenLockedNotify;
			
	if(config.screenWallpaperName.length != 0) {
		preferences.screenWallpaper = {
			'name': config.screenWallpaperName,
			'path': config.screenWallpaperPath };
	}
	
	return preferences;
}

//

ScreenConfig.prototype.handleListChange = function(event) {
	if(event.property == "screenWallpaperName") {
		event.model.screenWallpaperName = "";
		event.model.screenWallpaperPath = "";		
		
		this.controller.modelChanged(event.model, this);

		if(event.value == "select") {
			this.executeWallpaperSelect(event.model);
		}
	}	
}

//

ScreenConfig.prototype.executeWallpaperSelect = function(config) {
	Mojo.FilePicker.pickFile({'defaultKind': "image", 'kinds': ["image"], 'actionType': "open", 
		'actionName': "Select wallpaper", 'crop': {'width': 318, 'height': 479}, 'onSelect': 
			function(config, response) {
				if((!response) || (!response.fullPath)) {
					config.screenWallpaperName = "";
					config.screenWallpaperPath = "";

					this.controller.modelChanged(config, this);
					
					return;
				}
	
				var params = {'target': encodeURIComponent(response.fullPath)};
	
				if(response.cropInfo.window) {
					if(response.cropInfo.window.scale)
						params['scale'] = response.cropInfo.window.scale;
		
					if(response.cropInfo.window.focusX)
						params['focusX'] = response.cropInfo.window.focusX;
		
					if(response.cropInfo.window.focusY)
						params['focusY'] = response.cropInfo.window.focusY;
				}			
		
				this.controller.serviceRequest("palm://com.palm.systemservice/wallpaper/", {
					'method': "importWallpaper", 
					'parameters': params,
					'onSuccess': function(config, response) {
						if(response.wallpaper) {
							config.screenWallpaperName = response.wallpaper.wallpaperName;
							config.screenWallpaperPath = response.wallpaper.wallpaperFile;
						}
						else {
							config.screenWallpaperName = "";
							config.screenWallpaperPath = "";
						}
						
						this.controller.modelChanged(config, this);
					}.bind(this, config),
					'onFailure': function(response) {
						config.screenWallpaperName = "";
						config.screenWallpaperPath = "";

						this.controller.modelChanged(config, this);			
					}.bind(this, config)});
			}.bind(this, config)},
		this.controller.stageController);
}

