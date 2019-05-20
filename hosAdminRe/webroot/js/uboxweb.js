
var  CODER_ALAW		= 0;
var  CODER_PCM		= 1;
var	 CODER_G729		= 3;
var	 CODER_SPEEX		= 20;
var	 CODER_ULAW		= 100;

var   UBOX_MODE_RECORD	= 0;		//录音模式， 通常使用的模式
var	  UBOX_MODE_DIAG		= 1;		//诊断模式， 用于捕获线路信息，供信号分析之用，支持的语音编码方式是CODER_PCM
var	  UBOX_MODE_CONFIG	= 2;		//配置模式，
var  hdl = -1;

var     UBOX_STATE_RESET     = 1;			//复位态，表示既非振铃也非摘机的状态。如果此前为振铃态，则此状态表示振铃已停止，如果此前为摘机态，则此状态表示已挂机。
var		UBOX_STATE_RINGING   = 2;			//振铃态，表示已检测到线路振铃信号，如果振铃停止，则将触发 UBOX_EVENT_RESET 事件，并汇报 UBOX_STATE_RESET 状态。
var		UBOX_STATE_HOOK_OFF  = 3;			//摘机态，
var		UBOX_STATE_HANG		 = 4;			  //悬空态，
var     UBOX_STATE_IDLE     = 5;              //空闲中，挂机
var		UBOX_STATE_REVERSE_HOOKOFF = 6;     //反向摘机，指软件摘机
var		UBOX_STATE_POSITIVIE_HOOKOFF = 7;   //正向摘机，指软件摘机

var      SLIC_TO_GSM	= 0;		//SLIC到GSM方向
var		 GSM_TO_SLIC = 1;	    //GSM到SLIC方向
var		EARPHONE_TO_GSM	= 2;	//
var		GSM_TO_EARPHONE =3;
var		SLIC_TO_EARPHONE = 4;
var		EARPHONE_TO_SLIC = 5;
var		USB_TO_EARPHONE = 6;
var		USB_TO_GSM = 7;
var		US_TO_SLIC = 8;

var   	SLIC_REC_	= 0;		//SLIC录音
var		GSM_REC = 1;	         //GSM录音
var		EARPHONE_REC	= 2;	//Earphone录音
var     short_msg_number = 0;

var  ubox={                    //全局声明
            lines:[],
			linenum:0
		 };
	
var  ws = null;	
function AppendStatus(szStatus)
{
   var  thisTime =new Date(); 

    var time = thisTime.getHours()+":"+thisTime.getMinutes()+":"+thisTime.getSeconds()+"    ";
	document.getElementById("StatusArea").value +=time;
	document.getElementById("StatusArea").value +=szStatus;
	document.getElementById("StatusArea").value +="\r\n";
    var scrollTop = $("#StatusArea")[0].scrollHeight;  
    $("#StatusArea").scrollTop(scrollTop);  
}

function  Get_Error(result)
{
       var error ="";
		switch( result)
		{
		case 0:
			error = "操作成功";	
			break;
		case -1:
			error = "系统错误";	
			break;
		case -2:
			error = "无此设备";	
			break;
		case -3:
			error = " 非法的 UBOX_HANDLE";	
			break;
		case -4:
			error = "非法参数";	
			break;
		case -10:
			error = "未能创建目录";	
			break;
		case -11:
			error = " 未能创建录音文件";	
			break;
		case -12:
			error = "不支持的语音编码";	
			break;
		case -6:
			error = "错误的工作模式";	
			break;
		case -5:
			error = "发生异常";	
			break;
		case -13:
			error = "设备忙";	
			break;
		case -7:
			error = " ubox设备尚未打开";	
			break;


		default:
			error = "未定义的错误码";	
			break;
		}
	return error;
}

function changelinenum(This)
{
	if(ubox.lines[This.value] == undefined)
	   alert("USB盒子未插入");
	 else
	    hdl = ubox.lines[This.value].handle; 
   
}	 

