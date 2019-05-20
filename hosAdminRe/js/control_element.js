/**
 * 动态删减元素
 */
var that;
var controlEle = {
	arr_element: [],//存元素
	arr_element_id: [],//存元素id
	//添加科室
	add_element: function (m,n){
		var arr_child = [];//一维
        arr_child.push(m);
        arr_child.push(n);
	
		console.log(arr_child);
		this.arr_element.push(arr_child);//二维
		console.log(this.arr_element);
		//初始化已选择的科室
		this.init_element(this.arr_element);
	},
    add_newelement: function (m,n){
        var arr_child = [];//一维

        arr_child.push({'name':n,'id':m});
        console.log(arr_child);
        this.arr_element.push(arr_child[0]);//二维
        console.log(this.arr_element);
        //初始化已选择的科室
        this.init_newelement(this.arr_element);
    },
	//获取科室的id
	get_element_id: function(m){
		console.log(m);
		var arr_id = [];
		for(var i=0;i<m.length;i++){
			arr_id.push(m[i][0]);
		}
		console.log(arr_id);
		return arr_id;
	},
    //获取科室的id
    get_newelement_id: function(m){
        console.log(m);
        var arr_id = [];
        for(var i=0;i<m.length;i++){
            arr_id.push(m[i]['id']);
        }
        console.log(arr_id);
        return arr_id;
    },
	//删除已添加的科室
	del_element: function(m){
		var i = $(m).parent().index();
		console.log(i);
		console.log(this.arr_element);
		this.arr_element.splice(i,1);
		console.log(this.arr_element);
		//初始化
		this.init_element(this.arr_element);
	},
    //删除已添加的科室
    del_newelement: function(m){
        var i = $(m).parent().index();
        console.log(i);
        console.log(this.arr_element);
        this.arr_element.splice(i,1);
        console.log(this.arr_element);
        //初始化
        this.init_newelement(this.arr_element);
    },
	//初始化已选择的科室
	init_element: function(m){
		that = this;
		console.log(m);
		//去重
		m=$.twoRepetition(m);
		console.log(m);
		var html = "";
		$(m).each(function(key,val){
			html=html+"<p data_val='"+val[0]+"'><span>"+val[1]+"</span><img src='img/close2.png' class='none' onclick='that.del_element(this)'/></p>"
		});
		$(".ele_container").html(html);
		//获取已选择的科室id
		this.arr_element_id = this.get_element_id(m);
	},
    //初始化已选择的科室
    init_newelement: function(m){
        that = this;
        console.log(m);
        //去重
        m=$.twoRepetition(m);
        console.log(m);
        var html = "";
        $(m).each(function(key,val){
            html=html+"<p data_val='"+val['id']+"'><span>"+val['name']+"</span><img src='img/close2.png' class='none' onclick='that.del_newelement(this)'/></p>"
        });
        $(".ele_container").html(html);
        //获取已选择的科室id

        //初始化
        this.arr_element = m ;//二维
        this.arr_element_id = this.get_newelement_id(m);
    },
	//初始化约定病种
 	hashToTwoArr: function(m){
		console.log(m);
		var i=0;
		var arr_parent=[];
		//病种数据转二维数组，并且
		for(var i=0;i<m.length;i++){
			var arr_child = [];
			$.each(m[i],function(key,val){
				arr_child.push(val);
			})
			arr_parent.push(arr_child.reverse());
		}
	//	console.log(arr_parent);
		//初始化添加的科室
		this.arr_element = arr_parent;
		this.init_element(this.arr_element);
		//初始化科室id
		this.arr_element_id = this.get_element_id(this.arr_element);
		console.log(this.arr_element_id);
	}
}
