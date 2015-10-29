window.onload = function()
{
var nomServicios = [
	                        {
	                            servicio 	: 	"Trae todas las tareas",
	                            urlServicio	: 	"getAllTask",
	                            metodo		: 	"GET"
	                        },
	                        {
	                            servicio 	: 	"Crear una nueva tarea",
	                            urlServicio	: 	"createTask",
	                            metodo		: 	"POST"
	                        },
	                        {
	                            servicio 	: 	"Editar una tarea",
	                            urlServicio	: 	"updateTask",
	                            metodo		: 	"PUT"
	                        },
	                        {
	                            servicio 	: 	"Eliminar Tarea",
	                            urlServicio	: 	"deleteTask",
	                            metodo		: 	"DELETE"
	                        },
	                        {
	                            servicio 	: 	"Trae una sola tarea",
	                            urlServicio	: 	"getTask",
	                            metodo		: 	"GET"
	                        }
	                    ];

	var consumeServicios = function(tipo, val, callback)
	{
	    var servicio = {
	                        url 	: nomServicios[tipo - 1].urlServicio,
	                        metodo	: nomServicios[tipo - 1].metodo,
	                        datos 	: ""
	                    };
	    if(tipo === 4 || tipo === 5)
	    {
	        servicio.url += "/" + val;
	    }
	    else
	    {
	        servicio.datos = val !== "" ? JSON.stringify(val) : "";
	    }
	    //Invocar el servicio...	    
	    $.ajax(
	    {
	        url 		: servicio.url,
	        type 		: servicio.metodo,
	        data 		: servicio.datos,
	        dataType 	: "json",
	        contentType: "application/json; charset=utf-8"
	    }).done(function(data)
	    {
	        listadoTareas = data;
	        F_imprimeTareas();
	    });
	};

	
	listadoTareas = [];
	var indEdita = -1; //El índice de Edición...
	var elementos = ["todo"];
	//Constructor F_tarea...
	function F_tarea(_todo)
	{
		this.todo= _todo;
		//Para devolver los datos del usuario a ser impresos...
		this.imprime = function()
		{
			return [this.todo];
		}
	}

	//Para cargar la información de localStorage...
	if(localStorage.getItem("listado"))
	{
		var objTMP = eval(localStorage.getItem("listado"));
		var _todo = "";
		for(var i in objTMP)
		{
			var _todo = objTMP[i].todo;
			var nuevaTarea = new F_tarea(_todo);
			listadoTareas.push(nuevaTarea);
		}
	}
	//F_imprimeTareas();
	//Imprimer usuarios en pantalla...
	var F_imprimeTareas = (function F_imprimeTareas()
	{
		var txt = "<table class = 'table-fill'>" + 
					"<thead><tr>" + 
					"<th>Realizada</th>" + 
					"<th>Actividad</th>" + 
					"<th>Eliminar</th></tr></thead>" + 
					"<tbody class = 'table-hover'>";
		for(var i = 0; i < listadoTareas.length; i++)
		{
			txt += "<tr>";
			var datosTarea = listadoTareas[i].imprime();
			
			//terminada...
			txt += "<td><center>";
			txt += "<img src = 'img/editar.png' border = '0' id = 'e_"+i+"'/>";
			txt += "</center</td>";

			for(var c = 0; c < datosTarea.length; c++)
			{
				txt += "<td><center>"+(datosTarea[c])+"</center></td>";
			}
		
			//Eliminar...
			txt += "<td><center>";
			txt += "<img src = 'img/eliminar.png' border = '0' id = 'd_"+i+"'/>";
			txt += "</center</td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
		nom_div("imprime").innerHTML = txt;
		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < listadoTareas.length; i++)
		{
			
			/*/Editar...
			nom_div("e_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listadoTareas[ind].identificacion;
				console.log("Valor de idUser: ", idUser);
				ind = buscaIndice(idUser);
				if(ind >= 0)
				{
					nom_div("identifica").value = listadoTareas[ind].identificacion;
					nom_div("nombre").value = listadoTareas[ind].primernombre;
					nom_div("apellido").value = listadoTareas[ind].primerapellido;
					nom_div("email").value = listadoTareas[ind].email;
					nom_div("fechanace").value = listadoTareas[ind].fechanacimiento;
					indEdita = ind;
				}
				else
				{
					alert("No existe el ID");
				}
			});*/
			//Eliminar...
			nom_div("d_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listadoTareas[ind].identificacion;
				if(confirm("¿Está segur@ de realizar está acción?"))
				{
					ind = buscaIndice(idUser);
					if(ind >= 0)
					{
						listadoTareas.splice(ind, 1);
						localStorage.setItem("listado", JSON.stringify(listadoTareas));
						indEdita = -1;
						F_imprimeTareas();
					}
				}
			});
		}
		return F_imprimeTareas;
	})();
	//Dada la identificación, buscar la posición donde se encuentra almacenado...
	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in listadoTareas)
		{
			if(listadoTareas[i].identificacion === id)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}

	//Limpia los campos del formulario...
	var limpiarCampos = function()
	{
		indEdita = -1; //No se está editando nada...
		for(var i = 0; i < elementos.length; i++)
		{
			nom_div(elementos[i]).value = "";	
		}
	}

	//Acciones sobre el botón guardar...
	nom_div("submit").addEventListener('click', function(event)
	{
		var correcto = true;
		var valores = [];
		for(var i = 0; i < elementos.length; i++)
		{
			if(nom_div(elementos[i]).value === "")
			{
				alert("Digite todos los campos");
				nom_div(elementos[i]).focus();
				correcto = false;
				break;
			}
			else
			{
				valores[i] = nom_div(elementos[i]).value;
			}
		}
		//Si correcto es verdadero...
		if(correcto)
		{
			var existeDatos = 0;
			if(existeDatos === 0) //No existe...
			{
				var nuevaPersona = valores[0];
				listadoTareas.push(nuevaTarea);


				localStorage.setItem("listado", JSON.stringify(listadoTareas));
				F_imprimeTareas();
				limpiarCampos();
			}
		}
	});

	//Función que valida que un e-mail se encuentre "sintácticamente" bien escrito...
	function ValidaEmail(email)
	{
		var correcto = true;
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		if(!emailReg.test(email))
		{
			correcto =  false;
		}
		return correcto;
	}

	//Accedera los elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}