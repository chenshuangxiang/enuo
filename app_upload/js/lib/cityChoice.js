Vue.component('com-citychoice',{
	data:function(){
		return {
			isCancel:false,
			zimShow:false,
			ssval:'',
			zimText:'',
            msg:'',
            Interval:null,
            sidabers:[],//['热门','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'],
            citys:[],
            nowProvince:'',
            nowCity:'',
            nowProvinceCity:'',
            nowCityList:[],
			hostCitys:[],
			hotCitys:[{city:'杭州',py:'hangzhou',parent_name:"浙江"},{city:'广州',py:'guangzhou',parent_name:"广东"},
                {city:'深圳',py:'shenzhen',parent_name:"广东"}, {city:'武汉',py:'wuhan',parent_name:"湖北"},
                {city:'成都',py:'chengdu',parent_name:"四川"},{city:'长沙',py:'changsha',parent_name:"湖南"},
                {city:'哈尔滨',py:'haerbin',parent_name:"黑龙江"}, {city:'南京',py:'nanjing',parent_name:"江苏"},
                {city:'厦门',py:'xiamen',parent_name:"福建"}, {city:'合肥',py:'hefei',parent_name:"安徽"},
                {city:'郑州',py:'zhengzhou',parent_name:"河南"},{city:'济南',py:'jinan',parent_name:"山东"}]
		}
	},
	template:`
    <div>
        <div class="msgVue">
            <span class="msgTextVue"></span>
        </div>
		<section class="cityChoiceBox" id="cityChoiceBox">
			<article class="cityChoice-top transit" v-bind:class='{focus:isCancel}'>
				<transition enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
					<span class="fa fa-angle-left" v-if='!isCancel' v-on:click='cityClose'></span>
				</transition>
				<input type="text" class="search-input" style="font-size: .8rem" placeholder="中文/拼音/首写字母" v-model.trim='ssval' v-on:focus='search' />
				<transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
					<i v-if='isCancel' v-on:click='isCancel=false' class="cancel">取消</i>
				</transition>
			</article>
			<article class="city-Box" v-show='!isCancel'>
				<div class="city-sidaber" id="city-sidaber" v-show='!isCancel'>
					<p v-for="(sidaber,index) in sidabers" v-on:touchstart='mousedownFun(index)' v-on:touchend='mouseupFun(index)' v-text='sidaber'></p>
				</div>
				<div style="background-color: #F0F0F0;height: 0.7rem"></div>
				<div class="now-city">
					<!--<h3 style="height: 2.3rem;line-height: 2.3rem;border-bottom: 1px solid #e5e5e5;">当前定位地址</h3>-->
					<p style="height: 2.3rem;line-height: 2.3rem;"><span style="font-size: .85rem">当前定位地址</span><span v-on:click='cityOpen(nowCityList[0].city,nowCityList[0].parentName,1)' style="float: right;margin-right: .3rem;color: #00cbbd">{{nowProvinceCity}}</span></p>
				</div>
				<div style="background-color: #F0F0F0;height: 0.7rem"></div>
				<div class="host-city" style="display: none;">
					<h3>热门城市</h3>
					<span v-for='(item,index) in hostCitys' v-text='item.city' v-on:click='cityactive(index,hostCitys)'></span>
				</div>
				<div class="city-content">
				<div v-for='(itemsida,index) in sidabers'>
				    <h3>{{itemsida}}</h3>
				    <p v-for="(item,index) in cityFilter(itemsida)" v-on:click='cityactive(index,cityFilter(itemsida))'>{{item.city}}</p>
                </div>
					<!--<h3>A</h3>
					<p v-for='(item,index) in cityA' v-on:click='cityactive(index,cityA)'>{{item.city}}</p>
					<h3>B</h3>
					<p v-for='(item,index) in cityB' v-on:click='cityactive(index,cityB)'>{{item.city}}</p>
					<h3>C</h3>
					<p v-for='(item,index) in cityC' v-on:click='cityactive(index,cityC)'>{{item.city}}</p>
					<h3>D</h3>
					<p v-for='(item,index) in cityD' v-on:click='cityactive(index,cityD)'>{{item.city}}</p>
					<h3>E</h3>
					<p v-for='(item,index) in cityE' v-on:click='cityactive(index,cityE)'>{{item.city}}</p>
					<h3>F</h3>
					<p v-for='(item,index) in cityF' v-on:click='cityactive(index,cityF)'>{{item.city}}</p>
					<h3>G</h3>
					<p v-for='(item,index) in cityG' v-on:click='cityactive(index,cityG)'>{{item.city}}</p>
					<h3>H</h3>
					<p v-for='(item,index) in cityH' v-on:click='cityactive(index,cityH)'>{{item.city}}</p>
					<h3>J</h3>
					<p v-for='(item,index) in cityJ' v-on:click='cityactive(index,cityJ)'>{{item.city}}</p>
					<h3>K</h3>
					<p v-for='(item,index) in cityK' v-on:click='cityactive(index,cityK)'>{{item.city}}</p>
					<h3>L</h3>
					<p v-for='(item,index) in cityL' v-on:click='cityactive(index,cityL)'>{{item.city}}</p>
					<h3>M</h3>
					<p v-for='(item,index) in cityM' v-on:click='cityactive(index,cityM)'>{{item.city}}</p>
					<h3>N</h3>
					<p v-for='(item,index) in cityN' v-on:click='cityactive(index,cityN)'>{{item.city}}</p>
					<h3>P</h3>
					<p v-for='(item,index) in cityP' v-on:click='cityactive(index,cityP)'>{{item.city}}</p>
					<h3>Q</h3>
					<p v-for='(item,index) in cityQ' v-on:click='cityactive(index,cityQ)'>{{item.city}}</p>
					<h3>R</h3>
					<p v-for='(item,index) in cityR' v-on:click='cityactive(index,cityR)'>{{item.city}}</p>
					<h3>S</h3>
					<p v-for='(item,index) in cityS' v-on:click='cityactive(index,cityS)'>{{item.city}}</p>
					<h3>T</h3>
					<p v-for='(item,index) in cityT' v-on:click='cityactive(index,cityT)'>{{item.city}}</p>
					<h3>W</h3>
					<p v-for='(item,index) in cityW' v-on:click='cityactive(index,cityW)'>{{item.city}}</p>
					<h3>X</h3>
					<p v-for='(item,index) in cityX' v-on:click='cityactive(index,cityX)'>{{item.city}}</p>
					<h3>Y</h3>
					<p v-for='(item,index) in cityY' v-on:click='cityactive(index,cityY)'>{{item.city}}</p>
					<h3>Z</h3>
					<p v-for='(item,index) in cityZ' v-on:click='cityactive(index,cityZ)'>{{item.city}}</p>-->
				</div>
				<div v-show='zimShow' class="zimShow" v-text='zimText'></div>
			</article>
			<article class="search-box" id="search-box" v-show='isCancel'>
				<p class="sousuo" v-for='(item,index) in sousuos' v-on:click='cityactive(index,sousuos)'>{{item.city}}</p>
			</article>
		</section>
		</div>
	`,
	methods:{
        cityFilter:function (Pin) {
            var Pin = Pin;
            return this.citys.filter(function (item) {
                //console.log(item.py.substr(0, 1)==Pin.toLowerCase())
                return item.py.substr(0, 1)==Pin.toLowerCase();
            });
        },
		//调用城市选择组件
		cityFun:function(){
	        var cityChoiceBox=document.getElementById('cityChoiceBox');
	        var citySidaber=document.getElementById('city-sidaber');
	        var clientW=document.documentElement.clientWidth||document.body.clientWidth;
	        cityChoiceBox.style.left=clientW+'px';
	        cityChoiceBox.style.display="block"
	        this.starMove(cityChoiceBox,{left:0},function(){
	        	citySidaber.style.display="block"
	        });
	     },
	     //关闭城市选择组件
        cityClose: function () {
            this.isCancel = false;
            var cityChoiceBox = document.getElementById('cityChoiceBox');
            var citySidaber = document.getElementById('city-sidaber');
            var clientW = document.documentElement.clientWidth || document.body.clientWidth;
            citySidaber.style.display = "none"
            this.starMove(cityChoiceBox, {left: clientW}, function () {
                cityChoiceBox.style.display = "none"
            });
            $('.xywz').css('position','relative');
            window.scrollTo(0,0);
        },
	     //变速运动
	     starMove:function(obj,json,fn){//添加一个回调函数fn
	        function getStyle(obj,attr){
	          if(obj.currentStyle){
	            return obj.currentStyle[attr];
	            }else{
	              return getComputedStyle(obj,false)[attr];
	              }
	    	}
	        clearInterval(obj.timer);
	        obj.timer = setInterval(function(){
	          var flag = true; //假设都到达了目标值
	          for(var attr in json){
	            //1.取当前值
	            var icur = 0;
	            icur = parseInt(getStyle(obj,attr));
	            //2.算速度
	            var speed = (json[attr] - icur)/8;
	            speed = speed>0?Math.ceil(speed):Math.floor(speed);
	            //3.检查停止
	            if(icur != json[attr]){
	              flag = false;
	            }
	            obj.style[attr] = icur + speed + "px";
	            if(flag){
	              clearInterval(obj.timer);
	              if(fn){//判断是否存在回调函数,并调用
	                fn();
	                }
	              }
	            }
	        },20);
	    },
	    //搜索框获取焦点进入搜索层
	    search:function(){
	    	this.isCancel=true;
	    },
	    //热门活动
	    hostCityss:function(){
			var j=0;
			for(var i=0;i<12;i++){
               Vue.set(this.hostCitys,j,this.hotCitys[i]);
               j++
         	}
		},
		cityactive:function(index,cityss){
            console.log(index,cityss)
			this.cityClose();
			this.zimShow=false;
			//this.$emit("tochildevent",cityss[index].city,cityss[index].parent_name)
            console.log(cityss[index].city,cityss[index].parentName);
            this.emitCity(cityss[index].city,cityss[index].parentName);
		},
        surecity:function(city,province){
            this.cityClose();
            this.zimShow=false;
            this.emitCity(city,province);
        },
        emitCity:function (city, province) {
            this.$emit("tochildevent", city, province);
            localStorage.setItem('province', province);
            localStorage.setItem('city', city);
            Get.tuiMore(city,province); //加入推荐
        },
		//侧栏字母鼠标按下事件
		mousedownFun:function(index){
			this.zimShow=!this.zimShow;
			this.zimText=this.sidabers[index]
		},
		//侧栏字母鼠标弹起事件
		mouseupFun:function(index){
			this.zimShow=!this.zimShow;
			var cityChoiceBox=document.getElementById('cityChoiceBox');
			var h3=cityChoiceBox.getElementsByTagName('h3');
			var timer = null;	
			function scrT(iTarget){
				clearInterval(timer);
				document.ontouchstart=function(){
					clearInterval(timer);
				}
				timer = setInterval(function(){
				var scrollT = document.documentElement.scrollTop || document.body.scrollTop,
				    speed = 0;
				speed = Math.floor((iTarget - scrollT)/5);
				if(scrollT == iTarget){
					clearInterval(timer);
					}else{
						document.documentElement.scrollTop = scrollT + speed;
						document.body.scrollTop = scrollT + speed;
						}
				},30);
			}
			scrT(h3[index].offsetTop-50);
		},
        getLocationCity:function () {
            var geolocation = new BMap.Geolocation();
            var gc = new BMap.Geocoder();
            var city = '';
            var province = '';
            var elThis = this;

            geolocation.getCurrentPosition(function (r) {
                console.log(r)

                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    //appLat = r.point.lat;
                    //appLng = r.point.lng;
                    var pt = r.point;
                    elThis.getLocation(gc,pt,city,province)
                } else {
                    //获取失败，判断是否有历史（有：显示上次定位的 无：提示定位失败（去选择：显示选择的），（取消：切到杭州））
                    if(localStorage.getItem('province') != null && localStorage.getItem('city') != null){ //有历史
                        //历史城市查询
                        elThis.emitCity(localStorage.getItem('city'),localStorage.getItem('province'));
                    }else{
                        var r = confirm("定位失败，去手动选择城市？")
                        if (r == true) {
                            elThis.cityFun();
                        } else {
                            //杭州查询
                            elThis.emitCity('杭州','浙江');
                        }
                    }
                }
            }, {enableHighAccuracy: true});
        },
        getLocation:function (gc,pt,city,province) {
            var elThis = this;
            gc.getLocation(pt, function (rs) {

                var addComp = rs.addressComponents;
                /*setTimeout(function () {
                    $('.msgVue').fadeIn();
                    $('.msgTextVue').html(addComp.province);
                },2000)*/
                console.log(addComp)
                var addCompCity = addComp.city;
                var addCompProvince = addComp.province;

                elThis.nowProvinceCity = addCompProvince + addCompCity;

                if (addCompCity.indexOf('市') != '-1') {
                    city = addCompCity.split('市')[0];
                } else if (addCompCity.indexOf('区') != '-1') {
                    city = addCompCity.split('区')[0];
                }
                if (addCompProvince.indexOf('省') != '-1') {
                    province = addCompProvince.split('省')[0];
                } else if (addCompProvince.indexOf('市') != '-1') {
                    province = addCompProvince.split('市')[0];
                }
                //this.data = reset_addwrite();
                elThis.nowCityList.push({city:city,parentName:province});
                console.log(city, province)
                //判断是否开通
                elThis.cityOpen(city, province);
            });
        },
        openCity:function () {
            var url = SERVER_ADDR + '/app/common/findOpenCity';
            var Data = '';
            var firstPinList = [];
            var elthis = this;
            ajaxGetRetInfo(url, Data, function (data) {
                console.log(data.data)
                data.data.forEach(function (value) {
                    value.city = value.areaName;
                    value.py = pinyin.getFullChars(value.areaName).toLowerCase(); //获取拼音用于筛选
                    elthis.citys.push(value);//开通的城市

                    var valueFirstPin = pinyin.getCamelChars(value.areaName).substr(0, 1);
                    if(firstPinList.indexOf(valueFirstPin) == -1){
                        firstPinList.push(valueFirstPin);
                    }
                    firstPinList.sort(function(a,b){
                        return a.localeCompare(b);
                    });
                   // console.log(firstPinList);
                })
                firstPinList.forEach(function (value) {
                    elthis.sidabers.push(value);   //首字母
                })
            }, '请求失败', 'GET', undefined, undefined);
        },
        cityOpen:function (city,province,now) {
            var city = city;
            var province = province;
            var now = now; // ==1是代表看当前定位
            console.log(now)
            var url = SERVER_ADDR + '/app/common/findArea';
            var Data = {};
            Data.provinceName = province;
            Data.cityName = city;
            var elThis = this;
            ajaxGetRetInfo(url, Data, function (retInfo) {
                if(retInfo.success == true){
                    if(retInfo.data == '未开通'){ //定位城市未开通
                        if(localStorage.getItem('province') != null && localStorage.getItem('city') != null){ //有历史定位城市
                            console.log('当前城市暂未开通，系统为您切换最近一次定位城市');
                            $('.msgVue').fadeIn();
                            $('.msgTextVue').html(city+'暂未开通，<br>系统为您切换到最近一次定位城市');
                            setTimeout(function () {$('.msgVue').fadeOut();},3000);
                            // 历史城市查询
                            elThis.surecity(localStorage.getItem('city'),localStorage.getItem('province'))
                        }else{
                            console.log('当前城市暂未开通，系统为您切换到杭州市');
                            $('.msgVue').fadeIn();
                            $('.msgTextVue').html(city+'暂未开通，<br>系统为您切换到杭州市');
                            setTimeout(function () {$('.msgVue').fadeOut();},2000);
                            // 杭州查询
                            elThis.surecity('杭州','浙江');
                        }
                    }else {
                        //开通了，判断历史城市数据（有：提示是否切换到当前城市（切换就当前，不切换就历史）。没有：显示定位的城市）
                        if(localStorage.getItem('province') != null && localStorage.getItem('city') != null){ //有历史定位城市
                            //有一个不相等则提示切换
                            if(localStorage.getItem('province') != province || localStorage.getItem('city') != city){
                                if(localStorage.getItem('removeTime') == null || localStorage.getItem('removeTime') > 86400 || now == 1){ //大于一天才弹出切换
                                    var r = confirm("是否切换到当前城市？")
                                    if (r == true) {
                                        // 定位城市查询
                                        elThis.surecity(city,province);
                                        localStorage.removeItem('removeTime');
                                        clearInterval(elThis.Interval);
                                        elThis.Interval = null;
                                    } else {
                                        // 历史城市查询
                                        elThis.surecity(localStorage.getItem('city'),localStorage.getItem('province'));
                                        localStorage.setItem('removeTime',0);
                                        elThis.setIntervalCity();
                                    }
                                }else{
                                    // 历史城市查询
                                    elThis.surecity(localStorage.getItem('city'),localStorage.getItem('province'));
                                    localStorage.setItem('removeTime',localStorage.getItem('removeTime') || 0);
                                    elThis.setIntervalCity();
                                }

                            }else{
                                // 新老城市一致
                                elThis.surecity(city,province);
                            }
                        }else{
                            // 定位城市查询
                            elThis.surecity(city,province);
                        }
                    }
                }else{
                    console.log(retInfo.data)
                }
            }, '请求失败', 'GET', undefined, undefined);
        },
        setIntervalCity:function () {
            clearInterval(this.Interval);
            this.Interval = null;
            this.Interval = setInterval(function () { //计算城市弹出推荐的时间
                var i = Number(localStorage.getItem('removeTime'));
                i++;
                localStorage.setItem('removeTime', i);
            },1000)
        }
	},
	//首字母过滤
	computed: {
        /*cityA: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='a';
            });
        },
        cityB: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='b';
            });
        },
        cityC: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='c';
            });
        },
        cityD: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='d';
            });
        },
        cityE: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='e';
            });
        },
        cityF: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='f';
            });
        },
        cityG: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='g';
            });
        },
        cityH: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='h';
            });
        },
        cityJ: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='j';
            });
        },
        cityK: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='k';
            });
        },
        cityL: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='l';
            });
        },
        cityM: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='m';
            });
        },
        cityN: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='n';
            });
        },
        cityP: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='p';
            });
        },
        cityQ: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='q';
            });
        },
        cityR: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='r';
            });
        },
        cityS: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='s';
            });
        },
        cityT: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='t';
            });
        },
        cityW: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='w';
            });
        },
        cityX: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='x';
            });
        },
        cityY: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='y';
            });
        },
        cityZ: function () {
            return this.citys.filter(function (item) {
                return item.py.substr(0, 1)=='z';
            });
        },*/
        //搜索过滤
        sousuos:function(){
        	var ssval = this.ssval;
        	return this.citys.filter(function (item) {
                return item.py.indexOf(ssval)!= -1 || item.city.indexOf(ssval) != -1;
            });
        }
    },
	mounted:function(){
		window.addEventListener('load',function(){
			var searchBox=document.getElementById('search-box');
			//var srollH=document.documentElement.scrollHeight;
            searchBox.style.minHeight = (window.innerHeight - 45) + 'px';
            document.getElementById('cityChoiceBox').style.minHeight = window.innerHeight + 'px';
		});
		this.hostCityss();
        this.openCity(); //获取开通的城市
        if(is_weixn()){
            var gc = new BMap.Geocoder();
            var pt = new BMap.Point(localStorage.getItem("longitude"),localStorage.getItem("latitude"));
            var city = '';
            var province = '';
            this.getLocation(gc,pt,city,province)
        }else{
            this.getLocationCity();
        }
	}
})