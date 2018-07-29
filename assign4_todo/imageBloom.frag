//============================================================================
// STUDENT NAME: 
// NUS User ID.: 
// COMMENTS TO GRADER: 
//
//============================================================================

// FILE: imageBloom.frag

// FRAGMENT SHADER

#version 430 core

//============================================================================
// Pass number: 
// 1 -- do image thresholding, 
// 2 -- do horizontal blurring,
// 3 -- do vertical blurring,
// 4 -- do combining of original image and blurred image.
//============================================================================
uniform int PassNum;

//============================================================================
// Received from rasterizer.
//============================================================================
in vec2 texCoord;    // Fragment's texture coordinates.

//============================================================================
// Threshold value for thresholding the original image luminance.
//============================================================================
uniform float LuminanceThreshold;

//============================================================================
// Number of values in the 1D blur filter.
//============================================================================
uniform int BlurFilterWidth;  // Always an odd number.

//============================================================================
// Input texture maps.
//============================================================================
layout (binding = 0) uniform sampler1D BlurFilterTex;
layout (binding = 1) uniform sampler2D OriginalImageTex;
layout (binding = 2) uniform sampler2D ThresholdImageTex;
layout (binding = 3) uniform sampler2D HorizBlurImageTex;
layout (binding = 4) uniform sampler2D VertBlurImageTex;

//============================================================================
// Outputs.
//============================================================================
layout (location = 0) out vec4 FragColor;


/////////////////////////////////////////////////////////////////////////////
// Approximates the brightness of a RGB value.
/////////////////////////////////////////////////////////////////////////////
float Luminance( vec3 color ) 
{ 
    const vec3 LuminanceWeights = vec3(0.2126, 0.7152, 0.0722);
    return dot(LuminanceWeights, color); 
}


/////////////////////////////////////////////////////////////////////////////
// Threshold the original image.
/////////////////////////////////////////////////////////////////////////////
void ThresholdImage()
{
    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Read from the original image texture.
    // * If texture color's luminance >= LuminanceThreshold,
    //   write the texture color to output fragment,
    //   otherwise write black to output fragment.
    // * Note that the input image and the output image are different
    //   in size, so we cannot use the current fragment's coordinates
    //   as texel coordinates to read the original image texture. 
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////

	// Read from the original image texture.
	vec3 Color = vec3(texture(OriginalImageTex, texCoord));

	// Calculate the luminance and select to write the right color to output fragment
	float luminance = Luminance(Color);
	if (luminance >= LuminanceThreshold) {
		FragColor = vec4(Color, 1.0);
	}
	else {
		FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}

}


/////////////////////////////////////////////////////////////////////////////
// Apply horizontal blurring to the threshold image.
/////////////////////////////////////////////////////////////////////////////
void HorizBlurImage()
{
    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Use the 1D blur filter and apply digital convolution horizontally
    //   to blur the threshold image horizontally. 
    // * Note that the input image and the output image have the same size.
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////

	ivec2 pix = ivec2(gl_FragCoord.xy);
	// Half width of the blur filter
	int halfBlurFilterWidth = (BlurFilterWidth - 1) / 2;

	// Initialize sum with the central element
	vec4 sum = texelFetch(ThresholdImageTex, pix, 0) * texelFetch(BlurFilterTex, halfBlurFilterWidth, 0).r;
	
	// Calculate sum as the FragColor
	for (int i = 1; i < halfBlurFilterWidth; i++) {
		sum += texelFetch(ThresholdImageTex, pix + ivec2(i, 0), 0)*texelFetch(BlurFilterTex, halfBlurFilterWidth + i, 0).r;
		sum += texelFetch(ThresholdImageTex, pix + ivec2(-i, 0), 0)*texelFetch(BlurFilterTex, halfBlurFilterWidth - i, 0).r;
	}
	FragColor = sum;

}


/////////////////////////////////////////////////////////////////////////////
// Apply vertical blurring to the horizontally-blurred image.
/////////////////////////////////////////////////////////////////////////////
void VertBlurImage()
{
    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Use the 1D blur filter and apply digital convolution vertically
    //   to blur the input horizontally-blurred image vertically. 
    // * Note that the input image and the output image have the same size.
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////

	ivec2 pix = ivec2(gl_FragCoord.xy);
	// Half width of the blur filter
	int halfBlurFilterWidth = (BlurFilterWidth - 1) / 2;

	// Initialize sum with the central element
	vec4 sum = texelFetch(HorizBlurImageTex, pix, 0)*texelFetch(BlurFilterTex, halfBlurFilterWidth, 0).r;
	
	// Calculate sum as the FragColor
	for (int i = 1; i < halfBlurFilterWidth; i++) {
		sum += texelFetch(HorizBlurImageTex, pix + ivec2(0, i), 0)*texelFetch(BlurFilterTex, halfBlurFilterWidth + i, 0).r;
		sum += texelFetch(HorizBlurImageTex, pix + ivec2(0, -i), 0)*texelFetch(BlurFilterTex, halfBlurFilterWidth - i, 0).r;
	}
	FragColor = sum;

}


/////////////////////////////////////////////////////////////////////////////
// Add the original image to the blurred image to get the final image.
/////////////////////////////////////////////////////////////////////////////
void CombineImages()
{
    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Add the original image and the blurred threshold image.
    // * Note that the original image and the blurred threshold image are 
    //   different in size. The original image and the output image have
    //   the same size.
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////

	// Add the original image and the blurred threshold image
	FragColor = texture(OriginalImageTex, texCoord) + texture(VertBlurImageTex, texCoord);
}



void main()
{
    switch(PassNum) {
        case 1: ThresholdImage(); break;
        case 2: HorizBlurImage(); break;
        case 3: VertBlurImage(); break;
        case 4: CombineImages(); break;
    }
}
