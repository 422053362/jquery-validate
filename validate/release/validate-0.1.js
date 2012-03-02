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
		var name = $(this).attr("name");
		if(rules.hasOwnProperty(name)) {
			$(this).blur(function() {
				validateInput(this, rules[name]);
			});
		}
	});

	$(form).submit(function() {
		var isSubmit = true;
		if(validateForm(form, options.rules)) {
			if(options.hasOwnProperty("onSubmit")) {
				isSubmit = options.onSubmit(this);
			}
		} else {
			isSubmit = false;
		}
		return isSubmit;
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