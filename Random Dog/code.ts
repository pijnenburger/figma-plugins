// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(400, 300);

let currentViewY = figma.viewport.center.y;
let currentViewX = figma.viewport.center.x;



// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async(msg) => {
  
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  if (msg[0] === 'generate-dog') {
      let data = msg[1] as Uint8Array;
      let dogSize = msg[2];
      let imageHash = figma.createImage(new Uint8Array(data)).hash;
      // console.log(imageHash);

      // creating the parent card with AutoLayout
      const container = figma.createFrame();
      container.name = "A good boy";
      container.layoutMode = "VERTICAL";
      container.resize(dogSize, dogSize);
      container.x = Math.floor(currentViewX - (container.width/2));
      container.y = Math.floor(currentViewY - (container.height/2));
      container.cornerRadius = dogSize / 10;
      container.primaryAxisAlignItems = "CENTER";
      container.counterAxisAlignItems = "CENTER";
      container.verticalPadding = dogSize / 20;
      container.horizontalPadding = dogSize / 20;
      container.itemSpacing = dogSize / 40;
      container.rotation = (Math.floor(Math.random() * 20) - 10);


      // creating the dog image
      const dogFrame = figma.createFrame();
      dogFrame.name = "Dog";
      dogFrame.layoutGrow = 1;
      dogFrame.layoutAlign = "STRETCH";
      dogFrame.cornerRadius = ((container.cornerRadius - container.verticalPadding) / 2);
      dogFrame.topLeftRadius = (container.cornerRadius - container.verticalPadding);
      dogFrame.topRightRadius = (container.cornerRadius - container.verticalPadding);
      dogFrame.fills = [
        // { type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }, 
        { type: "IMAGE", scaleMode: "FILL", imageHash },
      ];
      
      // adding text below the image
      const description = figma.createText();
      description.characters = "Who's a good boy?";
      description.layoutAlign = "STRETCH";
      description.textAlignHorizontal = "CENTER";
      description.fontSize = dogSize / 20;
      description.fontName = {family: "Inter", style: "Bold"}

      // putting all the layers together
      container.appendChild(dogFrame);
      container.appendChild(description);

      // putting it on the current page
      figma.currentPage.appendChild(container);
    }

  figma.closePlugin();
};
