#version 330 core

out vec4 outColor;

// Todo lo que nos pasa el shader de vertices
in vec2 texCoord;
in vec3 pos;
in vec3 norm;

uniform sampler2D colorTex;
uniform sampler2D emiTex;
uniform sampler2D specularTex;

// Propiedades del objeto (a = ambiente, d = difusa, s = especular, e = emisiva (necesitamos el angulo de vista de la camara))
vec3 Ka;
vec3 Kd;
vec3 Ks;
vec3 Ke;
vec3 N;
float alpha = 1.0;

// Propiedades de la Luz (a = ambiente, d = difusa, s = especular (necesitamos el angulo de vista de la camara))
// Fuente de luz 1
vec3 Ia1 = vec3(0.3);
vec3 Id1 = vec3(0.5, 0.5, 0.5);
vec3 Is1 = vec3(0.0, 0.0, 0.0);
vec3 lpos1 = vec3(0.0, 0.0, -3.0);
vec3 D = vec3(0.0, 0.0, -1.0);
float cutoff = 15.0;

// Para calcular el vector L (luz), debemos calcular la diferencia entre la posicion de la Luz y el vertice
vec3 L = normalize(lpos1 - pos);

vec3 shade();

void main()
{
	Ka = texture(colorTex, texCoord).rgb;
	Kd = texture(colorTex, texCoord).rgb;
	Ks = texture(specularTex, texCoord).rgb;
	Ke = texture(emiTex, texCoord).rgb;
	N = normalize(norm);

	outColor = vec4(shade(), 1.0);   
}

vec3 calcAmbiental(vec3 Ia){
	return Ia*Ka;
}

vec3 calcDifusa(vec3 Id, vec3 L){
	// Componente difusa (el dot es el angulo entre la luz y la normal)
	vec3 diffuse = Id*Kd*dot(L, N);
	// Devolvemos la componente difusa
	return diffuse;
}

vec3 calcEspecular(vec3 Is, vec3 L){
	//Vector de la Camara (lookAt), desde la posicion del vertice a la de la camara, por eso -pos
	vec3 V = normalize (-pos);
	//Vector de Reflexion, se hace -L para cambiar el sentido de L: en vez de ir del punto pos a la camara, va al reves
	vec3 R = normalize (reflect(-L,N));
	float factor = clamp(dot(R,V), 0.0, 1.0);
	vec3 specular = Is*Ks*pow(factor, alpha); 
	return specular;
}

vec3 shade() {
	// c va a actuar de sumatorio para todas las componentes
	vec3 c = vec3(0.0);

	// FUENTE DE LUZ 1:
	float theta = dot(D, -L);

	if(theta > cos(cutoff)){
		c += clamp(calcDifusa(Id1, L), 0.0, 1.0) + clamp(calcEspecular(Is1, L), 0.0, 1.0);
	} else {
		c += calcAmbiental(Ia1);
	}
	
	// COMPONENTE EMISIVA
	c += Ke;

	return c;
}



