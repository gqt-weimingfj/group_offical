$(function () {
	$doc = $(document);
	$body = $('body');

	// 侧栏效果
	$body.on('click','.side-content .sup-menu-item',function (){
		var _$s = $(this); 
		var _$supMenu = $(this).parent(); 
		var _$subMenu = $(this).next('.sub-menu');
		if (_$subMenu.is(':visible')) {
			_$subMenu.slideUp(function(){
				_$supMenu.removeClass('active')
			});
		}else{
			_$subMenu.slideDown(function(){
				_$supMenu.addClass('active')
			});
		}
	});
});