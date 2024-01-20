// import { useEffect, useState } from 'react';

const Popup = () => {
  // const [state, setState] = useState();
  // alert('popup. state: ' + state);

  // useEffect(() => {
  //   // content_scriptsからのメッセージを受け取ります
  //   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //     alert('popup. request.action: ' + request.action);
  //     alert('popup. request.data: ' + request.data);
  //     alert('popup. sender: ' + sender);
  //     alert('popup. sendResponse: ' + sendResponse);
  //     switch (request.action) {
  //       case 'GET_WINDOW':
  //         setState(request.data);
  //         break;
  //     }
  //   });
  // }, []);

  // chrome.tabs.query()でtabIdを取得
  async function getTabId() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab?.id;
  }

  const getWindowObject = async () => {
    const tabId = await getTabId();
    if (tabId != null) {
      // content_scriptsにメッセージを送信
      // chrome.tabs.sendMessage(tabId, { action: 'GET_WINDOW' });

      alert('popup. tabId: ' + tabId);

      chrome.tabs.executeScript(
        tabId,
        {
          code: 'document.body.innerText',
        },
        function (results) {
          alert('popup. results: ' + results);
        }
      );
    }
  };
  //   return <button onClick={getWindowObject}>btn</button>;
  // }

  return (
    <>
      <div className="flex justify-center mt-2 text-base">Popup Counter</div>
      <button className="flex justify-center mt-2 text-base" onClick={getWindowObject}>
        Get Chat
      </button>
      {/* <Counter /> */}
    </>
  );
};

export default Popup;
