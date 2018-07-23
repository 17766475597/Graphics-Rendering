#version 450 core

layout (location = 0) in vec4 vPos;
layout (location = 1) in vec4 vColor;

layout (location = 0) uniform mat4 ModelViewMatrix;
layout (location = 1) uniform mat4 ProjectionMatrix;

out vec4 v2fColor;

void main()
{
    v2fColor = vColor;
    gl_Position = ProjectionMatrix * ModelViewMatrix * vPos;
}
