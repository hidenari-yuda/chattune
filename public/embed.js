const func = () => {
  console.log('Hello from embed.js');
  console.log('window', window);
  console.log('window.location.href: ', window.location.href);

  alert('Hello from embed.js');
  alert('window', window);
  alert('window.location.href: ', window.location.href);

  // get html
  const html = document.documentElement.outerHTML;
  console.log('html', html);
  alert('html', html);

  // get title
  const title = document.title;
  console.log('title', title);
  alert('title', title);

};

func();

// content_scriptsからのメッセージを受け取り、windowオブジェクトを取得して送信します
// Listen for messages from content_scripts and retrieve the window object to send back
// window.addEventListener(
//   'message',
//   (event) => {
//     alert('Received message from content_scripts' + event.data);

//     if (event.source !== window) {
//       alert('Event source is not window');
//       return;
//     }

//     if (event.data.type && event.data.type === 'FROM_CONTENT') {
//       switch (event.data.action) {
//         case 'GET_WINDOW':
//           const data = JSON.stringify(window);
//           window.postMessage({ type: 'FROM_EMBED', action: 'GET_WINDOW', data }, '*');
//           break;
//       }
//     }
//   },
//   false
// );
