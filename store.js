import Papa from 'papaparse';
import csvPath from "./data.csv";

export function getData(func){
	//console.log('Entra llamada');
	Papa.parse(csvPath, {
	delimiter: ";",
	header : true,
	download : true,
	complete: function(results){
		var datos= results.data;
		//console.log('Our CSV data apres Papa', datos);
		var dataInFormat=putDataInFormat(datos);
		//console.log('Our CSV data apres format', dataInFormat);
		func(dataInFormat);
	}
});	
}


function putDataInFormat(datos){
	//console.log('Our CSV data avant format', datos);
	const data=[];
	data.push(newDomain(datos[0].ecole,[]));
	var domains = data[0].children;
	for (var i = 0; i < datos.length; ++i) {
		var article = newArticle(datos[i].name,datos[i].size);
		//Domains
		var domainOfI = get(domains,datos[i].domain);
		//console.log(domainOfI,domains,datos[i]);
	    if (domainOfI==null) {
	    	domainOfI=newDomain(datos[i].domain,[]);
	    	domains.push(domainOfI);
	    }
	    //Subdomains
	    var listDomain =domainOfI.children;
		var subDomainOfI = get(listDomain,datos[i].subdomain);
	    if (subDomainOfI==null) {
	    	subDomainOfI=newDomain(datos[i].subdomain,[]);
	    	listDomain.push(subDomainOfI);
	    }
	    //theme
	    var listSubDomain =subDomainOfI.children;
		var themeOfI = get(listDomain,datos[i].theme);
	    if (themeOfI==null) {
	    	themeOfI=newDomain(datos[i].theme,[article]);
	    	listSubDomain.push(themeOfI);
	    }else{
	    	themeOfI.children.push(article);
	    }
	}
	return data;
}

function get(a, obj) {
	if (a!=null && obj !=null) {
		for (var i = 0; i < a.length; i++) {
	        if (a[i].name == obj) {
	            return a[i];
	        }
	    }
	}
    
    return null;
}

function newArticle(name,size) { 
	var article = new Object();
	article.name = name;
	article.size = size;
	return article;
}

function newDomain(name,list) { 
	var domain = new Object();
	domain.name = name;
	domain.children = list;
	return domain;
}