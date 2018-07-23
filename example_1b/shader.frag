#version 450 core

layout (location = 0) out vec4 fColor;

in vec4 v2fColor;

void main()
{
    fColor = v2fColor;
}
