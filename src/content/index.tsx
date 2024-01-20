import 'webextension-polyfill';
import 'construct-style-sheets-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { debounce } from 'lodash-es';
import { twind, config, cssom, observe, stringify } from './twind';
import { proxyStore } from '../app/proxyStore';
import Content from './Content';

proxyStore.ready().then(() => {
  const contentRoot = document.createElement('div');
  contentRoot.id = 'my-extension-root';
  contentRoot.style.display = 'contents';
  document.body.append(contentRoot);

  const shadowRoot = contentRoot.attachShadow({ mode: 'open' });
  const sheet = cssom(new CSSStyleSheet());

  // shadowRoot.adoptedStyleSheet bug in firefox
  // see: https://bugzilla.mozilla.org/show_bug.cgi?id=1827104
  if (navigator?.userAgent.includes('Firefox')) {
    const style = document.createElement('style');
    const debouncedSyncCss = debounce(() => {
      style.textContent += stringify(sheet.target);
    }, 100);

    const originalSheetInsert = sheet.insert;
    (sheet.insert as typeof originalSheetInsert) = (...params) => {
      originalSheetInsert(...params);
      debouncedSyncCss();
    };
    shadowRoot.appendChild(style);
  } else {
    shadowRoot.adoptedStyleSheets = [sheet.target];
  }

  const tw = twind(config, sheet);
  observe(tw, shadowRoot);

  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'root';
  shadowWrapper.style.display = 'contents';
  shadowRoot.appendChild(shadowWrapper);

  // https://zenn.dev/ellreka/articles/799632c02d1cb5
  const head = document.head;
  alert('content_script.js. head: ' + head);
  const script = document.createElement('script');
  alert('content_script.js. script: ' + script);
  script.src = chrome.runtime.getURL('embed.js');
  alert('content_script.js. script.src: ' + script.src);

  head.appendChild(script);

  // popupからのメッセージを受け取り、embedに送信します
  // chrome.runtime.onMessage.addListener((request, sender) => {
  //   window.postMessage({ type: 'FROM_CONTENT', action: request.action, data: request.data }, '*');
  // });

  // embedからのメッセージを受け取り、popupに送信します
  // Listen for messages from embed and send them to the popup
  // window.addEventListener(
  //   'message',
  //   (event) => {
  //     if (event.source !== window) {
  //       return;
  //     }

  //     if (event.data.type && event.data.type === 'FROM_EMBED') {
  //       switch (event.data.action) {
  //         case 'GET_WINDOW':
  //           chrome.runtime.sendMessage({
  //             action: event.data.action,
  //             data: event.data.data,
  //           });
  //           break;
  //       }
  //     }
  //   },
  //   false
  // );

  createRoot(shadowWrapper).render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <Content />
      </Provider>
    </React.StrictMode>
  );
});
