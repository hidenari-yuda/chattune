import { useState } from 'react';
// import { Counter } from '../app/features/counter';

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

// Define the function that will be executed in the context of the webpage
function getElement() {
  const innerHTML = document.body.innerHTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  alert('innerHTML:' + innerHTML);

  const elements = document.getElementsByClassName('div#:1v');
  alert('elements:' + elements.length + elements[0].textContent);
  if (elements.length > 0) {
    const text = elements[0].textContent; // or any other property you need
    alert('text:' + text);
    return text;
  }
  return null; // Return null or appropriate value if the element is not found
}

const Popup = () => {
  document.body.className = 'w-[30rem] h-[15rem]';

  // Use this function to send a message to the content script
  // const message = { command: 'scrape' };

  const [chat, setChat] = useState('');
  console.log('Popup setChat', setChat);

  const getChat = async () => {
    // Execute the script
    try {
      const tab = await getCurrentTab();
      if (!tab || tab.id === undefined) {
        console.error('No active tab found');
        alert('No active tab found');
        return;
      }
      alert('tab' + tab.id);
      const result = chrome.scripting.executeScript(
        {
          func: () => console.log('Hello, world!'),
          args: [], // Add an empty array for args
          target: { tabId: tab.id },
        },
        getElement
      );
      console.log(result);
    } catch (error) {
      console.error(error);
      alert('error' + error);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-2 text-base">Popup Counter</div>
      <div className="flex justify-center mt-2 text-base">{chat}</div>
      <button className="flex justify-center mt-2 text-base" onClick={getChat}>
        Get Chat
      </button>
      {/* <Counter /> */}
    </>
  );
};

export default Popup;

// chrome.runtime.onInstalled.addListener(({ reason }) => {
//   if (reason === 'install') {
//     chrome.tabs.create({
//       url: 'onboarding.html',
//     });
//   }
// });

//  async function getCurrentTab() {
//    let queryOptions = { active: true, lastFocusedWindow: true };
//    // `tab` will either be a `tabs.Tab` instance or `undefined`.
//    let [tab] = await chrome.tabs.query(queryOptions);
//    return tab;
//  }

//  function getCurrentTab(callback) {
//    let queryOptions = { active: true, lastFocusedWindow: true };
//    chrome.tabs.query(queryOptions, ([tab]) => {
//      if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
//      // `tab` will either be a `tabs.Tab` instance or `undefined`.
//      callback(tab);
//    });
//  }

// function sendMessageToActiveTab(message) {
//   const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
//   const response = await chrome.tabs.sendMessage(tab.id, message);
//   // TODO: Do something with the response.
// }
