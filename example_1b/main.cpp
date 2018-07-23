#include <cstdlib>
#include <cstdio>
using namespace std;

#include <GL/glew.h>
#include <GL/freeglut.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

#include "shader_util.h"

// Shaders' filenames.
const char vertShaderFilename[] = "shader.vert";
const char fragShaderFilename[] = "shader.frag";

GLuint shaderProgObj;  // The shader program object.
GLuint VAO;            // The vertex array object.


const int numVerts = 6;  // Total number of vertices.

GLfloat vertPos[numVerts][3] = { { 0.0f, 8.0f, 5.0f },{ -8.0f, 0.0f, 5.0f },{ 8.0f, 0.0f, 5.0f },
{ 0.0f, -5.0f, 2.0f },{ 10.0f, 5.0f, 2.0f },{ -10.0f, 5.0f, 2.0f } };

GLfloat vertColor[numVerts][3] = { { 1.0f, 0.0f, 0.0f },{ 0.0f, 1.0f, 0.0f },{ 0.0f, 0.0f, 1.0f },
{ 1.0f, 1.0f, 0.0f },{ 1.0f, 0.0f, 1.0f },{ 0.0f, 1.0f, 1.0f } };


int winWidth = 800;     // Window width in pixels.
int winHeight = 600;    // Window height in pixels.


/////////////////////////////////////////////////////////////////////////////
// The display callback function.
/////////////////////////////////////////////////////////////////////////////

void MyDisplay(void)
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glm::mat4 projMat = glm::perspective(glm::radians(45.0), (double)winWidth / winHeight, 15.0, 25.0);
    glUniformMatrix4fv(1, 1, GL_FALSE, &projMat[0][0]);

    glm::mat4 mvMat = glm::lookAt(glm::vec3(0.0, 2.5, 25.0), 
                                  glm::vec3(0.0, 2.5, 0.0), glm::vec3(0.0, 1.0, 0.0));
    glUniformMatrix4fv(0, 1, GL_FALSE, &mvMat[0][0]);

    glBindVertexArray(VAO);
    glDrawArrays(GL_TRIANGLES, 0, numVerts);

    glutSwapBuffers();
}



/////////////////////////////////////////////////////////////////////////////
// The reshape callback function.
/////////////////////////////////////////////////////////////////////////////
void MyReshape(int w, int h)
{
    winWidth = w;
    winHeight = h;
    glViewport(0, 0, w, h);
}



/////////////////////////////////////////////////////////////////////////////
// The init function. It initializes some OpenGL states.
/////////////////////////////////////////////////////////////////////////////
void MyInit(void)
{
    // Create shader program object.
    shaderProgObj = makeShaderProgramFromFiles(vertShaderFilename, fragShaderFilename, NULL);
    if (shaderProgObj == 0)
    {
        fprintf(stderr, "Error: Cannot create shader program object.\n");
        fflush(stdin); getchar(); // Prevents the console window from closing.
      //  exit(1);
    }

    glUseProgram(shaderProgObj);

    GLuint vertPosBufferObj;
    glCreateBuffers(1, &vertPosBufferObj);
    glNamedBufferStorage(vertPosBufferObj, sizeof(vertPos), &vertPos[0][0], 0);

    GLuint vertColorBufferObj;
    glCreateBuffers(1, &vertColorBufferObj);
    glNamedBufferStorage(vertColorBufferObj, sizeof(vertColor), &vertColor[0][0], 0);

    glCreateVertexArrays(1, &VAO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, vertPosBufferObj);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);
    glBindBuffer(GL_ARRAY_BUFFER, vertColorBufferObj);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 0, 0);
    glEnableVertexAttribArray(0);
    glEnableVertexAttribArray(1);

    glClearColor(0.0, 0.0, 0.0, 1.0); // Set black background color.
    glEnable(GL_DEPTH_TEST); // Use depth-buffer for hidden surface removal.
}



/////////////////////////////////////////////////////////////////////////////
// The main function.
/////////////////////////////////////////////////////////////////////////////
int main( int argc, char** argv )
{
    // Initialize GLUT and create window.
    glutInit( &argc, argv );
    glutInitContextVersion( 4, 5 );
    glutInitContextFlags( GLUT_FORWARD_COMPATIBLE );
    glutInitContextProfile( GLUT_CORE_PROFILE );
    glutInitDisplayMode ( GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH );
    glutInitWindowSize( winWidth, winHeight );
    glutCreateWindow( "main" );

    // Register the callback functions.
    glutDisplayFunc( MyDisplay ); 
    glutReshapeFunc( MyReshape );

    // Initialize GLEW.
    GLenum err = glewInit();
    /*if ( err != GLEW_OK )
    {
        fprintf( stderr, "Error: %s.\n", glewGetErrorString( err ) );
        exit( 1 );
    }
    printf( "Status: Using GLEW %s.\n", glewGetString( GLEW_VERSION ) );

    if ( !GLEW_VERSION_4_5 )
    {
        fprintf( stderr, "Error: OpenGL 4.5 is not supported.\n" );
        exit( 1 );
    }*/

    MyInit();

    // Enter GLUT event loop.
    glutMainLoop();
    return 0;
}