function Ubox_Plug_In(uboxhdl)
{
   
   var outdata = "设备插入 句柄号:"+uboxhdl;
   
   if(ubox.linenum == 2)      //不考虑三个通道
      return;
	  
   	ubox.linenum++;
   	if( ubox.lines[uboxhdl] == undefined ){
				ubox.lines[uboxhdl] = {};
			}

	ubox.lines[uboxhdl].handle = uboxhdl;
	ubox.lines[uboxhdl].callernumber = "";
    ubox.lines[uboxhdl].dtmfkyes = "";
	ubox.lines[uboxhdl].lineid = ubox.linenum;
	ubox.lines[uboxhdl].state =  UBOX_STATE_IDLE;
	ubox.lines[uboxhdl].record = 0;
	ubox.lines[uboxhdl].productid = 0;	
	if(ubox.linenum == 1)
	{
	    hdl = ubox.lines[uboxhdl].handle;
     	document.getElementById("lineid1").disabled=false;
		document.getElementById("lineid1").value=uboxhdl;
	}
	else
	{
     	document.getElementById("lineid2").disabled=false;
		document.getElementById("lineid2").value=uboxhdl;
	}
   	var msg = {
		   "event": "GetProductID",
		   "handle": uboxhdl
	};
		AppendStatus("获取型号")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
   AppendStatus(outdata);

}

function Ubox_hookoff(uboxhdl)
{
  
   var outdata = "设备"+uboxhdl;
  /* var rec_name = "";
	var curDate = new Date();
	var year = curDate.getFullYear();
	var month = curDate.getMonth()+1;
	var day = curDate.getDate();
	var hours= curDate.getHours();
	var minutes = curDate.getMinutes();
	var seconds = curDate.getSeconds();
    if(ubox.lines[uboxhdl].state ==  UBOX_STATE_RINGING)
     {
		AppendStatus(outdata+" 呼入摘机");
		rec_name = "D:\\record\\IN_"+year+"-"+month+"-"+day+"-"+hours+"-"+minutes+"-"+seconds+".wav";
	 }
	else
	{
	   AppendStatus(outdata+" 呼出摘机");  
	   rec_name = "D:\\record\\OUT_"+year+"-"+month+"-"+day+"-"+hours+"-"+minutes+"-"+seconds+".wav";
	}
	   
	 ubox.lines[uboxhdl].state =  UBOX_STATE_HOOK_OFF;
	if(ubox.lines[uboxhdl].record == 0)
	{
		var msg = {
			   "event": "RecordFile",
			   "handle": uboxhdl,
			   "filename":rec_name,
			   "codec":  CODER_ALAW
			};
			AppendStatus("开始录音...")
			
			如果失败， 在notify 消息中，会报错的
		
		  websocket_send_msg(JSON.stringify(msg));
		  ubox.lines[uboxhdl].record = 1;
	  }
	 */
}

function Ubox_hookon(uboxhdl)
{
   var outdata = "设备"+uboxhdl;
	ubox.lines[uboxhdl].state =  UBOX_STATE_IDLE;
    AppendStatus(outdata+" 挂机");
	ubox.lines[uboxhdl].record = 0;
	if(hdl != -1)
	{
		var msg = {
		   "event": "StopRecord",
		   "handle": uboxhdl
		};
	   /*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
		AppendStatus("已经停止录音");
	}

}

function Ubox_CallId(uboxHandle,callerNumber)
{
  
   var outdata = "设备"+uboxHandle+"号码："+callerNumber ;

    AppendStatus(outdata);

}


function ubox_Ring(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 振铃");
	ubox.lines[uboxhdl].state =  UBOX_STATE_RINGING;
}

function ubox_RingCancel(uboxhdl)
{
   var outdata = "设备"+uboxhdl;
  	ubox.lines[uboxhdl].state =  UBOX_STATE_IDLE;
    AppendStatus(outdata+" 振铃取消");

}

function ubox_RingStop(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 停振");

}

function ubox_ToneBusy(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 忙音");

}

function ubox_DeviceAlarm(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 警告，重启软件");

}

function ubox_DeviceError(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 错误，重启软件");

}

function ubox_DtmfKey(uboxHandle,dtmfCode)
{

   var outdata = "设备"+uboxHandle+"按键:"+(dtmfCode-48);

    AppendStatus(outdata);

}

function ubox_HangIng(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 电话未连接好");
   if( ubox.lines[uboxhdl].record  == 1)
   {
			ubox.lines[uboxhdl].record = 0;
			if(hdl != -1)
			{
				var msg = {
				   "event": "StopRecord",
				   "handle": uboxhdl
				};
			   /*
				如果失败， 在notify 消息中，会报错的
				*/
				websocket_send_msg(JSON.stringify(msg));
				AppendStatus("已经停止录音");
			}
   }
}

