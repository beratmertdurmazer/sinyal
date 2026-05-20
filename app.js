/* app.js - Sinyal Pitch & Interactive Simulation Engine */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- MOCK DATABASE STATE ---
  const state = {
    currentUser: {
      activePlate: '34XYZ99',
      myPlates: ['34XYZ99', '06BMW10']
    },
    viewingGaragePlate: '34XYZ99',
    profiles: {
      '34XYZ99': { driver: 'Ahmet Y.', score: 780, avatar: 'A', followers: 340, following: 185, car: 'BMW M3 Sedan', isMe: true },
      '06BMW10': { driver: 'Burak K.', score: 920, avatar: 'B', followers: 512, following: 220, car: 'Audi A4 Avant', isMe: true },
      '34ABC123': { driver: 'Mehmet S.', score: 450, avatar: 'M', followers: 120, following: 95, car: 'Volkswagen Golf', isMe: false, followingState: false },
      '34XYZ88': { driver: 'Sürücü H.', score: 320, avatar: 'S', followers: 85, following: 40, car: 'Renault Clio', isMe: false, followingState: false },
      '34CAN01': { driver: 'Caner D.', score: 1100, avatar: 'C', followers: 890, following: 310, car: 'BMW M4 Competition', isMe: false, followingState: false },
      '35DEF456': { driver: 'Ayşe K.', score: 580, avatar: 'A', followers: 230, following: 150, car: 'Fiat 500', isMe: false, followingState: false }
    },
    signals: [
      {
        id: 1,
        author: 'Mehmet S.',
        plate: '34ABC123',
        verified: true,
        category: 'kaza',
        categoryLabel: '🚨 Kaza / Yol',
        text: 'FSM Köprüsü sağ şerit kaza. Trafik neredeyse durma noktasında, yola çıkacaklar dikkat!',
        time: '5 dk önce',
        likes: 12,
        comments: 3,
        location: 'FSM Köprüsü'
      },
      {
        id: 2,
        author: 'Sürücü',
        plate: '34XYZ88',
        verified: false,
        category: 'park',
        categoryLabel: '⚠️ Hatalı Park',
        text: '34 XYZ 88, arabanın el freni çekilmemiş, hafiften kayıyor! Lastiğin arkasına taş koydum ama sahibi görse iyi olur.',
        time: '14 dk önce',
        likes: 24,
        comments: 1,
        location: 'Ataşehir'
      },
      {
        id: 3,
        author: 'Caner D.',
        plate: '34CAN01',
        verified: true,
        category: 'kahve',
        categoryLabel: '☕ Kahve / Buluşma',
        text: 'Cadde Kahve Dünyası önündeyim. Arabasını seven, muhabbet etmek isteyen sinyal çaksın gelsin.',
        time: '45 dk önce',
        likes: 8,
        comments: 4,
        location: 'Caddebostan'
      },
      {
        id: 4,
        author: 'Ayşe K.',
        plate: '35DEF456',
        verified: false,
        category: 'destek',
        categoryLabel: '🔧 Destek / İstek',
        text: 'Akü bitti yolda kaldım, Beşiktaş sahilde takviye kablosu olan bir kahraman var mı?',
        time: '1 saat önce',
        likes: 15,
        comments: 6,
        location: 'Beşiktaş Sahil'
      }
    ],
    chats: {
      '06BMW10': {
        driver: 'Burak K.',
        plate: '06BMW10',
        messages: [
          { sender: 'received', text: 'Selamlar, bagaj kapama uyarısı için çok sağ olun. Arkada duran valiz düşmek üzereymiş son anda kurtardık! 🤝' },
          { sender: 'sent', text: 'Rica ederim ne demek, yolda yardımlaşmak şart! Kazasız belasız sürüşler.' }
        ],
        unread: 0,
        type: 'active'
      },
      '34ABC123': {
        driver: 'Mehmet S.',
        plate: '34ABC123',
        messages: [
          { sender: 'received', text: 'Selam, FSM Köprüsündeki kazanın tam konumunu görebiliyor musunuz?' },
          { sender: 'sent', text: 'Evet, haritada işaretledim. Orta şeritte duruyorlar.' }
        ],
        unread: 1,
        type: 'active'
      }
    },
    mapHazards: [
      { id: 'h1', type: 'radar', title: 'Radar Tespit', desc: 'Otoban 120km sınırı radar kontrolü var.', x: 35, y: 30, votes: 4, label: 'Radar' },
      { id: 'h2', type: 'cevirme', title: 'Polis Çevirme', desc: 'Cadde yönü asayiş kontrolü yapılıyor.', x: 65, y: 55, votes: 12, label: 'Çevirme' },
      { id: 'h3', type: 'kaza', title: 'Hasarlı Kaza', desc: 'E5 sol şerit zincirleme kaza.', x: 45, y: 75, votes: 8, label: 'Kaza' }
    ],
    carHistories: {
      '06BMW10': [
        { date: '21 Mayıs 2026', title: 'Hatalı Park Sinyali', desc: '34XYZ99 tarafından bagaj kapağı açık uyarısı aldı.' },
        { date: '15 Mayıs 2026', title: 'Kurumsal Bakım', desc: 'X Tuning servisinde "Periyodik Bakım" tamamlandı.' },
        { date: '02 Mayıs 2026', title: 'Sarı Sinyal Doğrulama', desc: 'Haritada radar uyarısını doğrulayarak +5 Sürücü Skoru kazandı.' },
        { date: '10 Nisan 2026', title: 'Topluluk Buluşması', desc: 'Caddebostan Tuning Buluşması\'na katılım sağladı.' }
      ],
      '34XYZ99': [
        { date: '21 Mayıs 2026', title: 'Sinyal Çakıldı', desc: '06BMW10 plakalı araca bagaj uyarısı sinyali gönderdi.' },
        { date: '18 Mayıs 2026', title: 'Sürücü Skoru Ödülü', desc: '750 Skor barajını aşarak Köpük Otomotiv\'den %20 indirim kuponu kazandı.' },
        { date: '01 Mayıs 2026', title: 'Garaj Doğrulama', desc: 'Plaka ruhsat e-devlet entegrasyonuyla onaylandı.' }
      ]
    }
  };

  // --- HTML ELEMENT REFERENCES ---
  const elements = {
    // Pitch Site Interactions
    header: document.getElementById('header'),
    navLinks: document.querySelectorAll('.nav-link'),
    scenarioSteps: document.querySelectorAll('.scenario-step'),
    investorForm: document.getElementById('investorForm'),
    formSuccessMsg: document.getElementById('formSuccessMsg'),
    
    // App Base & Router
    appTime: document.getElementById('appTime'),
    appBody: document.getElementById('appBody'),
    appSearchInput: document.getElementById('appSearchInput'),
    appSearchHistoryBtn: document.getElementById('appSearchHistoryBtn'),
    appNotificationBtn: document.getElementById('appNotificationBtn'),
    appNotifBadge: document.getElementById('appNotifBadge'),
    appDmBadge: document.getElementById('appDmBadge'),
    appLogoBtn: document.getElementById('appLogoBtn'),
    tabs: document.querySelectorAll('.nav-tab'),
    views: document.querySelectorAll('.app-view'),
    
    // Feed Elements
    viewFeed: document.getElementById('viewFeed'),
    feedListContainer: document.getElementById('feedListContainer'),
    composerText: document.getElementById('composerText'),
    composerPlateTag: document.getElementById('composerPlateTag'),
    composerSubmitBtn: document.getElementById('composerSubmitBtn'),
    composerCategoryList: document.getElementById('composerCategoryList'),
    
    // Whisper DM Elements
    viewWhisper: document.getElementById('viewWhisper'),
    dmInboxListContainer: document.getElementById('dmInboxListContainer'),
    chatDetailView: document.getElementById('chatDetailView'),
    chatActivePlate: document.getElementById('chatActivePlate'),
    chatActiveDriver: document.getElementById('chatActiveDriver'),
    chatMessagesContainer: document.getElementById('chatMessagesContainer'),
    chatInputField: document.getElementById('chatInputField'),
    chatSendBtn: document.getElementById('chatSendBtn'),
    chatBackBtn: document.getElementById('chatBackBtn'),
    
    // Map / Sarı Sinyal Elements
    viewMap: document.getElementById('viewMap'),
    mapContainer: document.getElementById('mapContainer'),
    mapMarkersContainer: document.getElementById('mapMarkersContainer'),
    mapReportFab: document.getElementById('mapReportFab'),
    mapReportMenu: document.getElementById('mapReportMenu'),
    mapOverlayCard: document.getElementById('mapOverlayCard'),
    mapOverlayTitle: document.getElementById('mapOverlayTitle'),
    mapOverlayBody: document.getElementById('mapOverlayBody'),
    mapOverlayConfirmBtn: document.getElementById('mapOverlayConfirmBtn'),
    mapOverlayCloseBtn: document.getElementById('mapOverlayCloseBtn'),
    
    // Market Elements
    viewMarket: document.getElementById('viewMarket'),
    btnTabServices: document.getElementById('btnTabServices'),
    btnTabCarHistory: document.getElementById('btnTabCarHistory'),
    btnTabPlates: document.getElementById('btnTabPlates'),
    paneServices: document.getElementById('paneServices'),
    paneCarHistory: document.getElementById('paneCarHistory'),
    panePlates: document.getElementById('panePlates'),
    historyPlateQuery: document.getElementById('historyPlateQuery'),
    historyCardPlaceholder: document.getElementById('historyCardPlaceholder'),
    historyCardResults: document.getElementById('historyCardResults'),
    historyResultPlate: document.getElementById('historyResultPlate'),
    historyResultTimeline: document.getElementById('historyResultTimeline'),
    serviceBookingModal: document.getElementById('serviceBookingModal'),
    bookingShopName: document.getElementById('bookingShopName'),
    bookingPlateSelect: document.getElementById('bookingPlateSelect'),
    bookingServiceType: document.getElementById('bookingServiceType'),
    bookingDateTime: document.getElementById('bookingDateTime'),
    bookingConfirmBtn: document.getElementById('bookingConfirmBtn'),
    bookingCancelBtn: document.getElementById('bookingCancelBtn'),
    
    // Garage Elements
    viewGarage: document.getElementById('viewGarage'),
    garageActivePlateText: document.getElementById('garageActivePlateText'),
    garagePlateSelectorBtn: document.getElementById('garagePlateSelectorBtn'),
    garagePlateDropdown: document.getElementById('garagePlateDropdown'),
    garageAvatarLetter: document.getElementById('garageAvatarLetter'),
    garageDriverName: document.getElementById('garageDriverName'),
    garageFollowerCount: document.getElementById('garageFollowerCount'),
    garageFollowingCount: document.getElementById('garageFollowingCount'),
    garageKarmaScore: document.getElementById('garageKarmaScore'),
    garageKarmaFill: document.getElementById('garageKarmaFill'),
    garageActionButtons: document.getElementById('garageActionButtons'),
    garageFollowBtn: document.getElementById('garageFollowBtn'),
    garageMessageBtn: document.getElementById('garageMessageBtn'),
    garageBottomContainer: document.getElementById('garageBottomContainer'),
    
    // Photo Composer Elements
    composerPhotoBtn: document.getElementById('composerPhotoBtn'),
    composerPhotoDrawer: document.getElementById('composerPhotoDrawer'),
    composerPhotoCancel: document.getElementById('composerPhotoCancel')
  };

  // --- TIME CLOCK INITIALIZATION ---
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    if (elements.appTime) {
      elements.appTime.textContent = `${hours}:${minutes}`;
    }
  }
  updateClock();
  setInterval(updateClock, 60000);

  // --- ROUTER SYSTEM ---
  function switchAppView(viewName, overridePlate) {
    elements.views.forEach(view => view.classList.remove('active'));
    elements.tabs.forEach(tab => tab.classList.remove('active'));
    
    // Close overlay windows
    if (elements.chatDetailView) elements.chatDetailView.classList.remove('active');
    if (elements.serviceBookingModal) elements.serviceBookingModal.classList.remove('active');
    if (elements.mapReportMenu) elements.mapReportMenu.classList.remove('active');
    if (elements.mapOverlayCard) elements.mapOverlayCard.classList.remove('active');
    
    const targetView = document.getElementById(`view${capitalizeFirst(viewName)}`);
    const targetTab = Array.from(elements.tabs).find(tab => tab.dataset.view === viewName);
    
    if (targetView) targetView.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
    
    if (viewName === 'garage') {
      state.viewingGaragePlate = overridePlate || state.currentUser.activePlate;
    }
    
    // Render view-specific data
    if (viewName === 'feed') renderFeed();
    if (viewName === 'whisper') renderDMInbox();
    if (viewName === 'map') renderMap();
    if (viewName === 'garage') renderGarage();
  }

  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchAppView(tab.dataset.view);
    });
  });

  if (elements.appLogoBtn) {
    elements.appLogoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchAppView('feed');
    });
  }

  // --- FEED CONTROLLER ("Sinyal Çak") ---
  let selectedComposerPhoto = null;
  let selectedComposerCategory = 'kaza';

  // Category select inside composer
  const composerPills = elements.composerCategoryList?.querySelectorAll('.composer-pill');
  composerPills?.forEach(pill => {
    pill.addEventListener('click', () => {
      composerPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedComposerCategory = pill.dataset.category;
    });
  });

  // Photo button click toggles drawer
  if (elements.composerPhotoBtn) {
    elements.composerPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (elements.composerPhotoDrawer) {
        const isHidden = elements.composerPhotoDrawer.style.display === 'none';
        elements.composerPhotoDrawer.style.display = isHidden ? 'flex' : 'none';
      }
    });
  }

  // Handle photo option clicks
  const photoOptions = document.querySelectorAll('.composer-photo-option');
  photoOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      // Remove active borders
      photoOptions.forEach(o => o.style.borderColor = 'transparent');
      // Highlight selected
      opt.style.borderColor = 'var(--app-primary)';
      const img = opt.querySelector('img');
      selectedComposerPhoto = img ? img.src : null;
    });
  });

  // Handle photo cancel click
  if (elements.composerPhotoCancel) {
    elements.composerPhotoCancel.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedComposerPhoto = null;
      photoOptions.forEach(o => o.style.borderColor = 'transparent');
      if (elements.composerPhotoDrawer) {
        elements.composerPhotoDrawer.style.display = 'none';
      }
    });
  }

  // Render social feed
  function renderFeed(filterText = '') {
    if (!elements.feedListContainer) return;
    elements.feedListContainer.innerHTML = '';
    
    let filteredSignals = state.signals;
    if (filterText.trim() !== '') {
      const query = filterText.toLowerCase().replace(/\s+/g, '');
      filteredSignals = state.signals.filter(sig => 
        sig.plate.toLowerCase().replace(/\s+/g, '').includes(query) ||
        sig.text.toLowerCase().includes(query)
      );
    }

    if (filteredSignals.length === 0) {
      elements.feedListContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--app-text-muted); font-size: 0.85rem;">
          Herhangi bir sinyal bulunamadı.
        </div>
      `;
      return;
    }

    filteredSignals.forEach(signal => {
      let imageHtml = '';
      if (signal.imageSrc) {
        imageHtml = `
          <div class="signal-image" style="margin-top: 10px; border-radius: 8px; overflow: hidden; max-height: 180px; width: 100%;">
            <img src="${signal.imageSrc}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `;
      }

      const card = document.createElement('div');
      card.className = `signal-card ${signal.category}`;
      card.innerHTML = `
        <div class="signal-card-header">
          <div class="signal-author">
            <div class="signal-avatar ${signal.verified !== false ? 'verified' : ''}">
              ${signal.author.charAt(0)}
            </div>
            <div class="signal-author-info">
              <span class="signal-author-name">${signal.author}</span>
              <span class="signal-plate-pill ${signal.id === 99 ? 'tagged' : ''}">
                ${formatPlate(signal.plate)}
              </span>
            </div>
          </div>
          <span class="signal-meta-badge badge-${signal.category}">${getCategoryBadgeText(signal.category)}</span>
        </div>
        <div class="signal-content">
          ${signal.text}
          ${imageHtml}
        </div>
        <div class="signal-footer">
          <span>📍 ${signal.location || 'Bilinmiyor'} &bull; ${signal.time}</span>
          <div class="signal-actions">
            <button class="signal-action like-btn" data-id="${signal.id}">
              ❤️ <span>${signal.likes}</span>
            </button>
            <button class="signal-action reply-trigger-btn" data-plate="${signal.plate}">
              💬 <span>Fısılda</span>
            </button>
          </div>
        </div>
      `;

      // View profile on clicking avatar, name, or plate
      const authorElements = card.querySelectorAll('.signal-avatar, .signal-author-name, .signal-plate-pill');
      authorElements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          switchAppView('garage', signal.plate);
        });
      });

      // Handle inline plate link clicks
      card.querySelectorAll('.inline-plate-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetPlate = link.dataset.plate;
          const cleanPlate = targetPlate.toUpperCase().replace(/\s+/g, '');
          if (state.profiles[cleanPlate]) {
            switchAppView('garage', cleanPlate);
          } else {
            alert(`Plaka ${targetPlate} henüz Sinyal platformuna katılmamış.`);
          }
        });
      });

      // Handle like clicks
      card.querySelector('.like-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        signal.likes++;
        card.querySelector('.like-btn span').textContent = signal.likes;
      });

      // Handle reply clicks (Go directly to Whisper with this plate)
      card.querySelector('.reply-trigger-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openChat(signal.plate, signal.author);
      });

      elements.feedListContainer.appendChild(card);
    });
  }

  // Posting a new signal
  if (elements.composerSubmitBtn) {
    elements.composerSubmitBtn.addEventListener('click', () => {
      const text = elements.composerText.value.trim();
      const plateTag = elements.composerPlateTag.value.trim().toUpperCase();

      if (text === '') return;

      let formattedText = text;
      // If plate is tagged, format it dynamically as a hyperlink in the post content
      if (plateTag !== '') {
        formattedText = `<a href="#" class="inline-plate-link" data-plate="${plateTag}">@${plateTag}</a>: ${text}`;
      }

      const newSignal = {
        id: Date.now(),
        author: state.profiles[state.currentUser.activePlate].driver,
        plate: state.currentUser.activePlate,
        verified: true,
        category: selectedComposerCategory,
        text: formattedText,
        imageSrc: selectedComposerPhoto,
        time: 'Şimdi',
        likes: 0,
        comments: 0,
        location: 'Caddebostan'
      };

      state.signals.unshift(newSignal);
      
      // Update history for current user
      if (!state.carHistories[state.currentUser.activePlate]) {
        state.carHistories[state.currentUser.activePlate] = [];
      }
      state.carHistories[state.currentUser.activePlate].unshift({
        date: 'Bugün',
        title: 'Sinyal Çakıldı',
        desc: `${plateTag ? plateTag + ' uyarılı ' : ''}"${selectedComposerCategory}" sinyali gönderildi.`
      });

      // Award Karma Points for signal
      awardKarmaPoints(15);

      // Clear composer & image selection
      elements.composerText.value = '';
      elements.composerPlateTag.value = '';
      selectedComposerPhoto = null;
      document.querySelectorAll('.composer-photo-option').forEach(o => o.style.borderColor = 'transparent');
      if (elements.composerPhotoDrawer) {
        elements.composerPhotoDrawer.style.display = 'none';
      }
      
      // Flash feed view to show upload
      renderFeed();
      
      // Smooth scroll feed container
      elements.feedListContainer.scrollTop = 0;
    });
  }

  // App Search bar filtering
  if (elements.appSearchInput) {
    elements.appSearchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      // Only filter the feed
      switchAppView('feed');
      renderFeed(query);
    });
  }

  // --- WHISPER DM CONTROLLER ("Plakaya Fısılda") ---
  let activeChatPlate = '';

  function renderDMInbox() {
    if (!elements.dmInboxListContainer) return;
    elements.dmInboxListContainer.innerHTML = '';

    const chatKeys = Object.keys(state.chats);
    if (chatKeys.length === 0) {
      elements.dmInboxListContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--app-text-muted); font-size: 0.85rem;">
          Mesajlaşma bulunmuyor. Bir plakaya fısıldayarak sohbet başlatın!
        </div>
      `;
      return;
    }

    chatKeys.forEach(key => {
      const chat = state.chats[key];
      const lastMsg = chat.messages[chat.messages.length - 1];
      const item = document.createElement('div');
      item.className = 'dm-inbox-item';
      item.innerHTML = `
        <div class="dm-avatar">${chat.driver.charAt(0)}</div>
        <div class="dm-info">
          <div class="dm-header">
            <span class="dm-plate">${formatPlate(chat.plate)}</span>
            <span class="dm-time">13:42</span>
          </div>
          <div class="dm-last-msg">${lastMsg ? lastMsg.text : 'Fısıltı Talebi'}</div>
        </div>
        ${chat.unread > 0 ? `<div class="dm-badge">${chat.unread}</div>` : ''}
      `;

      item.addEventListener('click', () => {
        openChat(chat.plate, chat.driver);
      });

      elements.dmInboxListContainer.appendChild(item);
    });
  }

  function openChat(plate, driverName) {
    activeChatPlate = plate.toUpperCase();
    
    // Create new chat session if it doesn't exist
    if (!state.chats[activeChatPlate]) {
      state.chats[activeChatPlate] = {
        driver: driverName || 'Sürücü',
        plate: activeChatPlate,
        messages: [],
        unread: 0,
        type: 'request' // First message will be request
      };
    }

    state.chats[activeChatPlate].unread = 0;
    updateDmBadge();

    // Populate UI
    elements.chatActivePlate.textContent = formatPlate(activeChatPlate);
    elements.chatActiveDriver.textContent = state.chats[activeChatPlate].driver;
    
    renderChatMessages();
    
    switchAppView('whisper');
    elements.chatDetailView.classList.add('active');
  }

  function renderChatMessages() {
    if (!elements.chatMessagesContainer) return;
    elements.chatMessagesContainer.innerHTML = '';

    const chat = state.chats[activeChatPlate];
    
    // If chat is a request, show a safety barrier
    if (chat.type === 'request' && chat.messages.length === 0) {
      const notice = document.createElement('div');
      notice.className = 'chat-whisper-notice';
      notice.innerHTML = `
        <div>Bu plakaya ilk kez fısıldıyorsunuz. Tacizi önlemek için onaylanana kadar fısıltı talebi olarak iletilecektir.</div>
        <div class="chat-whisper-actions">
          <button class="whisper-accept-btn" id="btnAcceptWhisper">Talep Gönder</button>
        </div>
      `;
      elements.chatMessagesContainer.appendChild(notice);

      notice.querySelector('#btnAcceptWhisper').addEventListener('click', () => {
        chat.type = 'active';
        // Send a simulated start
        chat.messages.push({ sender: 'sent', text: 'Merhaba, aracınız hakkında yazıyorum.' });
        renderChatMessages();
        triggerMockReply();
      });
    }

    chat.messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble-container ${msg.sender}`;
      bubble.innerHTML = `
        <div class="chat-bubble">
          ${msg.text}
        </div>
      `;
      elements.chatMessagesContainer.appendChild(bubble);
    });

    elements.chatMessagesContainer.scrollTop = elements.chatMessagesContainer.scrollHeight;
  }

  // Close Chat details
  if (elements.chatBackBtn) {
    elements.chatBackBtn.addEventListener('click', () => {
      elements.chatDetailView.classList.remove('active');
      renderDMInbox();
    });
  }

  // Sending message
  function sendMessage() {
    const text = elements.chatInputField.value.trim();
    if (text === '') return;

    const chat = state.chats[activeChatPlate];
    chat.messages.push({ sender: 'sent', text: text });
    
    // If it was a request, upgrade it
    if (chat.type === 'request') {
      chat.type = 'active';
    }

    elements.chatInputField.value = '';
    renderChatMessages();

    // Trigger mock reply response after 1.5 seconds
    triggerMockReply();
  }

  if (elements.chatSendBtn) {
    elements.chatSendBtn.addEventListener('click', sendMessage);
  }
  if (elements.chatInputField) {
    elements.chatInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function triggerMockReply() {
    setTimeout(() => {
      if (!elements.chatDetailView.classList.contains('active') || activeChatPlate !== activeChatPlate) return;
      
      const chat = state.chats[activeChatPlate];
      const lastSentMsg = chat.messages[chat.messages.length - 1]?.text.toLowerCase();
      let replyText = 'Geri bildiriminiz için teşekkürler! Sinyal üzerinden yardımlaşmak harika. 🚗';

      if (lastSentMsg && lastSentMsg.includes('bagaj')) {
        replyText = 'Çok teşekkürler, büyük rezillikten kurtardınız! Sağ çekip kapattım şimdi. 🤝';
      } else if (lastSentMsg && (lastSentMsg.includes('far') || lastSentMsg.includes('açık'))) {
        replyText = 'Aa, farlar açık mı kalmış? Aküyü bitirmeden koşayım hemen. Harikasınız!';
      } else if (lastSentMsg && lastSentMsg.includes('jant')) {
        replyText = 'Jantlar 19 inç Vossen. Çok teşekkür ederim, daha iyileri sizin olsun!';
      } else if (lastSentMsg && lastSentMsg.includes('kahve')) {
        replyText = 'Geliyorum hemen, 5 dakikaya oradayım. Sinyal çakın!';
      }

      chat.messages.push({ sender: 'received', text: replyText });
      renderChatMessages();
      
      // Update badge/notifications
      awardKarmaPoints(5);
    }, 1500);
  }

  function updateDmBadge() {
    let unreadCount = 0;
    Object.keys(state.chats).forEach(k => {
      unreadCount += state.chats[k].unread;
    });
    if (elements.appDmBadge) {
      elements.appDmBadge.textContent = unreadCount;
      elements.appDmBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
  }

  // --- MAP / SARI SİNYAL CONTROLLER ---
  function renderMap() {
    if (!elements.mapMarkersContainer) return;
    elements.mapMarkersContainer.innerHTML = '';

    state.mapHazards.forEach(hazard => {
      const pin = document.createElement('div');
      pin.className = 'map-marker';
      pin.style.left = `${hazard.x}%`;
      pin.style.top = `${hazard.y}%`;
      
      let pinColor = 'var(--app-primary)';
      let icon = '';
      
      if (hazard.type === 'radar') { pinColor = '#a855f7'; icon = '🚨'; }
      if (hazard.type === 'cevirme') { pinColor = '#3b82f6'; icon = '👮'; }
      if (hazard.type === 'kaza') { pinColor = '#ef4444'; icon = '💥'; }
      if (hazard.type === 'trafik') { pinColor = '#f59e0b'; icon = '🚗'; }

      pin.style.setProperty('--pin-color', pinColor);
      pin.innerHTML = `
        <div class="marker-pin">
          <span style="font-size: 0.75rem; transform: rotate(45deg); display:block;">${icon}</span>
        </div>
        <div class="marker-label">${hazard.label}</div>
      `;

      pin.addEventListener('click', () => {
        openMapOverlay(hazard);
      });

      elements.mapMarkersContainer.appendChild(pin);
    });
  }

  let activeOverlayHazard = null;
  function openMapOverlay(hazard) {
    activeOverlayHazard = hazard;
    elements.mapOverlayTitle.textContent = hazard.title;
    elements.mapOverlayBody.textContent = `${hazard.desc} (${hazard.votes} sürücü doğruladı).`;
    elements.mapOverlayCard.classList.add('active');
  }

  // Confirm hazard (Hala Orada)
  if (elements.mapOverlayConfirmBtn) {
    elements.mapOverlayConfirmBtn.addEventListener('click', () => {
      if (!activeOverlayHazard) return;
      activeOverlayHazard.votes++;
      elements.mapOverlayBody.textContent = `${activeOverlayHazard.desc} (${activeOverlayHazard.votes} sürücü doğruladı).`;
      
      awardKarmaPoints(10);
      
      // Close overlay
      elements.mapOverlayCard.classList.remove('active');
    });
  }

  if (elements.mapOverlayCloseBtn) {
    elements.mapOverlayCloseBtn.addEventListener('click', () => {
      elements.mapOverlayCard.classList.remove('active');
    });
  }

  // Sarı Sinyal FAB & reporting
  if (elements.mapReportFab) {
    elements.mapReportFab.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.mapReportMenu.classList.toggle('active');
    });
  }

  // Hide report menu on click outside
  document.addEventListener('click', () => {
    if (elements.mapReportMenu) elements.mapReportMenu.classList.remove('active');
  });

  const reportItems = elements.mapReportMenu?.querySelectorAll('.map-report-item');
  reportItems?.forEach(item => {
    item.addEventListener('click', () => {
      const hazardType = item.dataset.hazard;
      let title = 'Radar';
      let label = 'Radar';
      
      if (hazardType === 'cevirme') { title = 'Polis Çevirme'; label = 'Çevirme'; }
      if (hazardType === 'kaza') { title = 'Kaza Bildirimi'; label = 'Kaza'; }
      if (hazardType === 'trafik') { title = 'Yoğun Trafik'; label = 'Trafik'; }

      // Place it at a random position inside the viewport
      const newHazard = {
        id: 'h' + Date.now(),
        type: hazardType,
        title: title,
        desc: 'Sürücü tarafından canlı olarak bildirildi.',
        x: Math.floor(Math.random() * 50) + 25,
        y: Math.floor(Math.random() * 50) + 20,
        votes: 1,
        label: label
      };

      state.mapHazards.push(newHazard);
      renderMap();
      
      // Push notifications inside app
      pushAppNotification(`Sarı Sinyal Bildirildi: ${title} haritada paylaşıldı! +20 Puan kazandınız.`);
      awardKarmaPoints(20);
    });
  });

  // --- MARKETPLACE & APPOINTMENTS CONTROLLER ---
  if (elements.btnTabServices) {
    elements.btnTabServices.addEventListener('click', () => {
      elements.btnTabServices.classList.add('active');
      elements.btnTabCarHistory.classList.remove('active');
      elements.btnTabPlates.classList.remove('active');
      elements.paneServices.classList.add('active');
      elements.paneCarHistory.classList.remove('active');
      elements.panePlates.classList.remove('active');
    });
  }
  if (elements.btnTabCarHistory) {
    elements.btnTabCarHistory.addEventListener('click', () => {
      elements.btnTabServices.classList.remove('active');
      elements.btnTabCarHistory.classList.add('active');
      elements.btnTabPlates.classList.remove('active');
      elements.paneServices.classList.remove('active');
      elements.paneCarHistory.classList.add('active');
      elements.panePlates.classList.remove('active');
    });
  }
  if (elements.btnTabPlates) {
    elements.btnTabPlates.addEventListener('click', () => {
      elements.btnTabServices.classList.remove('active');
      elements.btnTabCarHistory.classList.remove('active');
      elements.btnTabPlates.classList.add('active');
      elements.paneServices.classList.remove('active');
      elements.paneCarHistory.classList.remove('active');
      elements.panePlates.classList.add('active');
    });
  }

  // Booking appointments modal opening
  const serviceBookBtns = elements.paneServices?.querySelectorAll('.service-book-btn');
  serviceBookBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const shopName = btn.dataset.shop;
      if (elements.bookingShopName) {
        elements.bookingShopName.textContent = shopName;
      }

      // Dynamically update the service type dropdown depending on the brand
      if (elements.bookingServiceType) {
        elements.bookingServiceType.innerHTML = ''; // clear options
        
        let options = [];
        if (shopName === 'Shell') {
          options = [
            { value: 'Pratik Mobil Ödeme', text: 'Mobil Ödeme (Plaka ile %3 İndirimli)' },
            { value: 'Shell V-Power', text: 'Shell V-Power Premium Yakıt Alımı' },
            { value: 'Deli2go Kahve & Fırsatı', text: 'Deli2go Kahve & Fırsat Menüsü' }
          ];
        } else if (shopName === 'TÜVTÜRK') {
          options = [
            { value: 'Fenni Muayene', text: 'Araç Fenni Muayene Randevusu' },
            { value: 'Egzoz Emisyon Ölçümü', text: 'Egzoz Gazı Emisyon Ölçümü' },
            { value: 'Muayene Öncesi Check-Up', text: 'Muayene Öncesi Genel Check-Up' }
          ];
        } else if (shopName === 'Otokoç') {
          options = [
            { value: 'Periyodik Bakım', text: 'Periyodik Bakım & Filtre Seti' },
            { value: 'Mekanik Kontrol', text: 'Detaylı Mekanik Arıza Tespiti' },
            { value: 'Lastik Değişimi', text: 'Kış Lastiği Değişimi & Depolama' }
          ];
        } else {
          options = [
            { value: 'Periyodik Bakım', text: 'Periyodik Bakım' },
            { value: 'Detaylı Oto Yıkama', text: 'Detaylı Temizlik & Yıkama' },
            { value: 'Ekspertiz Hizmeti', text: 'Mobil Ekspertiz Hizmeti' }
          ];
        }
        
        options.forEach(opt => {
          const optionElement = document.createElement('option');
          optionElement.value = opt.value;
          optionElement.textContent = opt.text;
          elements.bookingServiceType.appendChild(optionElement);
        });
      }

      elements.serviceBookingModal.classList.add('active');
    });
  });

  if (elements.bookingCancelBtn) {
    elements.bookingCancelBtn.addEventListener('click', () => {
      elements.serviceBookingModal.classList.remove('active');
    });
  }

  if (elements.bookingConfirmBtn) {
    elements.bookingConfirmBtn.addEventListener('click', () => {
      const shop = elements.bookingShopName.textContent;
      const service = elements.bookingServiceType.value;
      const plate = elements.bookingPlateSelect.value;
      const datetime = new Date(elements.bookingDateTime.value);
      
      const formattedDate = datetime.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
      const formattedTime = datetime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      // Add to car history logs
      if (!state.carHistories[plate]) {
        state.carHistories[plate] = [];
      }
      state.carHistories[plate].unshift({
        date: formattedDate,
        title: 'Randevu Onaylandı',
        desc: `${shop} servisinde saat ${formattedTime}'de ${service} randevusu oluşturuldu.`
      });

      elements.serviceBookingModal.classList.remove('active');
      
      pushAppNotification(`Randevunuz Onaylandı! ${shop} - ${service} randevunuz oluşturuldu. Sürücü skorunuza +30 puan eklendi.`);
      awardKarmaPoints(30);
    });
  }

  // Car History Plaka Geçmişi Search inside Market tab
  if (elements.historyPlateQuery) {
    elements.historyPlateQuery.addEventListener('input', (e) => {
      const query = e.target.value.toUpperCase().replace(/\s+/g, '');
      if (query.trim() === '') {
        elements.historyCardPlaceholder.style.display = 'block';
        elements.historyCardResults.style.display = 'none';
        return;
      }

      elements.historyCardPlaceholder.style.display = 'none';
      elements.historyCardResults.style.display = 'block';
      elements.historyResultPlate.textContent = formatPlate(query);

      const historyTimeline = elements.historyResultTimeline;
      historyTimeline.innerHTML = '';

      // If we have history mock, show it. Otherwise show default clean record
      const logs = state.carHistories[query];
      if (logs && logs.length > 0) {
        logs.forEach(log => {
          const item = document.createElement('div');
          item.className = 'history-timeline-item';
          item.innerHTML = `
            <div class="history-item-date">${log.date}</div>
            <div class="history-item-title">${log.title}</div>
            <div class="history-item-desc">${log.desc}</div>
          `;
          historyTimeline.appendChild(item);
        });
      } else {
        historyTimeline.innerHTML = `
          <div style="font-size:0.75rem; color:var(--app-text-muted); padding: 1rem 0;">
            Bu plakaya ait sosyal veya servis geçmişi bulunmuyor. Temiz sürüş geçmişi! ✨
          </div>
        `;
      }
    });
  }

  // Plaka Pazarı placing bid
  const bidBtns = elements.panePlates?.querySelectorAll('.premium-plate-bid-btn');
  bidBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const plate = btn.dataset.plate;
      alert(`${plate} plakasına teklifiniz iletildi! Satış niyeti onaylandığında bildirim alacaksınız.`);
      awardKarmaPoints(5);
    });
  });

  // --- GARAGE CONTROLLER ("Garajım") ---
  function renderGarage() {
    const activePlate = state.viewingGaragePlate || state.currentUser.activePlate;
    const profile = state.profiles[activePlate] || state.profiles[state.currentUser.activePlate];
    
    if (elements.garageActivePlateText) elements.garageActivePlateText.textContent = formatPlate(activePlate);
    if (elements.garageAvatarLetter) elements.garageAvatarLetter.textContent = profile.avatar;
    if (elements.garageDriverName) elements.garageDriverName.textContent = profile.driver;
    if (elements.garageFollowerCount) elements.garageFollowerCount.textContent = profile.followers;
    if (elements.garageFollowingCount) elements.garageFollowingCount.textContent = profile.following;
    if (elements.garageKarmaScore) elements.garageKarmaScore.textContent = profile.score;
    
    // Set Karma Gauge
    if (elements.garageKarmaFill) {
      const maxKarma = 1200;
      const percentage = Math.min((profile.score / maxKarma) * 100, 100);
      elements.garageKarmaFill.style.width = `${percentage}%`;
    }

    // Toggle follow & message actions based on whether it is my profile or not
    if (profile.isMe) {
      if (elements.garageActionButtons) elements.garageActionButtons.style.display = 'none';
      if (elements.garagePlateSelectorBtn) elements.garagePlateSelectorBtn.style.pointerEvents = 'auto';
      if (elements.garagePlateDropdown) {
        // Re-populate dropdown with only my plates
        elements.garagePlateDropdown.innerHTML = '';
        state.currentUser.myPlates.forEach(plate => {
          const opt = document.createElement('div');
          opt.className = 'garage-plate-option';
          opt.dataset.plate = plate;
          opt.textContent = formatPlate(plate);
          opt.onclick = (e) => {
            e.stopPropagation();
            state.currentUser.activePlate = plate;
            state.viewingGaragePlate = plate;
            elements.garagePlateDropdown.classList.remove('active');
            renderGarage();
          };
          elements.garagePlateDropdown.appendChild(opt);
        });
      }
    } else {
      if (elements.garageActionButtons) {
        elements.garageActionButtons.style.display = 'flex';
        
        // Setup Follow Button state
        if (elements.garageFollowBtn) {
          if (profile.followingState) {
            elements.garageFollowBtn.textContent = 'Takip Ediliyor';
            elements.garageFollowBtn.style.background = 'var(--app-bg)';
            elements.garageFollowBtn.style.color = 'var(--app-text)';
            elements.garageFollowBtn.style.border = '1px solid var(--app-border)';
          } else {
            elements.garageFollowBtn.textContent = 'Takip Et';
            elements.garageFollowBtn.style.background = 'var(--app-primary)';
            elements.garageFollowBtn.style.color = 'white';
            elements.garageFollowBtn.style.border = 'none';
          }
          
          // Re-bind click listener
          elements.garageFollowBtn.onclick = (e) => {
            e.stopPropagation();
            profile.followingState = !profile.followingState;
            if (profile.followingState) {
              profile.followers++;
              awardKarmaPoints(10);
            } else {
              profile.followers--;
            }
            renderGarage();
          };
        }

        // Setup Message Button
        if (elements.garageMessageBtn) {
          elements.garageMessageBtn.onclick = (e) => {
            e.stopPropagation();
            openChat(activePlate, profile.driver);
          };
        }
      }
      
      // Disable selector dropdown for other people's profile
      if (elements.garagePlateSelectorBtn) elements.garagePlateSelectorBtn.style.pointerEvents = 'none';
    }

    // Populate dynamic bottom section (vehicles & posts list)
    if (elements.garageBottomContainer) {
      elements.garageBottomContainer.innerHTML = '';
      
      if (profile.isMe) {
        // Render all of current user's registered vehicles
        const title = document.createElement('div');
        title.className = 'garage-section-title';
        title.textContent = 'Garajımdaki Araçlar';
        title.style.cssText = 'font-size:0.75rem; font-weight:700; color:var(--app-text-muted); text-transform:uppercase; margin-bottom:10px; border-bottom: 1px solid var(--app-border); padding-bottom: 4px;';
        elements.garageBottomContainer.appendChild(title);
        
        state.currentUser.myPlates.forEach(plate => {
          const carProfile = state.profiles[plate];
          const item = document.createElement('div');
          item.className = 'garage-car-item';
          item.style.cssText = `display:flex; justify-content:space-between; align-items:center; background:var(--app-card); border:1px solid var(--app-border); border-radius:10px; padding:10px 12px; cursor:pointer; margin-bottom:8px; transition:0.2s; ${plate === activePlate ? 'border-color:var(--app-primary);' : 'opacity:0.7;'}`;
          item.innerHTML = `
            <div class="garage-car-details">
              <h4 class="garage-car-model" style="font-size:0.85rem; font-weight:700; margin:0;">${carProfile.car}</h4>
              <span class="garage-car-plate" style="font-family:var(--font-plate); font-size:0.75rem; font-weight:700; color:var(--app-text-muted);">${formatPlate(plate)}</span>
            </div>
            <span style="font-size: 1.25rem;">🚗</span>
          `;
          item.onclick = () => {
            state.currentUser.activePlate = plate;
            state.viewingGaragePlate = plate;
            renderGarage();
          };
          elements.garageBottomContainer.appendChild(item);
        });

        // Add plate button
        const addBtn = document.createElement('button');
        addBtn.className = 'garage-add-btn';
        addBtn.textContent = '+ Yeni Plaka Tanımla';
        addBtn.style.cssText = 'width:100%; border:1px dashed var(--app-border); background:transparent; color:var(--app-text-muted); font-size:0.8rem; font-weight:600; padding:10px; border-radius:10px; cursor:pointer; transition:0.2s; margin-top:5px;';
        addBtn.onclick = () => {
          const newPlateNum = prompt("Lütfen doğrulamak istediğiniz araç plakasını girin (Örn: 34TURBO99):");
          if (newPlateNum) {
            const cleanPlate = newPlateNum.toUpperCase().replace(/\s+/g, '');
            if (cleanPlate.length > 5) {
              if (state.profiles[cleanPlate]) {
                alert("Bu plaka zaten sisteme kayıtlı!");
                return;
              }
              // Register new mock plate
              state.profiles[cleanPlate] = {
                driver: 'Ahmet Y.',
                score: 100,
                avatar: 'A',
                followers: 0,
                following: 0,
                car: 'Yeni Eklenen Araç',
                isMe: true
              };
              state.currentUser.myPlates.push(cleanPlate);
              state.currentUser.activePlate = cleanPlate;
              state.viewingGaragePlate = cleanPlate;
              renderGarage();
              alert(`Plaka ${formatPlate(cleanPlate)} e-Devlet ruhsat doğrulamasıyla başarıyla garajınıza eklendi! 🎉`);
            } else {
              alert("Geçersiz plaka formatı!");
            }
          }
        };
        elements.garageBottomContainer.appendChild(addBtn);
        
      } else {
        // Render other user's active vehicle
        const carTitle = document.createElement('div');
        carTitle.className = 'garage-section-title';
        carTitle.textContent = 'Kullanıcının Aracı';
        carTitle.style.cssText = 'font-size:0.75rem; font-weight:700; color:var(--app-text-muted); text-transform:uppercase; margin-bottom:10px; border-bottom: 1px solid var(--app-border); padding-bottom: 4px;';
        elements.garageBottomContainer.appendChild(carTitle);
        
        const carItem = document.createElement('div');
        carItem.className = 'garage-car-item';
        carItem.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--app-card); border:1px solid var(--app-border); border-radius:10px; padding:10px 12px; margin-bottom:15px;';
        carItem.innerHTML = `
          <div class="garage-car-details">
            <h4 class="garage-car-model" style="font-size:0.85rem; font-weight:700; margin:0;">${profile.car}</h4>
            <span class="garage-car-plate" style="font-family:var(--font-plate); font-size:0.75rem; font-weight:700; color:var(--app-text-muted);">${formatPlate(activePlate)}</span>
          </div>
          <span style="font-size: 1.25rem;">🚗</span>
        `;
        elements.garageBottomContainer.appendChild(carItem);

        // Render other user's posts (Sinyalleri)
        const postsTitle = document.createElement('div');
        postsTitle.className = 'garage-section-title';
        postsTitle.textContent = `${profile.driver} Sinyalleri`;
        postsTitle.style.cssText = 'font-size:0.75rem; font-weight:700; color:var(--app-text-muted); text-transform:uppercase; margin-bottom:8px; border-bottom: 1px solid var(--app-border); padding-bottom: 4px;';
        elements.garageBottomContainer.appendChild(postsTitle);

        const userSignals = state.signals.filter(sig => sig.plate === activePlate);
        if (userSignals.length > 0) {
          userSignals.forEach(sig => {
            const postCard = document.createElement('div');
            postCard.className = 'garage-post-item';
            postCard.style.cssText = 'background:var(--app-card); border:1px solid var(--app-border); border-radius:8px; padding:10px; margin-bottom:8px; font-size:0.8rem;';
            postCard.innerHTML = `
              <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.7rem; color:var(--app-text-muted);">
                <span>${getCategoryBadgeText(sig.category)}</span>
                <span>${sig.time}</span>
              </div>
              <div style="color:var(--app-text);">${sig.text}</div>
            `;
            elements.garageBottomContainer.appendChild(postCard);
          });
        } else {
          const noPost = document.createElement('div');
          noPost.style.cssText = 'font-size:0.75rem; color:var(--app-text-muted); text-align:center; padding:15px; border:1px dashed var(--app-border); border-radius:8px;';
          noPost.textContent = 'Henüz paylaştığı bir sinyal yok.';
          elements.garageBottomContainer.appendChild(noPost);
        }
      }
    }
  }

  // Plate toggle selector dropdown
  if (elements.garagePlateSelectorBtn) {
    elements.garagePlateSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.garagePlateDropdown.classList.toggle('active');
    });
  }

  document.addEventListener('click', () => {
    if (elements.garagePlateDropdown) elements.garagePlateDropdown.classList.remove('active');
  });

  // --- APP NOTIFICATION & KARMA UTILITIES ---
  function pushAppNotification(message) {
    // Show badge
    if (elements.appNotifBadge) {
      elements.appNotifBadge.textContent = '1';
      elements.appNotifBadge.style.display = 'flex';
    }
    
    // Set notification click alert
    elements.appNotificationBtn.onclick = () => {
      alert(message);
      if (elements.appNotifBadge) elements.appNotifBadge.style.display = 'none';
    };
  }

  function awardKarmaPoints(points) {
    const activePlate = state.currentUser.activePlate;
    if (state.profiles[activePlate]) {
      state.profiles[activePlate].score += points;
    }
    renderGarage();
  }

  // Helper formatting license plates (TR Plates: 34XYZ99 -> 34 XYZ 99)
  function formatPlate(plate) {
    const clean = plate.toUpperCase().replace(/\s+/g, '');
    const regex = /^(\d{2})([A-Z]{1,3})(\d{2,4})$/;
    const match = clean.match(regex);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return plate;
  }

  function getCategoryBadgeText(category) {
    if (category === 'kaza') return '💥 Kaza / Yol';
    if (category === 'park') return '⚠️ Hatalı Park';
    if (category === 'kahve') return '☕ Buluşma';
    if (category === 'destek') return '🔧 Destek';
    if (category === 'radar') return '🚨 Canlı Radar';
    return 'Sinyal';
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  // --- INTERACTIVE INVESTOR SCENARIO WALKTROUGH PLAYER ---
  let currentScenarioStep = 1;

  function runScenarioStep(stepNum) {
    currentScenarioStep = stepNum;
    
    // Highlight step cards on left panel
    elements.scenarioSteps.forEach(card => {
      card.classList.remove('active');
      if (parseInt(card.dataset.step) === stepNum) {
        card.classList.add('active');
      }
    });

    // Control Phone App mockup according to scenario flow
    if (stepNum === 1) {
      // Ahmet notices BMW: Go to Feed screen, scroll to top, show initial state
      switchAppView('feed');
      // Set active plate back to Ahmet's main plate
      state.currentUser.activePlate = '34XYZ99';
      renderGarage();
    }
    
    else if (stepNum === 2) {
      // Ahmet posts warning: Autofill composer and highlight inputs
      switchAppView('feed');
      elements.composerText.value = 'Bagaj kapağınız tam oturmamış, virajlarda açılıyor bilginize. Eşyalar düşebilir.';
      elements.composerPlateTag.value = '06BMW10';
      selectedComposerCategory = 'park';
      
      // Highlight composer selector
      const parkPill = Array.from(composerPills).find(p => p.dataset.category === 'park');
      if (parkPill) parkPill.click();
    }
    
    else if (stepNum === 3) {
      // Warning is posted, goes to BMW owner notification and message
      switchAppView('feed');
      
      // Simulate click posting if composer has text
      if (elements.composerText.value.trim() !== '') {
        elements.composerSubmitBtn.click();
      }

      // Automatically route to direct message chat with BMW owner
      setTimeout(() => {
        openChat('06BMW10', 'Burak K.');
      }, 800);
    }
    
    else if (stepNum === 4) {
      // Karma score increases, show Garajım profile update
      switchAppView('garage');
      // Trigger glowing karma score effect
      const karmaLabel = elements.garageKarmaScore;
      if (karmaLabel) {
        karmaLabel.style.color = '#10b981';
        karmaLabel.style.transform = 'scale(1.3)';
        karmaLabel.style.transition = 'all 0.5s ease';
        setTimeout(() => {
          karmaLabel.style.color = '';
          karmaLabel.style.transform = '';
        }, 1500);
      }
    }
  }

  // Bind click event to scenario step cards
  elements.scenarioSteps.forEach(card => {
    card.addEventListener('click', () => {
      const step = parseInt(card.dataset.step);
      runScenarioStep(step);
    });
  });

  // --- INVESTOR FORM SUBMIT ---
  if (elements.investorForm) {
    elements.investorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      elements.investorSubmitBtn.disabled = true;
      elements.investorSubmitBtn.textContent = 'Gönderiliyor...';
      
      setTimeout(() => {
        elements.investorSubmitBtn.textContent = 'Talep İletildi';
        elements.formSuccessMsg.style.display = 'block';
        elements.investorEmail.value = '';
      }, 1000);
    });
  }

  // --- FINANCIAL PROJECTION SLIDER ---
  const slider = document.getElementById('projectionYearSlider');
  const labels = document.querySelectorAll('.slider-label');
  
  const yearData = {
    1: { users: '100,000', plates: '250,000', shops: '350', revenue: '14.4M TL' },
    2: { users: '1,200,000', plates: '3,000,000', shops: '2,500', revenue: '185M TL' },
    3: { users: '5,000,000', plates: '12,500,000', shops: '12,000', revenue: '920M TL' }
  };

  function updateProjection(year) {
    labels.forEach(lbl => {
      lbl.classList.remove('active');
      lbl.style.color = '';
      lbl.style.fontWeight = '';
      if (parseInt(lbl.dataset.year) === year) {
        lbl.classList.add('active');
        lbl.style.color = 'var(--color-primary)';
        lbl.style.fontWeight = '700';
      }
    });

    const data = yearData[year];
    animateCounter(document.getElementById('projUsers'), data.users);
    animateCounter(document.getElementById('projPlates'), data.plates);
    animateCounter(document.getElementById('projShops'), data.shops);
    animateCounter(document.getElementById('projRevenue'), data.revenue);
  }

  function animateCounter(element, targetVal) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = 'all 0.15s ease-out';
    
    setTimeout(() => {
      element.textContent = targetVal;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 150);
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      updateProjection(parseInt(e.target.value));
    });
  }

  labels.forEach(lbl => {
    lbl.addEventListener('click', () => {
      const year = parseInt(lbl.dataset.year);
      if (slider) {
        slider.value = year;
        updateProjection(year);
      }
    });
  });

  // --- INITIAL FEED LAUNCH ---
  renderFeed();
  renderDMInbox();
  switchAppView('feed');
  
  // Custom scroll listener to shrink header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      elements.header.classList.add('scrolled');
    } else {
      elements.header.classList.remove('scrolled');
    }
  });

});
