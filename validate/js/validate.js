/**
 * @author pengcheng 2012-02-23
 */
/*
 * onSubmit(obj)  提交form表单，obj表示form对象
 * onSuccess(obj)  当单个input标签验证成功后的动作，obj表示input对象
 * onFailed(obj) 当单个input标签验证失败后的动作，obj表示input对象
 */

function validate(form, options) {

	$(form).find('input[type="text"]').each(function(index) {
		var rules = options.rules;
		var ajaxRules = options.ajaxRules;
		var name = $(this).attr("name");
		$(this).data("local",false);
		$(this).data("ajax",true);
		
		if(rules.hasOwnProperty(name)) {
			$(this).blur(function() {
				validateInput(this, rules[name]);
			});
		}
		if(ajaxRules.hasOwnProperty(name)) {
			$(this).blur(function() {
				validateInputAjax(this, ajaxRules[name]);
			});
		}
	});

	$(form).submit(function() {
		var isSubmit = true;
		var validateSuccess = false;
		$(this).find('input[type="text"]').each(function(index) {
			if(!($(this).data("local")&&$(this).data("ajax"))) {
                validateSuccess=false;
			}
		});
		
		if(validateSuccess) {
			if(options.hasOwnProperty("onSubmit")) {
				isSubmit = options.onSubmit(this);
			}
		} else {
			if(validateForm(this,options.rules)){
				validateFormAjax(this,options.ajaxRules);
			}
			isSubmit = false;
		}
		return isSubmit;
	});
}

function validateFormAjax(form, ajaxRules) {
	var ajaxSuccess = true;
	$(form).find('input[type="text"]').each(function(index) {
		var name = $(this).attr("name");
		if(ajaxRules.hasOwnProperty(name)) {
			if(validateInputAjax(this, ajaxRules[name])) {
				ajaxSuccess = true;
			} else {
				ajaxSuccess = false;
			}
		}
	});
}

function validateForm(form, rules) {
	var allSuccess = true;
	$(form).find('input[type="text"]').each(function(index) {
		var name = $(this).attr("name");
		if(rules.hasOwnProperty(name)) {
			allSuccess = validateInput(this, rules[name]);
		}
	});
	return allSuccess;
}

function validateInputAjax(obj, ajaxRule) {
	$(obj).data("ajax",false);
	alert($(obj).val());
	if(!$(obj).data("local")) {
		return;
	}
	var isSuccess = false;
	var url = ajaxRule.url;
	var key = ajaxRule.key;
	var value = $(obj).val();
	$.get(url, {
		key : value
	}, function(data) {
		if(data == "true") {
			isSuccess = true;
		}
	});
	if(isSuccess) {
		if(ajaxRule.hasOwnProperty("onSuccess")) {
			ajaxRule.onSuccess(obj);
		}
	} else {
		if(ajaxRule.hasOwnProperty("onFailed")) {
			ajaxRule.onFailed(obj);
		}
	}
	$(obj).data("ajax", isSuccess);
}

function validateInput(obj, rule) {
	var value = $(obj).val();
	var type = rule["vtype"];
	var isSuccess = false;
	switch(type) {
		case "email":

			if(validateEmail(value)) {
				isSuccess = true;
			}
			break;
		case "string":
			if(validateString(value, rule)) {
				isSuccess = true;
			}
			break;
		case "num":
			if(validateNum(value, rule)) {
				isSuccess = true;
			}
			break;
	}
	if(isSuccess) {

		if(rule.hasOwnProperty("onSuccess")) {
			rule.onSuccess(obj);
		}
	} else {
		if(rule.hasOwnProperty("onFailed")) {
			rule.onFailed(obj);
		}
	}
	$(obj).data("local", isSuccess);
	return isSuccess;
}

function validateString(value, rule) {
	var minLen = rule.minLength;
	var maxLen = rule.maxLength;
	if(value.length >= minLen && value.length <= maxLen) {
		return true;
	} else {
		return false;
	}
}

function validateNum(value, rule) {
	var tmp = parseInt(value);
	if(tmp == 'NaN') {
		return false;
	}
	var minLen = rule.min;
	var maxLen = rule.max;
	if(tmp >= minLen && tmp <= maxLen) {
		return true;
	} else {
		return false;
	}
}

function validateEmail(value) {
	var reg_email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	return validateByReg(value, reg_email);
}

function validateByReg(value, reg) {
	if(reg.test(value)) {
		return true;
	} else {
		return false;
	}
}