function ubox_LineVoltage(uboxhdl,voltage)
{
   var outdata = "设备"+uboxhdl+"线路电压:"+voltage;

    AppendStatus(outdata);

}

function ubox_PlayEnd(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 放音结束");

}

function ubox_PlugOut(uboxhdl)
{
   var outdata = "设备"+uboxhdl;
   
  /* for(int i=1;i<=ubox.linenum;i++)
   {
       if(ubox.lines[i]==undefine)
   }*/
  ubox.lines[uboxhdl].handle = -1;
  ubox.lines[uboxhdl] = undefined;
  ubox.linenum -= 1;
  AppendStatus(outdata+" 拨出");
  hdl=-1;

}

function ubox_PlayError(uboxhdl)
{
   var outdata = "设备"+uboxhdl;

    AppendStatus(outdata+" 放音错误");

}

/*
function ubox_openDevice()
{

 try{
    //  Phonic_usb.OpenLogFile(0);
	Phonic_usb.OpenLogFileEx("D:\\logs");
	  AppendStatus("open log debug2");
 	var uChannelNum=Phonic_usb.OpenDevice(0);
 	if(uChannelNum == 0)
 	{
 		AppendStatus("已经初始化设备成功");

 	}
	else
 	{
	 	AppendStatus("打开设备失败");		
 	}
 }catch(e)
 {
 }

}

function ubox_CloseDevice()
{

	Phonic_usb.CloseDevice();
	AppendStatus("关闭设备完成.");
	Phonic_usb.CloseLogFile();

}
*/


