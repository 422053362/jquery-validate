/**
 * @author peng
 */
function testArray(option) {
	alert(option.name1.toSource());
	alert(option.name1.toString());
	alert(option.name1.toLocaleString());
	alert(option.name1);
};

function success(obj) {
	var str ="<a>"+$(obj).attr("name")+"正确</a>";
	$(str).insertAfter("#sub");
	return true;
};

function failed(obj) {
	var str ="<div>"+$(obj).attr("name")+"错误</div>";
	$(str).insertAfter("#sub");
	return false;
};
function submit1(form){
	alert("submit");
	return false;
}
