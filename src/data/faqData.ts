/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQItem } from '../types';

export const FAQ_DATA: FAQItem[] = [
  // Category: AI Background Removal (15)
  {
    id: 'faq-1',
    question: 'How does the AI background removal tool work?',
    answer: 'BGCraft AI uses advanced computer vision algorithms to automatically detect the main subject (foreground) in your photo and separate it from its background with pixel-perfect accuracy. It scans for edge transitions, color contrasts, and texture gradients to refine fine details like hair, fur, and complex objects.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-2',
    question: 'Is the background remover completely free to use?',
    answer: 'Yes, BGCraft AI is 100% free with no hidden charges, premium subscriptions, watermarks, signup, or registration required. You can process and download unlimited high-resolution photos for both personal and commercial use.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-3',
    question: 'Does the tool compress my images or lower their quality?',
    answer: 'Unlike many other online utilities, BGCraft AI maintains the native resolution and dimensions of your original uploaded files. There are no quality downgrades or low-res locks, and you can adjust compression levels upon exporting.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-4',
    question: 'Can BGCraft AI handle complex details like hair, fur, and transparent objects?',
    answer: 'Yes. Our specialized edge refinement model is trained on hair segmentation, animal fur, and semi-transparent objects to extract clean, smooth cutouts without jagged edges or color bleeding.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-5',
    question: 'What image file formats are supported for upload?',
    answer: 'We support all major image file formats including PNG, JPG, JPEG, WEBP, AVIF, BMP, TIFF, GIF, and HEIC.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-6',
    question: 'Is my uploaded data safe and private?',
    answer: 'Absolutely. We respect your privacy. All uploads are processed securely. Temporary local files are automatically deleted after processing, and we never store your images on long-term cloud databases without your consent.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-7',
    question: 'How do I download my image with a transparent background?',
    answer: 'After removing the background, keep the background configuration set to "Transparent". Then, click the Export button and choose the "PNG" format. JPG/JPEG does not support transparency, so PNG is required.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-8',
    question: 'Can I remove backgrounds from graphics, logos, and illustration vectors?',
    answer: 'Yes, our subject detection is highly flexible and works excellently on digital illustrations, logos, standard flat shapes, and icons in addition to photographic subjects.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-9',
    question: 'What is the "AI Edge Refinement" feature?',
    answer: 'AI Edge Refinement is a smart post-processing step that analyzes the border pixels of your cutout to smooth out aliasing, reduce halo effects, and blend colors with whatever new background you choose.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-10',
    question: 'How does animal fur detection work compared to human hair?',
    answer: 'Animal fur consists of much denser, shorter textures. Our model uses micro-edge analysis to differentiate between background clutter and the soft, textured contours of cats, dogs, and wildlife.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-11',
    question: 'Can I select which parts of the image to keep or erase manually?',
    answer: 'Yes! We provide an interactive Manual Eraser & Brush tool with customizable brush size, opacity, and feather parameters. This lets you touch up complex cutouts or manually isolate any specific portion of your canvas.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-12',
    question: 'Is there a file size limit for uploads?',
    answer: 'BGCraft AI supports images up to 25MB. This covers high-end professional DSLR camera resolutions and massive mobile captures.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-13',
    question: 'Do I need any graphic design experience to remove backgrounds?',
    answer: 'Not at all. The process is completely automated. You simply drag and drop your image, and BGCraft AI separates the background in a single click.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-14',
    question: 'Can the tool remove background from images containing multiple people?',
    answer: 'Yes, our multi-subject segmentation algorithms recognize groups of people, identifying and isolating them together as the unified foreground.',
    category: 'AI Background Removal'
  },
  {
    id: 'faq-15',
    question: 'Can I process high-resolution transparent PNG images?',
    answer: 'Yes, you can export your processed files back to high-resolution transparent PNGs directly in your native upload dimensions.',
    category: 'AI Background Removal'
  },

  // Category: Background Replacement (15)
  {
    id: 'faq-16',
    question: 'How do I add a solid color background to my cutout?',
    answer: 'In the BG Replace tab of our sidebar, select "Solid Colors". You can choose from our hand-picked palette presets or use the custom color picker to select any custom HEX or RGB color.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-17',
    question: 'Can I use custom gradient backgrounds?',
    answer: 'Yes! Select the "Gradient Backgrounds" option, pick your start and end colors, and adjust the gradient angle slider (0 to 360 degrees) to create beautiful backdrop transitions.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-18',
    question: 'How does the AI Generated Background feature work?',
    answer: 'You can write a simple text prompt (e.g., "warm cozy studio with wooden floors and plants, soft bokeh") and BGCraft AI will use our integrated Gemini Image Generation model to create a unique, high-quality background matching your exact description.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-19',
    question: 'Can I upload my own custom background image?',
    answer: 'Absolutely. Select "Custom Upload" under the background replacement controls, choose any image from your computer or phone, and the cutout will automatically overlay onto it.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-20',
    question: 'What types of studio backgrounds are pre-configured?',
    answer: 'We provide professionally designed Studio templates including professional headshot backdrops, neutral gray office walls, spotlight glow presets, minimalist bento grids, and high-fashion product stages.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-21',
    question: 'Can I adjust the blur level of the background independently?',
    answer: 'Yes. BGCraft AI provides a dedicated Background Blur slider. You can keep your subject perfectly sharp while blurring the background to simulate a beautiful lens bokeh effect (0px to 100px).',
    category: 'Background Replacement'
  },
  {
    id: 'faq-22',
    question: 'Are there nature themed backgrounds available?',
    answer: 'Yes, we have high-quality pre-loaded nature assets including dense green forests, sunny beaches, misty snow mountains, sunset horizons, and clear skies.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-23',
    question: 'Can I resize and reposition my subject on the new background?',
    answer: 'Yes, you can easily scale, rotate, flip, and drag your isolated subject to position them perfectly anywhere on the new canvas.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-24',
    question: 'Do you offer seasonal or holiday backgrounds?',
    answer: 'Yes, we feature pre-configured backgrounds for Christmas, birthdays, weddings, festivals, and other celebrations to help you create cards and social posts quickly.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-25',
    question: 'Can I overlay text or shapes on top of the background replacement?',
    answer: 'Yes, BGCraft AI has a robust overlay engine allowing you to place text headers, emoji stickers, graphic elements, and geometric borders on top of your final image composition.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-26',
    question: 'How do I create a professional LinkedIn profile backdrop?',
    answer: 'Upload your photo, remove the background, select "Solid Colors" or "Gradient Backgrounds" with modern corporate tones (e.g., steel blue or slate gray), center your face using the Smart Center tool, and download.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-27',
    question: 'What abstract or modern neon styles are available?',
    answer: 'Our Creative category offers futuristic neon grids, dark cyber punk alleys, organic fluid mesh gradients, and light-leak abstractions.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-28',
    question: 'Can I simulate shadows on the new background?',
    answer: 'Yes! We feature an AI Shadow generator that projects realistic drop shadows or contact shadows beneath your subject to blend them naturally with the environment.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-29',
    question: 'Is there a limit on how many AI backgrounds I can generate?',
    answer: 'No, background generations are completely free. You can iterate with different descriptions until you find the perfect match for your graphic.',
    category: 'Background Replacement'
  },
  {
    id: 'faq-30',
    question: 'Do the pre-loaded backgrounds require attribution?',
    answer: 'No. All assets provided inside BGCraft AI are licensed under public domain or CC0, meaning they are completely free for commercial and editorial purposes without attribution.',
    category: 'Background Replacement'
  },

  // Category: Photo Editing (15)
  {
    id: 'faq-31',
    question: 'What photo adjustment sliders are available in BGCraft AI?',
    answer: 'Our professional adjustment suite includes Brightness, Contrast, Exposure, Highlights, Shadows, Color Temperature, Tint, Hue, Saturation, Vibrance, and Gamma.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-32',
    question: 'How do I crop an image in the editor?',
    answer: 'Go to the Adjustments panel and click the Crop tool. You can drag the boundaries freely or select preset ratios like 1:1 (Instagram), 4:3, 16:9 (YouTube), and apply the crop instantly.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-33',
    question: 'How do I rotate and flip my photos?',
    answer: 'Under the Adjustments tab, you can rotate the canvas in 90-degree increments, or instantly flip your photo horizontally (mirror effect) or vertically.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-34',
    question: 'What are aesthetic presets and how do I apply them?',
    answer: 'Aesthetic Presets are one-click filters that alter the visual color profile of your photo. We offer HDR effect, Vintage film, Mono Black & White, Sepia, Cinema Film, and Dreamy Glow.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-35',
    question: 'Can I add text layers to my canvas?',
    answer: 'Yes, our Text Overlay tool supports custom text inputs, font families (sans-serif, serif, mono, script), text color selection, background fills, size adjustments, and drag-and-drop placement.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-36',
    question: 'Can I add multiple stickers or shapes to a single design?',
    answer: 'Yes. You can add unlimited overlays including customizable emoji stickers and shapes like rectangles, circles, stars, and hearts with custom border widths and fills.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-37',
    question: 'What is Vignetting and how does it improve photos?',
    answer: 'Vignette darkens the corners of your canvas, drawing the viewer\'s focus directly toward the center subject. It is perfect for professional portraits and dramatic landscapes.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-38',
    question: 'Can I round the corners of my edited images?',
    answer: 'Yes! Use the Corner Radius slider (0px to 100px) to round the edges of your canvas, making it ideal for web graphics, modern cards, and app assets.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-39',
    question: 'How do I add a colored border to my output photo?',
    answer: 'Under Borders & Shadows, you can define a custom border thickness and select any color to outline your edited image beautifully.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-40',
    question: 'Is there an undo and redo system available?',
    answer: 'Yes. We maintain an active editing history log. You can step backward or forward through all your filter changes, text additions, and crop actions using the UI buttons or standard keyboard shortcuts.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-41',
    question: 'Can I resize the actual canvas size independently of the image?',
    answer: 'Yes, you can expand or shrink the canvas bounds (width and height in pixels) and decide how your image scales or positions inside the new dimensions.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-42',
    question: 'What is the "AI Auto-Enhance" option?',
    answer: 'AI Auto-Enhance analyzes the histogram of your uploaded photo, identifies over/under-exposed areas, color casts, and optimal contrasts, and applies professional-grade balancing instantly.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-43',
    question: 'Does the editor support high-definition web editing?',
    answer: 'Yes, all canvas rendering is performed using hardware-accelerated HTML5 GPU canvas contexts to ensure responsive, lag-free operations at high resolutions.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-44',
    question: 'Can I add a custom watermark to protect my designs?',
    answer: 'Yes, you can write text or overlay a semi-transparent logo at any scale anywhere on the canvas to serve as your custom watermark.',
    category: 'Photo Editing'
  },
  {
    id: 'faq-45',
    question: 'How do I reset all my edits and start fresh?',
    answer: 'Simply click the "Reset Canvas" button on the workspace header to revert all adjustments, filters, borders, and layers back to the original image.',
    category: 'Photo Editing'
  },

  // Category: Technical & Export (15)
  {
    id: 'faq-46',
    question: 'What export file formats do you support?',
    answer: 'We support exporting in high-resolution PNG, JPEG, WEBP, and AVIF formats, ensuring your images are optimized for any web platform or print layout.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-47',
    question: 'What does the Quality Slider do?',
    answer: 'The quality slider (0% to 100%) controls the lossy compression level for JPEG, WEBP, and AVIF exports. 80-90% is highly recommended for web use as it massively reduces file size with zero visible detail loss.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-48',
    question: 'Can I rename the file before downloading?',
    answer: 'Yes, we provide a custom filename input field so you can organize your assets with SEO-friendly titles before downloading.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-49',
    question: 'Is there a limit on how many images I can download?',
    answer: 'There are absolutely no download caps or rate limits. You can edit and download thousands of images daily completely free of charge.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-50',
    question: 'Does BGCraft AI work on mobile phones and tablets?',
    answer: 'Yes, our platform is fully responsive and carefully optimized for mobile browsers, including safari, chrome, and android webviews, offering smooth drag, drop, and pinch actions.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-51',
    question: 'Do I need to install any apps or browser extensions?',
    answer: 'No installation required! BGCraft AI is a standard progressive web application that runs directly in any modern browser without external plugins.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-52',
    question: 'Are there any watermarks placed on the output files?',
    answer: 'No. Every single image you process and export with BGCraft AI is completely watermark-free, clean, and ready for professional publishing.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-53',
    question: 'How do I clear the memory cache if the browser gets slow?',
    answer: 'Simply click the Reset button or refresh the page. BGCraft AI frees up unused GPU canvas allocations and garbage-collects base64 image objects to restore peak performance.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-54',
    question: 'Why is my background transparent but downloads as black/white?',
    answer: 'Make sure you selected "PNG" as your export format. JPG/JPEG formats do not have an alpha transparency channel, so transparency defaults to solid white or black background fill.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-55',
    question: 'Is the platform compliant with GDPR and CCPA?',
    answer: 'Yes, we do not require accounts, logins, or capture personal identification details, and we process all image operations securely without tracking user metrics.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-56',
    question: 'What is AVIF export and why is it recommended?',
    answer: 'AVIF is a cutting-edge next-generation image format that offers up to 50% better compression efficiency compared to standard JPEGs, maintaining beautiful quality at incredibly small file sizes.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-57',
    question: 'Can I use BGCraft AI offline?',
    answer: 'Our core editing canvas, brush adjustments, filters, and overlays run entirely client-side, allowing offline use once loaded. AI background replacement and generations require a connection to our Gemini server endpoints.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-58',
    question: 'Do you offer a batch/bulk processing feature?',
    answer: 'Currently, BGCraft AI is optimized for single-image precision editing and composition, ensuring max detail for professional assets.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-59',
    question: 'How do I report a bug or suggest a feature?',
    answer: 'Please navigate to our Contact page to submit any questions, report issues, or suggest new tool features directly to our engineering team.',
    category: 'Technical & Export'
  },
  {
    id: 'faq-60',
    question: 'What makes BGCraft AI better than paid alternatives?',
    answer: 'We provide full commercial rights, original resolution outputs, extensive adjustment options, custom AI-background generators, and absolute zero charges, subscriptions, or watermarks.',
    category: 'Technical & Export'
  }
];
