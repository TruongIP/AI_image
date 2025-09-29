
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { PortraitOptions, GeneratedImage, ImageFile } from '../types';

const PORTRAIT_MODEL_NAME = "gemini-2.5-flash-image-preview";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = ai.models;

const fileToGenerativePart = (file: ImageFile): Part => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.type,
    },
  };
};

const buildPrompt = (options: PortraitOptions): string => {
  let prompt = '';

  // Passport photo specific instructions
  if (options.aspectRatio === '3x4_passport' || options.aspectRatio === '4x6_passport') {
      const passportRatio = options.aspectRatio.split('_')[0]; // gives '3x4' or '4x6'
      prompt = `Generate a high-quality passport photo of the person in the provided image(s), suitable for official documents.

Key requirements:
- Aspect Ratio: ${passportRatio}.
- Background: A plain, solid, uniform light-colored background (typically off-white or light grey).
- Pose: Subject must be facing forward, looking directly at the camera. Head should be centered.
- Expression: A neutral facial expression or a slight, natural smile. Mouth closed.
- Lighting: Bright and even lighting across the face, with no shadows on the face or in the background.
- Attire: Simple, professional clothing. Avoid busy patterns, uniforms, or headwear (unless for religious reasons).
- Quality: ${options.quality} resolution. The image must be sharp, clear, and in focus.
`;
  } else {
    // Original prompt for other portraits
    prompt = `Generate a high-quality portrait of the person in the provided image(s).

Style: ${options.style}.
Shot Angle: ${options.shot}.
Aspect Ratio: ${options.aspectRatio}.
Quality: ${options.quality} resolution.
`;
  }

  if (options.outfitDescription) {
    prompt += `The person should be wearing: ${options.outfitDescription}. `;
  }
  if (options.outfitImage) {
    prompt += `The outfit should be inspired by the provided outfit image. `;
  }

  // Specific style instructions - should not run for passport photos.
  if (options.style === 'magazine' && options.aspectRatio !== '3x4_passport' && options.aspectRatio !== '4x6_passport') {
    prompt += `The final image must look like a real fashion magazine cover. Include a bold, stylish magazine title at the top (e.g., "STYLE", "VOGUE", "ELEGANCE"). Scatter smaller text elements like headlines and article teasers around the subject, such as "The Future of Tech" or "An Exclusive Interview". The person should be the main focus, perfectly integrated into the cover layout. `;
  }

  if (options.refinePrompt) {
    prompt += `Refinement: ${options.refinePrompt}. `;
  }

  if (options.hairstyleImage) {
    prompt += `The hairstyle should be inspired by the provided hairstyle image. `;
  }

  if (options.aspectRatio !== '3x4_passport' && options.aspectRatio !== '4x6_passport') {
     prompt += `Focus on creating a realistic, professional, and flattering portrait that accurately reflects the person's features from the source images. Ensure the final image is polished and high-resolution.`
  }

  return prompt;
};

export const generatePortraits = async (options: PortraitOptions): Promise<GeneratedImage[]> => {
  const prompt = buildPrompt(options);

  const contents: Part[] = [
    ...options.sourceImages.map(fileToGenerativePart),
  ];
  if(options.outfitImage) {
    contents.push(fileToGenerativePart(options.outfitImage));
  }
  if(options.hairstyleImage) {
    contents.push(fileToGenerativePart(options.hairstyleImage));
  }
  contents.push({ text: prompt });

  // Generate 4 images in parallel
  const promises = Array(4).fill(0).map(() => 
    model.generateContent({
      model: PORTRAIT_MODEL_NAME,
      contents: { parts: contents },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    })
  );

  const responses = await Promise.all(promises);

  const generatedImages: GeneratedImage[] = [];
  responses.forEach((response, index) => {
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImages.push({
            id: `gen-img-${index}-${Date.now()}`,
            src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            alt: `Generated portrait in ${options.style} style`,
          });
          // Take the first image part from each response
          break;
        }
      }
    }
  });

  if (generatedImages.length === 0) {
    throw new Error("The AI model did not return any images.");
  }

  return generatedImages;
};