function setrecordenable()
{
	//alert($('#slicrecEnable').val());
if(hdl != -1)
	{
		var msg = {
		   "event": "set_record_enable",
		   "handle": hdl,
		   "mode": 0,
		   "value":0
		};
		msg.mode = SLIC_REC_;
		if ($('#slicrecEnable').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = GSM_REC;
		if ($('#gsmrecEnable').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = EARPHONE_REC;
		if ($('#earphonerecEnable').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
        AppendStatus("设置record switch");
	}

	
}

function settalkEnable()
{
	if(hdl != -1)
	{
		var msg = {
		   "event": "set_talk_link",
		   "handle": hdl,
		   "mode": 0,
		   "value":0
		};
		msg.mode = SLIC_TO_GSM;
		if ($('#sliToGsm').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = GSM_TO_SLIC;
		if ($('#GsmToslic').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = EARPHONE_TO_GSM;
		if ($('#earphoneToGsm').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = GSM_TO_EARPHONE;
		if ($('#GsmToearphone').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = EARPHONE_TO_SLIC;
		if ($('#earphoneToslic').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = SLIC_TO_EARPHONE;
		if ($('#slicToearphone').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = USB_TO_EARPHONE;
		if ($('#usbToearphone').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = USB_TO_GSM;
		if ($('#usbToGsm').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));
		
		msg.mode = US_TO_SLIC;
		if ($('#usbToslic').prop("checked"))
		{
				//alert("选中");
		    msg.value = 1;
		} 
		else 
		{
				//alert("没有选中");
			msg.value = 0;
		}	
		websocket_send_msg(JSON.stringify(msg));


        AppendStatus("设置talk link")
	   /*
		如果失败， 在notify 消息中，会报错的
		*/
		
		//AppendStatus("已经停止录音");
	}

}


function ubox_RecordFile()
{

	var rec_name = "E:\\usb\\gsm-usb\\bin\\ubox-record\\test.wav";
	//alert(rec_name);
	//var msg = [];
	if(hdl != -1)
	{
		var msg = {
		   "event": "RecordFile",
		   "handle": hdl,
		   "filename":rec_name,
		   "codec":  CODER_PCM
		};
		AppendStatus("开始录音...")
		
		//如果失败， 在notify 消息中，会报错的
		
		websocket_send_msg(JSON.stringify(msg));
	}
			

}

function ubox_StopRecord()
{
	if(hdl != -1)
	{
		var msg = {
		   "event": "StopRecord",
		   "handle": hdl
		};
	  
		//  如果失败， 在notify 消息中，会报错的
		
		websocket_send_msg(JSON.stringify(msg));
		AppendStatus("已经停止录音");
	}
}


function ubox_playfile(szFile)
{
   //alert("szFile:"+get_filepath(document.getElementById('filename')));
   var  filename = "E:\\usb\\gsm-usb\\bin\\456.wav";
	if(hdl != -1)
	{
		var msg = {
		   "event": "PlayFile",
		   "handle": hdl,
		   "filename":filename
		};
		AppendStatus("开始放音...")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_stopplay()
{
	if(hdl != -1)
	{
		var msg = {
		   "event": "StopPlay",
		   "handle": hdl
		};
		AppendStatus("停止放音")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}




function ubox_dialnum(szCode)
{

  	if(hdl != -1)
	{
	    if((ubox.lines[hdl].productid == 1)||(ubox.lines[hdl].productid == 4))
		{
			var msg = {
			   "event": "SoftHookoff",
			   "handle": hdl
			};
			AppendStatus("软件摘机:");
			/*
			如果失败， 在notify 消息中，会报错的
			*/
			websocket_send_msg(JSON.stringify(msg));	
          ubox.lines[hdl].state =  UBOX_STATE_HOOK_OFF;	
         setTimeout(function(){
		   			 if(	 ubox.lines[hdl].state ==  UBOX_STATE_HOOK_OFF)
					 {
								var msg = {
							   "event": "SendDtmf",
							   "handle": hdl,
							   "dtmf":szCode
							};
							AppendStatus("拨号:"+szCode);
							/*
							如果失败， 在notify 消息中，会报错的
							*/
							websocket_send_msg(JSON.stringify(msg));		
						}
						else
						{
						   AppendStatus("请摘起电话机");
					 }
		            
				},1000);		  
		}
		else if(ubox.lines[hdl].productid == 8)  //无线设备
		{
				var msg = {
				   "event": "ubox_makecall",
				   "handle": hdl,
				   "dtmf":szCode
				};
				AppendStatus("拨号:"+szCode);
			  websocket_send_msg(JSON.stringify(msg));	
		}
		else
		{
			if(	 ubox.lines[hdl].state ==  UBOX_STATE_HOOK_OFF)
			{
					var msg = {
				   "event": "SendDtmf",
				   "handle": hdl,
				   "dtmf":szCode
				};
				AppendStatus("拨号:"+szCode);
				/*
				如果失败， 在notify 消息中，会报错的
				*/
				websocket_send_msg(JSON.stringify(msg));		
			}
			else
			   AppendStatus("请摘起电话机");
		}
	 }
}


function ubox_Start_read_line_voltage()
{
	if(hdl != -1)
	{
		var msg = {
		   "event": "StartReadLineVoltage",
		   "handle": hdl
		};
		AppendStatus("开始量线路电压");
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_Stop_read_line_voltage()
{
/*
  if(Phonic_usb.StopReadLineVoltage(hdl) == 0)
     AppendStatus("停止量线路电压成功");
  else
     AppendStatus("停止量线路电压失败");
	 */
	if(hdl != -1)
	{
		var msg = {
		   "event": "StopReadLineVoltage",
		   "handle": hdl
		};
		AppendStatus("停止量线路电压");
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_Get_DeviceVersion()
{
 // var ver = Phonic_usb.GetDeviceVersionNum(hdl);
  //   AppendStatus("硬件版本号"+ver);
 	if(hdl != -1)
	{
		var msg = {
		   "event": "GetDeviceVersionNum",
		   "handle": hdl
		};
		AppendStatus("获取硬件版本号");
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}

}

function ubox_Get_User()
{
  //var use_num = Phonic_usb.GetUsernum(hdl);
  //   AppendStatus("用户号:"+use_num);
   	if(hdl != -1)
	{
		var msg = {
		   "event": "GetUsernum",
		   "handle": hdl
		};
		AppendStatus("用户号:");
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_read_eeprom()
{
 //  var read_data = Phonic_usb.ReadEepromex2(hdl,0,8);
  //   AppendStatus("读eepromEx:"+read_data);

}


function ubox_write_eeprom()
{
/*
    var write_data = "A23456B9";
	if(Phonic_usb.WriteEepromex(hdl,0,write_data,8)==0)
	{
		AppendStatus("写eeprom成功");
	}
	else
	{
      AppendStatus("写eeprom失败");
	}
	*/
}

function ubox_hook_off()
{

         //fi3102A fi3101A 支持
/*
	  if(Phonic_usb.SoftHookoff(hdl)==0)
       {
		AppendStatus("摘机成功");
       }
	   else
	   {
         AppendStatus("摘机失败");
	   }
*/
   	if(hdl != -1)
	{
		var msg = {
		   "event": "SoftHookoff",
		   "handle": hdl
		};
		AppendStatus("软件摘机:");
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_hook_on()
{
        //fi3102A fi3101A 支持
		/*
 	if(Phonic_usb.SoftHookon(hdl)==0)
       {
		AppendStatus("挂机成功");
       }
	   else
	   {
         AppendStatus("挂机失败");
	   }
	*/
   	if(hdl != -1)
	{
		var msg = {
		   "event": "SoftHookon",
		   "handle": hdl
		};
		AppendStatus("软件挂机")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}
}

function ubox_reject_on()
{
   	if(hdl != -1)
	{
		if(ubox.lines[hdl].productid == 8)  //无线设备
		{
			var msg = {
			   "event": "rejectcall",
			   "handle": hdl
			};
			AppendStatus("拒接:");
			/*
			如果失败， 在notify 消息中，会报错的
			*/
			websocket_send_msg(JSON.stringify(msg));
		}
		else
		{
			AppendStatus("型号不支持该功能");
		}
	}
}

function ubox_makecallSlic()
{
   	if(hdl != -1)
	{
		if(ubox.lines[hdl].productid == 8)  //无线设备
		{
			var msg = {
			   "event": "ubox_makecallSlic",
			   "handle": hdl,
			   "phonenumber":"91234567890"
			};
			AppendStatus("slic 振铃");
			/*
			如果失败， 在notify 消息中，会报错的
			*/
			websocket_send_msg(JSON.stringify(msg));
		}
		else
		{
			AppendStatus("型号不支持该功能");
		}
	}
}

function gsm_sendcmd(cmd)
{
	if(hdl != -1)
	{
		if(ubox.lines[hdl].productid == 8)  //无线设备
		{
			var msg = {
			   "event": "sendcmd",
			   "handle": hdl,
			   "cmd":cmd
			};
			AppendStatus("发送cmd:"+cmd);
			/*
			如果失败， 在notify 消息中，会报错的
			*/
			websocket_send_msg(JSON.stringify(msg));
		}
		else
		{
			AppendStatus("型号不支持该功能");
		}
	}
}

/*
function ubox_handle_streamVoice(uboxHandle, pVoice, size)
{
	 var outdata = "流式录音 句柄号:"+hdl +"size:"+size;
   AppendStatus(outdata);
}
*/

function getfilesize(filename)
{

    var  filename = "E:\\usb\\usb开发例子\\ubox-websocket-server\\bin\\test.wav";
	if(hdl != -1)
 		var msg = {
		   "event": "JudgeFileSize",
		   "filename":filename
		};
		AppendStatus("获取文件大小：")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
		
}

function UBOXDeletefile(filename)
{

    var  filename = "E:\\usb\\usb开发例子\\ubox-websocket-server\\bin\\test.wav";
 		var msg = {
		   "event": "UBOXDeletefile",
		   "filename":filename
		};
		AppendStatus("delete file")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	
}

function UploadfileToserver(url, paramname, filename)
{

    var  filename = "E:\\usb\\usb开发例子\\ubox-websocket-server\\bin\\test.wav";
 		var msg = {
		   "event": "UploadFile",
		   "url":url,
		   "paramname":paramname,
		   "filename":filename
		   
		};
		AppendStatus("upload file")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
}

function UploadfileToserverEx(url, paramname, filename)
{

    var  filename = "E:\\usb\\usb开发例子\\ubox-websocket-server\\bin\\test.wav";
 		var msg = {
		   "event": "UploadFileEx",
		   "url":url,
		   "paramname":paramname,
		   "filename":filename
		   
		};
		AppendStatus("upload file")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));

}

function  ubox_get_systeminfo()
{
		var msg = {
		   "event": "getsysteminfo"
		};
		AppendStatus("获取系统信息")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
}

function ubox_get_productid()
{
   	if(hdl != -1)
	{
		var msg = {
		   "event": "GetProductID",
		   "handle": hdl
		};
		AppendStatus("获取型号")
		/*
		如果失败， 在notify 消息中，会报错的
		*/
		websocket_send_msg(JSON.stringify(msg));
	}	
}

function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}

function changesimcard(This)
{
	var simno = 1;
	if(hdl != -1)
	{
		if(This.value == 1)
		{
			//alert("select sim card 1");
			simno = 1;
		}
		 else
		 {
			 //alert("select sim card 2");
			 simno = 2;
		 }
		if(ubox.lines[hdl].productid == 8)  //无线设备
		{
			var msg = {
			   "event": "selectsimcard",
			   "handle": hdl,
			   "cardno":simno-1
			};
			AppendStatus("choose card number:"+simno);
			/*
			如果失败， 在notify 消息中，会报错的
			*/
			websocket_send_msg(JSON.stringify(msg));
			
			var msg = {
			   "event": "gsmpower",
			   "handle": hdl,
			   "value":0
			};
			//sleep(2000);
			websocket_send_msg(JSON.stringify(msg));
			sleep(2000);
			var msg = {
			   "event": "gsmpower",
			   "handle": hdl,
			   "value":1
			};
			websocket_send_msg(JSON.stringify(msg));
			sleep(2000);
				var msg = {
			   "event": "gsmboot",
			   "handle": hdl,
			   "value":1
			};
			websocket_send_msg(JSON.stringify(msg));
            sleep(2000);
				var msg = {
			   "event": "gsmboot",
			   "handle": hdl,
			   "value":0
			};
			websocket_send_msg(JSON.stringify(msg));			
		}
		else
		{
			AppendStatus("型号不支持该功能");
		}
	}	
   
}	

function CheckChinese(val){  
    
　　var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
　　if(reg.test(val)){  
       return true;        
　　}
	else
	{
		return false;
	}
  }

function toUnicode(str) {
	var temp,
	i = 0,
	r = '',
	len = str.length;
	for (; i < len; i++) {
		temp = str.charCodeAt(i).toString(16);		 
		while ( temp.length < 4 )
		temp = '0' + temp;	 
		r += temp;
	};
	 
	return r;
}
		  
function gsm_sendmsg(phone, val)
{
    var  msg=""; 
	var msgtype=0;
	if(hdl != -1)
	{
		if(ubox.lines[hdl].productid == 8)  //无线设备
		{
		   if(CheckChinese(val))
		   {
			  msg = toUnicode(val);
			  msgtype = 0;
			}
			else
			{
			   msg = val;
			   msgtype = 1;
			}
			AppendStatus("往"+phone+"发送短信:"+msg);
			var msginfo = {
						"event": "sendmsg",
						"handle": hdl,
						"phone":phone,
						"mode": msgtype,
						"msg":msg
				};	
		//AppendStatus("往"+phone+"发送短信:"+msg);
								/*
								如果失败， 在notify 消息中，会报错的
								*/
		websocket_send_msg(JSON.stringify(msginfo));
		}
	}
}

function websocket_send_msg(msg)
{
	ws.send(msg);
}

$(function()
{
   if(window.WebSocket)
   {
	 AppendStatus("brower supports WebSocket");
	 //http 
	
	 
	 var wsproto = (location.protocol === 'https:') ? "wss://" : "ws://";
	 var wsport = (location.protocol === 'https:') ? ":7443" : ":5066";
	  ws = new WebSocket(wsproto+'127.0.0.1:8054');//127.0.0.1:8054/
	 //https
	// ws = new WebSocket('wss://127.0.0.1:8054/wss');

	 // if (!window.console) { window.console = { log: function() {} } };

	  ws.onopen = function(ev)  { AppendStatus("open:"+JSON.stringify(ev)) };
	  ws.onerror = function(ev) { AppendStatus("websocket error:"+JSON.stringify(ev)); };
	  ws.onclose = function(ev) { AppendStatus("websocket close:"+JSON.stringify(ev));  ws = null;};
	  ws.onmessage = function(ev) {
		//console.log(ev);
		// AppendStatus(ev.data);
		 var msg = eval('(' + ev.data + ')');
	     // AppendStatus("json:"+msg.event);
	     if(msg.event == "plugin")
		 {
			Ubox_Plug_In(msg.handle);
		 }
	     else if(msg.event == "hookoff")
		 {
			//Ubox_hookoff(msg.handle);
			 AppendStatus("摘机，type:"+msg.type);
			if(msg.type == 6)
			{
			      AppendStatus("软件摘机，反向");
			}
			else if(msg.type == 7)
			{
			    AppendStatus("软件摘机，正向");
			}			
		 }
	     else if(msg.event == "hookup")
		 {
			Ubox_hookon(msg.handle);
		 }
	     else if(msg.event == "ring")
		 {
			ubox_Ring(msg.handle);
		 }
	     else if(msg.event == "hang")
		 {
			ubox_HangIng(msg.handle);
		 }
	     else if(msg.event == "callerId")
		 {
			Ubox_CallId(msg.handle, msg.callernumber);
		 }
	     else if(msg.event == "dtmfdown")
		 {
			ubox_DtmfKey(msg.handle, msg.dtmfkey);
		 }
	     else if(msg.event == "deviceAlarm")
		 {
			 ubox_DeviceAlarm(msg.channels[i].handle);
		 }
	     else if(msg.event == "ringCancel")
		 {
			ubox_RingCancel(msg.handle);
		 }
	     else if(msg.event == "voltage")
		 {
			ubox_LineVoltage(msg.handle, msg.vol);
		 }
	     else if(msg.event == "deviceError")
		 {
			ubox_DeviceError(msg.handle);
		 }
	     else if(msg.event == "playEnd")
		 {
			ubox_PlayEnd(msg.handle);
		 }
	     else if(msg.event == "playError")
		 {
			AppendStatus("放音失败， handle:"+msg.handle);
		 }
	     else if(msg.event == "busyTone")
		 {
			ubox_ToneBusy(msg.handle);
		 }
	     else if(msg.event == "CallOutFinish")
		 {
			AppendStatus("软件拨号完成 handle:"+msg.handle);
		 }
	     else if(msg.event == "plugout")
		 {
			ubox_PlugOut(msg.handle);
		 }
	     else if(msg.event == "joined")
		 {
			AppendStatus("connect websocket ok");
			//var msg = '{"event": "getinfo"}';
			//websocket_send_msg(msg);
				//var msg = [];
				var msg = {
				   "event": "getinfo"
	
				};
				//var msg = '{"event": "RecordFile",';
				//msg +='"handle":'+hdl;
				websocket_send_msg(JSON.stringify(msg));
		 }
	     else if(msg.event == "left")
		 {
			AppendStatus("disconnect websocket ok");
		 }
		 else if(msg.event == "calledanswer")
		 {
			AppendStatus("已经应答"); 
		 }
		 else if(msg.event == "getinfo")
		 {
			if(msg.channels.length > 0)
			{
				for(var i=0;i<msg.channels.length;i++)
				{
					Ubox_Plug_In(msg.channels[i].handle);
					if(msg.channels[i].deviceError)
					  ubox_DeviceError(msg.channels[i].handle);
					if(msg.channels[i].deviceAlarm)
					  ubox_DeviceAlarm(msg.channels[i].handle);
				}
			}
			else
			{
				AppendStatus("no usb device  plugin");
			}
		 }
		 else if(msg.event == "notify")
		 {
			AppendStatus(msg.errorType+" handle:"+msg.handle +" "+Get_Error(msg.result));	
		 }
		 else if(msg.event == "answer")
		 {
		   if( msg.type == "GetDeviceVersionNum")
		   {
			  AppendStatus("handle:"+msg.handle+" 硬件版本号："+msg.result);		
		   }
		   else if( msg.type == "GetUsernum")
		   {
			  AppendStatus("handle:"+msg.handle+" 用户号:"+msg.result);		
		   }
		   else if( msg.type == "GetProductID")
		   {
			  if(msg.result == "1")
              {
			     AppendStatus("USB设备是FI3102A");
                ubox.lines[msg.handle].productid = 1;				 
			  }
			  else if(msg.result == "2")
              {
			     AppendStatus("USB设备是FI3002B");	
                 ubox.lines[msg.handle].productid = 2;					 
			  }		
			  else if(msg.result == "3")
              {
			     AppendStatus("USB设备是FI3001B");	
               ubox.lines[msg.handle].productid = 3;						 
			  }		
			  else if(msg.result == "4")
              {
			     AppendStatus("USB设备是FI3101A");	
                 ubox.lines[msg.handle].productid = 4;						 
			  }
			  else if(msg.result == "8")
              {
			     AppendStatus("USB设备是无线设备");	
                 ubox.lines[msg.handle].productid = 8;						 
			  }				  
		   }			   
		 }
		 else if(msg.event == "systeminfo") 
		{ 
		        for(var i=0;i<msg.macs.length;i++)
				{
						 AppendStatus("mac name:"+msg.macs[i].macname);
						  AppendStatus("mac des:"+msg.macs[i].macdes);
						  AppendStatus("mac address:"+msg.macs[i].macaddr); 
						  for(var j=0;j<msg.macs[i].ips.length;j++)
							 AppendStatus("ip address:"+msg.macs[i].ips[j].ipaddr); 
				}
				/*AppendStatus("total memory:"+msg.memory.totalmem);
				AppendStatus("free memory:"+msg.memory.freemem);
				AppendStatus("virtual memory:"+msg.memory.virtualmem);
				AppendStatus("disk SerialNo:"+msg.diskSerialNo);
				AppendStatus("cpu SerialNo:"+msg.cpuSerialNo);
			    for(var i=0;i<msg.disks.length;i++)
				{
						 AppendStatus("disk id:"+msg.disks[i].id);
						  AppendStatus("disk total:"+msg.disks[i].total);
						  AppendStatus("disk free:"+msg.disks[i].free); 
	
				}*/
			   		   
		 }
		else if(msg.event == "short_msg_size")
		{
			 AppendStatus("short message size:"+msg.number+" total memory size:"+msg.memory_size);
			 short_msg_number = msg.number;
			 if(short_msg_number >0)
			 {
				 gsm_sendcmd("AT+CMGR="+short_msg_number);
				 short_msg_number = short_msg_number -1;
			 }
		}
       else if(msg.event == "short_msg")
	   {
		  AppendStatus("from:"+msg.from+" time:"+msg.time+" "+msg.divided);
			var result="";
			
			for(var i=0;len=i<msg.result.length;i++){
					  if(i%4 == 0)
					  {
						result += "\\u";
					  }
					result += msg.result[i];
					
			}
			//if(CheckChinese(msg.result))
			{
				//document.write(result + "<br />")
				//AppendStatus(msg.result);
				//AppendStatus(result);
				result = unescape(result.replace(/\\u/g, "%u"));
				result = unescape(result.replace(/%u/g, ""));
				AppendStatus(result);
			}  
			 if(short_msg_number >0)
			 {
				 gsm_sendcmd("AT+CMGR="+short_msg_number);
				 short_msg_number = short_msg_number -1;
			 }			
	   }
		 else
		 {
			AppendStatus(ev.data);
		 }
	  };

   }
   else
   {
		AppendStatus(" This brower does not supports WebSocket.");
   }
});