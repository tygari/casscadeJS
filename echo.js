if (!!window.MutationObserver){
	(new MutationObserver(M=>{
		let O = {
			CR:`color:red`,
			CB:`color:blue`,
			CO:`color:orange`,
			NULL:x=>(x !== null && x !== undefined),
			NOT:x=>(name !== x),
			ID:x=>(document.getElementById(x)),
			GET:(E,x)=>(E.getAttribute(x)),
			SET:(E,x,y)=>(E.setAttribute(x,y)),
			ARR:x=>(Array.isArray(x)),
			TRIM:x=>(x.trim().replace(/\s\s+|\r|\n|\t|\f|\v|[,]/g,` `)),
			SPLIT:x=>(O.TRIM(x).split(` `)),
			WIN:(x,y)=>{
				try {
					return x.replace(/['"`]/g,'').split('.').reduce(
						(o,r)=>(!r ? o : r.split('[').reduce(
							(o,r,i)=>(!r ? o : (o[r.slice(0, i ? -1 : r.length)])),o)),window);
				}
				catch(e){return false}
			},
			EVAL:x=>{
				try {if (!!eval(x)){return true}}
				catch(e){return false}
			},
			CODE:(E,x)=>{
				O.CHK = false;
				if (!!O.WIN(x)){
					x = O.WIN(x);
					O.CHK = true;
				}
				else if (O.EVAL(x)){x = O.TRIM(eval(x).innerHTML)}
				else {x = O.GET(E,`code`)}
				x = ``+x;
				if (!x.startsWith(`<`) || !x.endsWith(`>`)){
					console.log(E.outerHTML);
					x ? console.log(`%cERROR: ATTRIBUTE "code" %c${x} %cis not a proper HTML code string.  %cDefaulting to: %c<div></div>%c.`,O.CR,O.CB,O.CR,O.CO,O.CB,O.CO)
						 : console.log(`%cERROR: TAG <echo-> is missing ATTRIBUTE "code". %cDefaulting to: %c<div></div>%c.`,O.CR,O.CO,O.CB,O.CO);
					x =`<div></div>`;
					O.CHK = false;
				}
				if (O.CHK){O.LOOP(E,`code`,x)}
				return x;
			},
			ECHO:(E,x,y=false)=>{
				O.CHK = false;
				if (!!O.WIN(x)){O.CHK = O.WIN(x);}
				if (typeof O.CHK == `string`){
					x = O.SPLIT(O.CHK);
					y = true;
				}
				else if (O.ARR(O.CHK)){
					x = O.CHK;
					y = true;
				}
				else if (typeof O.CHK === `object` && O.NULL(O.CHK) && !(O.CHK instanceof Element)){
					O.VALUE = [];
					for (O.INC in O.CHK){O.VALUE.push(``+O.INC)}
					x = O.VALUE;
					y = true;
				}
				else if (x.startsWith(`[`) && x.endsWith(`]`)){
					x = x.replace(/[,]/g,' ').replace(/['"\[\]]/g,'');
					x = O.SPLIT(x);
				}
				if (!O.ARR(x)){x = O.SPLIT(x)}
				if (y == true){O.LOOP(E,`echo`,O.CHK)}
				return x;
			},
			LOOP:(E,x,y)=>{
				if (O.GET(E,`auto`) === `true` && O.WIN(O.GET(E,x)) !== y){
					y = O.WIN(O.GET(E,x));
					O.SET(E,x,O.GET(E,x));
				}
				else {E[`${x}Auto`] = setTimeout(O.LOOP,25,E,x,y)}
			},
			WATCH:(E)=>{
				(new MutationObserver(R=>{
					R = R[0];
					O.OBJ = {};
					E.author = `Tygari Katarana Davis`;
					E.echoWatch = true;
					E.echo = O.GET(E,`echo`);
					if (O.GET(E,`echo`) !== `[object Object]`){
						if (R.attributeName === `echo` && R.oldValue){
							O.VALUE = O.ECHO(E,R.oldValue);
							for(O.INC = 0; O.INC < O.VALUE.length; O.INC++){
								O.CHK = O.VALUE[O.INC];
								if(O.ID(O.CHK)){O.OBJ[O.CHK] = O.ID(O.CHK).outerHTML}
							}
						}
						if (E.hasAttribute(`echo`)){
							E.echoArray = O.ECHO(E,O.GET(E,`echo`));
							E.innerHTML = ``;
							if (E.echoArray[0] !== ``){
								E.code = O.GET(E,`code`);
								E.codeHTML = O.CODE(E,E.code);
								for(O.INC = 0; O.INC < E.echoArray.length; O.INC++){
									O.CHK = E.echoArray[O.INC];
									if (typeof O.CHK !== `object` && O.NULL(O.CHK)){
										E.insertAdjacentHTML( `beforeend` , (O.OBJ[O.CHK] ? O.OBJ[O.CHK] : E.codeHTML));
										E.lastElementChild.id = ``+O.CHK;
									} else {console.log(`%cERROR%c: Invalid ID Data Type.`,O.CR,O.CO)}
								}
							}
						}
					} else {
						console.log(`%cERROR%c: An object literal was passed as a string, resulting in echo="[object Object]".  HTML cannot process object literals.`,O.CR,O.CO);
					}
				}).observe(E,{
					attributes: true,
					attributeFilter: [`echo`,`code`],
					attributeOldValue: true,
				}));
			},
		}
		for (O.INC of M){
			O.INC = O.INC.addedNodes[0];
			if (O.INC && O.INC.attributes && O.INC.hasAttribute(`echo`) && O.INC.echoWatch !== true){
				O.WATCH(O.INC);
				O.SET(O.INC,`echo`,O.GET(O.INC,`echo`));
			}
		}
		window.addEventListener(`load`,()=>{
			for (O.INC of document.querySelectorAll(`[echo],[code]`)){
				O.WATCH(O.INC);
				O.SET(O.INC,`echo`,O.GET(O.INC,`echo`));
			}
		});
	})).observe(document.getElementsByTagName(`html`)[0],{
		childList: true,
		subtree: true,
	});
} else {console.log(`%cERROR%c: MUTATION OBSERVER is Disabled`,O.CR,O.CO);}
