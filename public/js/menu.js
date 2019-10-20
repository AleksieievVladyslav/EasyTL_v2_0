var CURRENT_TOPIC;
class Menu {
	mainMenu = {
		"#theory" : ".theory",
		"#quick" : ".quick",
		"#help" : ".help",
		"#home" : ".main-menu",
	}
	profileMenu = {
		"#login" : ".login",
		"#registration" : ".registration",
		"#account" : ".account"
	}
	Redirect(event, element) {
		event.preventDefault();
		this.ClearActive();
		let address = $(element).attr("href");
		switch (address) {
			case "#quick":
				let quick = new Quick();
				break;
		}
		$(this.mainMenu[address]).addClass("active");
	}
	ProfileRedirect(event, element) {
		event.preventDefault();
		this.ProfileClearActive();
		let address = $(element).attr("href");
		$(this.profileMenu[address]).addClass("active");
	}
	TheoryRedirect(target) {
		if ($(target).hasClass('closed-topic')) {
			return;
		}
		let index = $(target).index();
		CURRENT_TOPIC = index;
		new Theory(index);
		$('.theory').removeClass('active');
		$('.theory-topic').addClass('active');
	}
	ProfileClearActive() {
		$('.profile-state').removeClass("active");
	}
	ClearActive() {
		$(".state").removeClass("active");
	}
}