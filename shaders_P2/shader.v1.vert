#version 330 core

// Posicion, Color y Normal del vertice (para sombrear se necesitan las normales)
in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

// Propiedades del objeto (a = ambioente, d = difusa, s = especular (necesitamos el angulo de vista de la camara))
vec3 Ka;
vec3 Kd;
vec3 Ks = vec3(1.0);
vec3 N;
vec3 pos;
float alpha = 30.0;

// Propiedades de la Luz (a = ambiente, d = difusa, s = especular (necesitamos el angulo de vista de la camara))
vec3 Ia = vec3(0.5);
vec3 Id = vec3(0.5);
vec3 Is = vec3(0.3);
vec3 lpos = vec3(3.0);

uniform mat4 modelViewProj;
// Matriz especial que normaliza la transformacion de las normales, 
// calculada por IGlib:
uniform mat4 normal;
uniform mat4 modelView;


out vec3 color;

vec3 shade();

void main()
{
	// Como estamos haciendo Goureau, lo cogemos de los vertices
	Ka = inColor;
	Kd = vec3(0.8);

	// Multiplicamos las normales por una matriz especial que 
	// normaliza la transformacion de las normales, calculada por IGlib
	N = normalize((normal*vec4(inNormal, 0.0)).xyz);

	pos = (modelView*vec4(inPos, 1.0)).xyz;

	color = shade();
	gl_Position =  modelViewProj * vec4 (inPos,1.0);
}

vec3 shade() {
	// c va a actuar de sumatorio para todas las componentes
	vec3 c = vec3(0.0);

	//// COMPONENTE AMBIENTAL
	c = Ia*Ka;

	//// COMPONENTE DIFUSA
	// Para calcular el vector L (luz), debemos calcular la diferencia entre la posicion de la Luz y el vertice
	vec3 L = normalize(lpos - pos);
	// Componente difusa (el dot es el angulo entre la luz y la normal)
	vec3 diffuse = Id*Kd*dot(L, N);
	// Añadimos la componente difusa [ clamp(X, b, c) limita X deja entre el rango b y c ]
	c += clamp(diffuse, 0.0, 1.0);

	//// COMPONENTE ESPECULAR
	//Vector de la Camara (lookAt), desde la posicion del vertice a la de la camara, por eso -pos
	vec3 V = normalize (-pos);
	//Vector de Reflexion, se hace -L para cambiar el sentido de L: en vez de ir del punto pos a la camara, va al reves
	vec3 R = normalize (reflect(-L,N));
	float factor = clamp(dot(R,V), 0.0, 1.0);
	vec3 specular = Is*Ks*pow(factor, alpha); //pow(a, b) = a^b
	c += clamp(specular, 0.0, 1.0);

	return c;
}

