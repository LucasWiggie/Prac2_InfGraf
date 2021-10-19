#version 330 core

// Para sombrear se necesitan las normales

in vec3 inPos;	
in vec3 inColor;

// Cargamos las normales del Cubo
in vec3 inNormal;

// Propiedades del objeto (a = ambioente, d = difusa)
vec3 Ka;
vec3 Kd;
vec3 N;
vec3 pos;
float alpha = 30.0;

// Propiedades de la Luz (a = ambioente, d = difusa)
vec3 Ia = vec3(0.2);
vec3 Id = vec3(1.0);
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
	vec3 c = vec3(0.0);
	c = Ia*Ka;

	// Para calcular el vector L (luz), debemos calcular la diferencia entre la posicion del vertice y la Luz
	vec3 L = normalize(lpos - pos);

	// Componente difusa (el dot es el angulo entre la luz y la normal)
	vec3 diffuse = Id*Kd*dot(L, N);

	// Lo deja entre el rango 0 y 1
	c += clamp(diffuse, 0.0, 1.0);

	return c;
}
