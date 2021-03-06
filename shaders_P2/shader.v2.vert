#version 330 core


in vec3 inPos;	
in vec3 inColor;
in vec3 inNormal;

uniform mat4 modelViewProj;
uniform mat4 normal;
uniform mat4 modelView;

out vec3 color;
out vec3 pos;
out vec3 norm;

void main()
{
	color = inColor;

	// Multiplicamos las normales por una matriz especial que 
	// normaliza la transformacion de las normales, calculada por IGlib
	norm = (normal*vec4(inNormal, 0.0)).xyz;

	pos = (modelView*vec4(inPos, 1.0)).xyz;

	gl_Position =  modelViewProj * vec4 (inPos,1.0);
}

