/**
 * Cherry 🍒 AI Chat Widget
 * Embedded via a single script tag
 */

(function() {
  'use strict';

  // ---------- CONFIG ----------
  const CONFIG = {
      apiUrl: 'https://flotation-bench-api.onrender.com/api/chat/',
    botName: 'Cherry 🍒',
    botEmoji: '🍒',
    colors: {
      primary: '#D35400',
      primaryHover: '#E0681A',
      bgDark: '#0F172A',
      bgCard: '#1E293B',
      bgInput: '#273548',
      textPrimary: '#EDF2F7',
      textSecondary: '#94A3B8',
      border: '#334155',
      userBubble: '#D35400',
      botBubble: '#1E293B'
    }
  };

  // ---------- STATE ----------
  let isOpen = false;
  let chatHistory = [];
  let isProcessing = false;

  // ---------- DOM REFS ----------
  let container, button, chatWindow, messagesContainer, inputField, sendBtn, statusDot;

  // ---------- BUILD WIDGET ----------
  function buildWidget() {
    // Container (fixed position)
    container = document.createElement('div');
    container.id = 'cherry-chat-widget';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // ---- FLOATING BUTTON ----
    button = document.createElement('button');
    button.id = 'cherry-chat-button';
    button.innerHTML = 'Cherry 🍒';
    button.style.cssText = `
      background: ${CONFIG.colors.primary};
      color: white;
      border: none;
      border-radius: 50px;
      padding: 14px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(211, 84, 0, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: inherit;
      letter-spacing: 0.3px;
      position: relative;
      z-index: 2;
    `;
    button.onmouseenter = () => {
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 12px 40px rgba(211, 84, 0, 0.5)';
    };
    button.onmouseleave = () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 8px 30px rgba(211, 84, 0, 0.4)';
    };
    button.onclick = toggleChat;

    // Status dot
    statusDot = document.createElement('span');
    statusDot.style.cssText = `
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4CAF50;
      margin-right: 4px;
      animation: pulse-dot 2s ease-in-out infinite;
    `;
    button.prepend(statusDot);

    // ---- CHAT WINDOW ----
    chatWindow = document.createElement('div');
    chatWindow.id = 'cherry-chat-window';
    chatWindow.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 520px;
      background: ${CONFIG.colors.bgDark};
      border-radius: 16px;
      border: 1px solid ${CONFIG.colors.border};
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
      display: none;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: bottom right;
    `;

    // ---- HEADER ----
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 16px 20px;
      background: ${CONFIG.colors.bgCard};
      border-bottom: 1px solid ${CONFIG.colors.border};
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    `;
    header.innerHTML = `
      <span style="display:flex;align-items:center;gap:10px;font-weight:600;font-size:16px;color:${CONFIG.colors.textPrimary};">
        Cherry 🍒
        <span style="font-size:11px;font-weight:400;color:${CONFIG.colors.textSecondary};background:${CONFIG.colors.bgInput};padding:2px 10px;border-radius:12px;">AI</span>
      </span>
      <div style="display:flex;gap:8px;">
        <button id="cherry-clear-btn" style="background:transparent;border:none;color:${CONFIG.colors.textSecondary};cursor:pointer;font-size:14px;padding:4px 8px;border-radius:6px;transition:all 0.2s;" onmouseenter="this.style.background='${CONFIG.colors.bgInput}'" onmouseleave="this.style.background='transparent'">⟳</button>
        <button id="cherry-close-btn" style="background:transparent;border:none;color:${CONFIG.colors.textSecondary};cursor:pointer;font-size:18px;padding:0 4px;transition:all 0.2s;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='${CONFIG.colors.textSecondary}'">✕</button>
      </div>
    `;
    chatWindow.appendChild(header);

    // ---- MESSAGES ----
    messagesContainer = document.createElement('div');
    messagesContainer.id = 'cherry-messages';
    messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    `;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = `
      background: ${CONFIG.colors.bgCard};
      color: ${CONFIG.colors.textSecondary};
      padding: 12px 16px;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      font-size: 14px;
      line-height: 1.6;
      max-width: 85%;
      align-self: flex-start;
      border: 1px solid ${CONFIG.colors.border};
    `;
    welcomeMsg.innerHTML = `👋 Hey! I'm <strong style="color:${CONFIG.colors.textPrimary};">Cherry 🍒</strong>, your flotation chemistry assistant. Ask me about minerals, collectors, or surface chemistry!`;
    messagesContainer.appendChild(welcomeMsg);
    chatWindow.appendChild(messagesContainer);

    // ---- INPUT AREA ----
    const inputArea = document.createElement('div');
    inputArea.style.cssText = `
      padding: 12px 16px;
      background: ${CONFIG.colors.bgCard};
      border-top: 1px solid ${CONFIG.colors.border};
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    `;

    inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Ask Cherry about flotation...';
    inputField.style.cssText = `
      flex: 1;
      background: ${CONFIG.colors.bgInput};
      border: 1px solid ${CONFIG.colors.border};
      border-radius: 10px;
      padding: 10px 14px;
      color: ${CONFIG.colors.textPrimary};
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    `;
    inputField.onfocus = () => { inputField.style.borderColor = CONFIG.colors.primary; };
    inputField.onblur = () => { inputField.style.borderColor = CONFIG.colors.border; };
    inputField.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    sendBtn = document.createElement('button');
    sendBtn.textContent = 'Send';
    sendBtn.style.cssText = `
      background: ${CONFIG.colors.primary};
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    `;
    sendBtn.onmouseenter = () => { sendBtn.style.background = CONFIG.colors.primaryHover; };
    sendBtn.onmouseleave = () => { sendBtn.style.background = CONFIG.colors.primary; };
    sendBtn.onclick = sendMessage;

    inputArea.appendChild(inputField);
    inputArea.appendChild(sendBtn);
    chatWindow.appendChild(inputArea);

    // ---- ANIMATE IN ----
    container.appendChild(button);
    container.appendChild(chatWindow);
    document.body.appendChild(container);

    // ---- EVENT DELEGATION ----
    document.getElementById('cherry-close-btn').addEventListener('click', closeChat);
    document.getElementById('cherry-clear-btn').addEventListener('click', clearChat);

    // ---- INJECT STYLES ----
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }
      #cherry-messages::-webkit-scrollbar {
        width: 4px;
      }
      #cherry-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      #cherry-messages::-webkit-scrollbar-thumb {
        background: ${CONFIG.colors.border};
        border-radius: 4px;
      }
      .cherry-typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        background: ${CONFIG.colors.bgCard};
        border-radius: 12px;
        border-bottom-left-radius: 4px;
        border: 1px solid ${CONFIG.colors.border};
        max-width: 60px;
        align-self: flex-start;
      }
      .cherry-typing-indicator span {
        width: 8px;
        height: 8px;
        background: ${CONFIG.colors.textSecondary};
        border-radius: 50%;
        display: inline-block;
        animation: typing-bounce 1.4s ease-in-out infinite;
      }
      .cherry-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .cherry-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-8px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- TOGGLE / OPEN / CLOSE ----------
  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    chatWindow.style.display = 'flex';
    chatWindow.style.animation = 'none';
    setTimeout(() => {
      chatWindow.style.transform = 'scale(1)';
    }, 10);
    button.style.opacity = '0.8';
    inputField.focus();
  }

  function closeChat() {
    isOpen = false;
    chatWindow.style.display = 'none';
    button.style.opacity = '1';
  }

  // ---------- SEND MESSAGE ----------
  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message || isProcessing) return;

    // Disable input
    isProcessing = true;
    inputField.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    // Add user message
    addMessage('user', message);
    chatHistory.push({ role: 'user', content: message });
    inputField.value = '';

    // Show typing indicator
    const typingEl = showTyping();

    try {
        const response = await fetch(CONFIG.apiUrl + '?t=' + Date.now(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: chatHistory.slice(0, -1)
        })
      });

      typingEl.remove();

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Sorry, I got an empty response.';

      addMessage('bot', reply);
      chatHistory.push({ role: 'assistant', content: reply });

    } catch (error) {
      typingEl.remove();
      addMessage('bot', `⚠️ Sorry, I'm having trouble connecting. Please try again later. (${error.message})`);
    }

    isProcessing = false;
    inputField.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send';
    inputField.focus();
  }

  // ---------- ADD MESSAGE ----------
  function addMessage(role, content) {
    const div = document.createElement('div');
    const isUser = role === 'user';
    div.style.cssText = `
      background: ${isUser ? CONFIG.colors.primary : CONFIG.colors.bgCard};
      color: ${isUser ? '#fff' : CONFIG.colors.textSecondary};
      padding: 12px 16px;
      border-radius: 12px;
      ${isUser ? 'border-bottom-right-radius: 4px;' : 'border-bottom-left-radius: 4px;'}
      font-size: 14px;
      line-height: 1.7;
      max-width: 85%;
      align-self: ${isUser ? 'flex-end' : 'flex-start'};
      border: ${isUser ? 'none' : `1px solid ${CONFIG.colors.border}`};
      white-space: pre-wrap;
      word-wrap: break-word;
    `;

    let formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:monospace;">$1</code>');

    div.innerHTML = formattedContent;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // ---------- TYPING INDICATOR ----------
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'cherry-typing-indicator';
    div.innerHTML = `<span></span><span></span><span></span>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div;
  }

  // ---------- CLEAR CHAT ----------
  function clearChat() {
    const messages = messagesContainer.querySelectorAll('div');
    messages.forEach((msg, index) => {
      if (index > 0) msg.remove();
    });
    chatHistory = [];
    const firstMsg = messagesContainer.querySelector('div');
    if (!firstMsg || !firstMsg.innerHTML.includes('Cherry')) {
      const welcome = document.createElement('div');
      welcome.style.cssText = `
        background: ${CONFIG.colors.bgCard};
        color: ${CONFIG.colors.textSecondary};
        padding: 12px 16px;
        border-radius: 12px;
        border-bottom-left-radius: 4px;
        font-size: 14px;
        line-height: 1.6;
        max-width: 85%;
        align-self: flex-start;
        border: 1px solid ${CONFIG.colors.border};
      `;
      welcome.innerHTML = `👋 Hey! I'm <strong style="color:${CONFIG.colors.textPrimary};">Cherry 🍒</strong>, your flotation chemistry assistant. Ask me about minerals, collectors, or surface chemistry!`;
      messagesContainer.prepend(welcome);
    }
  }

  // ---------- INIT ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
