#version 330 core

out vec4 outColor;

// Todo lo que nos pasa el shader de vertices
in vec3 color;
in vec3 pos;
in vec3 norm;

// Propiedades del objeto (a = ambioente, d = difusa, s = especular (necesitamos el angulo de vista de la camara))
vec3 Ka;
vec3 Kd;
vec3 Ks = vec3(1.0);
vec3 N;
float alpha = 10.0;

// Propiedades de la Luz (a = ambiente, d = difusa, s = especular (necesitamos el angulo de vista de la camara))
vec3 Ia = vec3(0.2);
vec3 Id = vec3(1.0);
vec3 Is = vec3(1.0);
vec3 lpos = vec3(3.0);

vec3 shade();

void main()
{
	Ka = color;
	Kd = color;
	N = normalize(norm);
	outColor = vec4(shade(), 1.0);   
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
	// A?adimos la componente difusa [ clamp(X, b, c) limita X deja entre el rango b y c ]
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

