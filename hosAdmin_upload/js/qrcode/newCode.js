function newCode(tag,val){
	//m:选择的元素
	var str = toUtf8(val);
	//默认使用(canvas)方式
	$(tag).qrcode(str);
	//还可以自定义(table)调用
//	$(tag).qrcode({
//		render:"table",//table方式
//		width:200,//宽度
//		height:200,//高度
//		text:str//任意内容
//	});
}
//转码方法(中文)
function toUtf8(str){
	var out, i, len, c;   
    out = "";   
    len = str.length;   
    for(i = 0; i < len; i++) {   
    	c = str.charCodeAt(i);   
    	if ((c >= 0x0001) && (c <= 0x007F)) {   
        	out += str.charAt(i);   
    	} else if (c > 0x07FF) {   
        	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));   
        	out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));   
        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
    	} else {   
        	out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));   
        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
    	}   
    }   
    return out;   
}