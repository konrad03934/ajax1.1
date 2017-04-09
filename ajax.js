'use strict';

function ajax(ajaxOptions) {
	
	//parametry polaczenia i jego typu
	var options = {
		type: ajaxOptions.type || "POST",
		url: ajaxOptions.url || "",
		onComplete: ajaxOptions.onComplete || function() {},
		onError: ajaxOptions.onError || function() {},
		onSuccess: ajaxOptions.onSuccess || function() {},
		dataType: ajaxOptions.dataType || "text",
	}
	//funkcja sprawdzajaca czy polaczenie sie udalo
	function httpSuccess(httpRequest) {
		try {
			return (httpRequest.status >= 200 && httpRequest.status < 300 || httpRequest.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof httpRequest.status == "undefined")
		} catch (e) {
			return false;
		}
	}
	
	
	//utworzenie obiektu
	var httpReq = new XMLHttpRequest();
	httpReq.open(options.type, options.url, true);
	
	//jesli stan dokumentu zostal zmieniony
	//0: polaczenie nie nawiazane
	//1: polaczenie nawiazane
	//2: zadanie odebrane
	//3: przetwarzanie
	//4: dane zwrocone i gotowe do uzycia
	httpReq.onreadystatechange = function() {
		
		//jesli 4: dane zwrocone  i gotowe do uzycia
		if(httpReq.readyState == 4) {
			
			//sprawdz status polaczenia
			if(httpSuccess(httpReq)) {
				//jesli dane w formacie obiekt returnXML w przeciwnym wypadku responseText (Json to tekst)
				var returnData = (options.dataType == "xml") ? httpReq.responseXML : httpReq.responseText;
				
				//jesli wszystko Ok
				options.onSuccess(returnData);
				
				//zeruj obiekt, aby nie utrzymywać niepotrzebnego juz polaczenia z serwerem
				httpReq = null;
			}else {
				//w przypadku bledu
				options.onError(httpReq.statusText);
			}
		} 
	}
	httpReq.send();
}

ajax({
	type: "GET",
	url: "http://echo.jsontest.com/userId/108/userName/Akademia108/userURL/akademia108.pl",
	onError: function(msg) {
		console.log(msg);
	},
	onSuccess: function(response) {
	var jsonObj = JSON.parse(response);
		console.log(jsonObj);
	}
});