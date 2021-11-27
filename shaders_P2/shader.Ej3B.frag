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
vec3 Ia = vec3(0.1);
vec3 Id = vec3(0.4);
vec3 Is = vec3(0.4);
vec3 lpos = vec3(0.0, 0.0, 1.0);
vec3 D = vec3(0.0, 0.0, -1.0);
float cutoff = 3.141592/12;
float penumbra = 3.141592/24;

// Para calcular el vector L (luz), debemos calcular la diferencia entre la posicion de la Luz y el vertice
vec3 L = normalize(lpos - pos);

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

float funcionAtenuacionDist(){
	
	float d = length(lpos - pos);

	float c1 = 0.08;
	float c2 = 0.05;
	float c3 = 0.01;

	return min(1/(c1 + c2*d + c3*d*d), 1);

}

float calcularT() {
    float numerador = (dot(-L,D) - cos(cutoff));
    float denom = cos(penumbra) - cos(cutoff);

    return clamp(numerador/denom, 0.0, 1.0);
}

float funcionAtenuacionDir(){
	float t = calcularT();
	return t*t*(3-2*t);
}

vec3 shade() {

	vec3 c = vec3(0.0);

	float theta = dot(D, -L);

	if(theta > cos(cutoff)){
		if(theta > cos(penumbra)) {
			c += funcionAtenuacionDist()*(clamp(calcDifusa(Id), 0.0, 1.0) + clamp(calcEspecular(Is), 0.0, 1.0));
		} else {
			c += funcionAtenuacionDist()*funcionAtenuacionDir()*(clamp(calcDifusa(Id), 0.0, 1.0) + clamp(calcEspecular(Is), 0.0, 1.0));
		}
	} 	

	c += calcAmbiental(Ia);
	c += Ke;

	return c;
}



