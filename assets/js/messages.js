<<<<<<< HEAD
=======
/**
 * BuildSpace — Messages Page
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
const MessagesPage = {
    activeConversation: null,
    pollTimer: null,

    async render(userId = null) {
        if (!Auth.requireAuth()) return;
<<<<<<< HEAD

=======
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        const content = document.getElementById('page-content');
        content.innerHTML = Components.loadingSkeletons(1);

        try {
            const data = await API.messages.conversations();
<<<<<<< HEAD

=======
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            content.innerHTML = `
                <div class="messages-container">
                    <div class="conversations-panel" id="conversations-panel">
                        <div class="conversations-header">
                            <h2>Messages</h2>
                        </div>
                        <div class="conversations-list" id="conversations-list">
<<<<<<< HEAD
                            ${data.conversations.length > 0 ?
=======
                            ${data.conversations.length > 0 ? 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                                data.conversations.map(c => this.conversationItem(c)).join('') :
                                `<div class="empty-state" style="padding:40px 20px">
                                    <i data-lucide="message-circle" style="width:40px;height:40px;opacity:0.3;margin:0 auto 12px;display:block"></i>
                                    <p style="color:var(--text-tertiary);font-size:0.85rem">No conversations yet.<br>Visit a profile to start chatting!</p>
                                </div>`
                            }
                        </div>
                    </div>
                    <div class="chat-panel" id="chat-panel">
                        ${userId ? '' : `
                            <div class="chat-empty">
                                <i data-lucide="message-square"></i>
                                <p>Select a conversation or visit a developer's profile to start chatting</p>
                            </div>
                        `}
                    </div>
                </div>
            `;
            lucide.createIcons();

            if (userId) {
                this.openConversation(userId);
            }
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Error', error.message);
            lucide.createIcons();
        }
    },

    conversationItem(conv) {
        const isActive = this.activeConversation == conv.other_user_id;
        const isSent = conv.last_sender_id == Auth.currentUser.id;
        return `
            <div class="conversation-item ${isActive ? 'active' : ''}" onclick="MessagesPage.openConversation(${conv.other_user_id})">
                <div class="conversation-avatar">
                    ${Components.avatar(conv, 44)}
                    ${conv.is_online ? '<div class="online-dot"></div>' : ''}
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">
                        <span>${Utils.escapeHtml(conv.full_name)}</span>
                        <span class="conversation-time">${Utils.timeAgo(conv.last_message_at)}</span>
                    </div>
                    <div class="conversation-preview">
                        ${isSent ? 'You: ' : ''}${Utils.escapeHtml(Utils.truncate(conv.last_message, 40))}
                    </div>
                </div>
                ${conv.unread_count > 0 ? `<span class="conversation-unread">${conv.unread_count}</span>` : ''}
            </div>
        `;
    },

    async openConversation(userId) {
        this.activeConversation = userId;
        this.stopPolling();
<<<<<<< HEAD

=======
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        const chatPanel = document.getElementById('chat-panel');
        chatPanel.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;flex:1;color:var(--text-tertiary)">Loading...</div>';

        try {
            const data = await API.messages.getMessages(userId);
            const other = data.other_user;

            chatPanel.innerHTML = `
                <div class="chat-header">
                    <button class="btn-icon" style="display:none" id="chat-back-btn" onclick="MessagesPage.showConversations()">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <div class="conversation-avatar" style="width:40px;height:40px;cursor:pointer" onclick="App.navigate('/profile/${other.username}')">
                        ${Components.avatar(other, 40)}
                        ${other.is_online ? '<div class="online-dot"></div>' : ''}
                    </div>
                    <div class="chat-header-info">
                        <h3 style="cursor:pointer" onclick="App.navigate('/profile/${other.username}')">${Utils.escapeHtml(other.full_name)}</h3>
                        <span class="chat-header-status">${other.is_online ? '● Online' : 'Offline'}</span>
                    </div>
                </div>
                <div class="chat-messages" id="chat-messages">
<<<<<<< HEAD
                    ${data.messages.length > 0 ?
=======
                    ${data.messages.length > 0 ? 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                        data.messages.map(m => this.messageBubble(m)).join('') :
                        `<div class="chat-empty">
                            <i data-lucide="message-square"></i>
                            <p>Start a conversation with ${Utils.escapeHtml(other.full_name)}</p>
                        </div>`
                    }
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Type a message..." autocomplete="off">
                    <button class="chat-send-btn" id="chat-send-btn" onclick="MessagesPage.sendMessage()">
                        <i data-lucide="send"></i>
                    </button>
                </div>
            `;
            lucide.createIcons();

<<<<<<< HEAD
            const messagesEl = document.getElementById('chat-messages');
            messagesEl.scrollTop = messagesEl.scrollHeight;

=======
            // Scroll to bottom
            const messagesEl = document.getElementById('chat-messages');
            messagesEl.scrollTop = messagesEl.scrollHeight;

            // Enter to send
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            document.getElementById('chat-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });

<<<<<<< HEAD
=======
            // Highlight active conversation
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
            const convItems = document.querySelectorAll('.conversation-item');
            convItems.forEach(el => {
                if (el.onclick && el.onclick.toString().includes(userId)) {
                    el.classList.add('active');
                }
            });

<<<<<<< HEAD
=======
            // Mobile: show chat panel
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            if (window.innerWidth <= 900) {
                document.getElementById('conversations-panel').classList.add('hidden-mobile');
                document.getElementById('chat-back-btn').style.display = 'flex';
            }

<<<<<<< HEAD
            this.startPolling(userId);

=======
            // Start polling for new messages
            this.startPolling(userId);

            // Update message badge
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            NotificationsModule.poll();
        } catch (error) {
            chatPanel.innerHTML = `<div class="chat-empty"><p>Error: ${error.message}</p></div>`;
        }
    },

    messageBubble(msg) {
        const isSent = msg.sender_id == Auth.currentUser.id;
        return `
            <div class="chat-message ${isSent ? 'sent' : 'received'}">
                <div>
                    <div class="chat-bubble">${Utils.escapeHtml(msg.content)}</div>
                    <div class="chat-time">${Utils.timeAgo(msg.created_at)}</div>
                </div>
            </div>
        `;
    },

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message || !this.activeConversation) return;

        input.value = '';

        try {
            await API.messages.send({
                receiver_id: this.activeConversation,
                content: message
            });

<<<<<<< HEAD
            const messagesEl = document.getElementById('chat-messages');
            const emptyState = messagesEl.querySelector('.chat-empty');
            if (emptyState) emptyState.remove();

=======
            // Append message to UI immediately
            const messagesEl = document.getElementById('chat-messages');
            // Remove empty state if present
            const emptyState = messagesEl.querySelector('.chat-empty');
            if (emptyState) emptyState.remove();
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            messagesEl.insertAdjacentHTML('beforeend', this.messageBubble({
                sender_id: Auth.currentUser.id,
                content: message,
                created_at: new Date().toISOString()
            }));
            lucide.createIcons();
            messagesEl.scrollTop = messagesEl.scrollHeight;
        } catch (error) {
            Toast.error(error.message);
            input.value = message;
        }
    },

    showConversations() {
        document.getElementById('conversations-panel').classList.remove('hidden-mobile');
        document.getElementById('chat-panel').innerHTML = `
            <div class="chat-empty">
                <i data-lucide="message-square"></i>
                <p>Select a conversation</p>
            </div>
        `;
        lucide.createIcons();
        this.activeConversation = null;
        this.stopPolling();
    },

    startPolling(userId) {
        this.pollTimer = setInterval(async () => {
            if (this.activeConversation !== userId) return;
            try {
                const data = await API.messages.getMessages(userId);
                const messagesEl = document.getElementById('chat-messages');
                if (messagesEl && data.messages.length > 0) {
                    const currentCount = messagesEl.querySelectorAll('.chat-message').length;
                    if (data.messages.length > currentCount) {
<<<<<<< HEAD
=======
                        // New messages received
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                        const newMsgs = data.messages.slice(currentCount);
                        const emptyState = messagesEl.querySelector('.chat-empty');
                        if (emptyState) emptyState.remove();
                        newMsgs.forEach(m => {
                            messagesEl.insertAdjacentHTML('beforeend', this.messageBubble(m));
                        });
                        lucide.createIcons();
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    }
                }
            } catch (e) {}
        }, 5000);
    },

    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
};
