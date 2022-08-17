// // This plugin will open a window to prompt the user to enter a number, and
// // it will then create that many rectangles on the screen.

// // This file holds the main code for the plugins. It has access to the *document*.
// // You can access browser APIs in the <script> tag inside "ui.html" which has a
// // full browser environment (see documentation).

// // This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(500, 500);
figma.ui.onmessage = async (pluginMessage) => {

  // load the font so there's no issues anymore
  await figma.loadFontAsync({ family: "Rubik", style: "Regular" });

  const nodes:SceneNode[] = [];


  // getting all the nodes from the component named 'post'
  const postComponentSet = figma.root.findOne(node => node.type == "COMPONENT_SET" && node.name == "post") as ComponentSetNode;


  // getting the right variant, based on selection
  let selectedVariant;

  if (pluginMessage.darkModeState === true) {
    switch (pluginMessage.imageVariant) {
      case "2":
        selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=true");
        break;
      case "3":
        selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=true");
        break;
      default:
        selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=none, Dark mode=true");
        break;
    }
  } else {
    switch (pluginMessage.imageVariant) {
      case "2":
        selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=false");
        break;
      case "3":
        selectedVariant = postComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=false");
        break;
      default:
        selectedVariant = postComponentSet.defaultVariant;
        break;
    }
  }
  const newPost = selectedVariant.createInstance();


  // selecting the text fields in the component
  const templateName = newPost.findOne(node => node.type == "TEXT" && node.name == "displayName") as TextNode;
  const templateUsername = newPost.findOne(node => node.type == "TEXT" && node.name == "@username") as TextNode;
  const templateDescription = newPost.findOne(node => node.type == "TEXT" && node.name == "description") as TextNode;
  const templateLikes = newPost.findOne(node => node.type == "TEXT" && node.name == "likesLabel") as TextNode;
  const templateComments = newPost.findOne(node => node.type == "TEXT" && node.name == "commentsLabel") as TextNode;

  // overriding the text fields with data from the UI
  templateName.characters = pluginMessage.name;
  templateUsername.characters = pluginMessage.username;
  templateDescription.characters = pluginMessage.description;
  templateLikes.characters = Math.floor((Math.random() * 1000) + 1).toString();
  templateComments.characters = Math.floor((Math.random() * 400) + 1).toString();

  // positioning it all correctly based on viewport
  let currentViewX = figma.viewport.center.x;
  let currentViewY = figma.viewport.center.y;

  let componentWidth = newPost.width;
  let componentHeight = newPost.height;


  newPost.x = Math.floor(currentViewX - (componentWidth/2));
  newPost.y = Math.floor(currentViewY - (componentHeight/2));

  console.log(componentWidth);
  console.log(componentHeight);

  // reposition viewport based on nodes
  // nodes.push(newPost);
  // figma.viewport.scrollAndZoomIntoView(nodes);

  figma.closePlugin();
};


// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = msg => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'create-rectangles') {
//     const nodes: SceneNode[] = [];
//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.y = i * 10;
//       rect.fills = [{type: 'SOLID', color: {r: 0.5, g: 0.2, b: 0.2}}];
//       rect.cornerRadius = 24;
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }
//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   figma.closePlugin();
// };


