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
vec3 Ia = vec3(0.2);
vec3 Id = vec3(0.3);
vec3 Is = vec3(1.0);
vec3 lpos = vec3(-10.0, 10.0, -4.0);
vec3 D = vec3(0.0 , -5.0, 0.0); // direccion del haz de luz
vec3 L = -D;

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

vec3 calcDifusa(vec3 Id){
	// Componente difusa (el dot es el angulo entre la luz y la normal)
	vec3 diffuse = Id*Kd*dot(L, N);
	// Devolvemos la componente difusa
	return diffuse;
}

vec3 calcEspecular(vec3 Is){
	//Vector de la Camara (lookAt), desde la posicion del vertice a la de la camara, por eso -pos
	vec3 V = normalize (-pos);
	//Vector de Reflexion, se hace -L para cambiar el sentido de L: en vez de ir del punto pos a la camara, va al reves
	vec3 R = normalize (reflect(-L,N));
	float factor = clamp(dot(R,V), 0.0, 1.0);
	vec3 specular = Is*Ks*pow(factor, alpha); 
	return specular;
}

float funcionAtenuacion(vec3 posL){
	
	float d = length(posL - pos);

	float c1 = 0.08;
	float c2 = 0.05;
	float c3 = 0.01;

	return min(1/(c1 + c2*d + c3*d*d), 1);
}

vec3 shade() {
	// c va a actuar de sumatorio para todas las componentes
	vec3 c = vec3(0.0);

	c += calcAmbiental(Ia);
	c += funcionAtenuacion(lpos)*(clamp(calcDifusa(Id), 0.0, 1.0) + clamp(calcEspecular(Is), 0.0, 1.0));
	c += Ke;

	return c;
}



