with open('logo_base64.txt', 'r') as f:
    LOGO_B64 = f.read().strip()

fb_renderers = f"""
// Screen Renderers for Facebook-Style PPBF Application

function getActiveRoute() {{
  let hash = window.location.hash || '#/home';
  if (!hash.startsWith('#/')) hash = '#/home';
  return hash;
}}

function renderRoute() {{
  const hash = getActiveRoute();
  const content = document.getElementById('fb-app-content');
  if (!content) return;

  // Update tabs active state
  updateFBTabs(hash);

  if (hash === '#/home') {{
    content.innerHTML = renderFBHome();
  }} else if (hash === '#/loans') {{
    content.innerHTML = renderFBMarketplace();
  }} else if (hash.startsWith('#/inv/')) {{
    const no = decodeURIComponent(hash.replace('#/inv/', ''));
    if (no === 'all') {{
      content.innerHTML = renderInvAll();
    }} else {{
      content.innerHTML = renderInvForm(no);
    }}
    autoScaleA4();
  }} else if (hash === '#/members') {{
    content.innerHTML = renderFBMembers();
  }} else if (hash.startsWith('#/member/')) {{
    const id = hash.replace('#/member/', '');
    content.innerHTML = renderMemberAdmissionForm(id);
    autoScaleA4();
  }} else if (hash === '#/media') {{
    content.innerHTML = renderFBWatch();
  }} else if (hash === '#/notifications') {{
    content.innerHTML = renderFBNotifications();
  }} else if (hash === '#/menu') {{
    content.innerHTML = renderFBMenu();
  }} else if (hash === '#/forms') {{
    content.innerHTML = renderFormsHub();
  }} else if (hash === '#/statements') {{
    content.innerHTML = renderStatements();
  }} else if (hash === '#/assets') {{
    content.innerHTML = renderAssets();
  }} else if (hash === '#/finance') {{
    content.innerHTML = renderFinance();
  }} else if (hash === '#/about') {{
    content.innerHTML = renderAbout();
  }} else if (hash === '#/report') {{
    content.innerHTML = renderReport();
  }} else if (hash === '#/admin') {{
    content.innerHTML = renderAdmin();
  }} else {{
    window.location.hash = '#/home';
  }}

  setTimeout(autoScaleA4, 50);
}}

function updateFBTabs(hash) {{
  document.querySelectorAll('.fb-tab-item').forEach(tab => {{
    const target = tab.getAttribute('data-tab');
    if (
      (target === 'home' && hash === '#/home') ||
      (target === 'loans' && (hash === '#/loans' || hash.startsWith('#/inv/'))) ||
      (target === 'members' && (hash === '#/members' || hash.startsWith('#/member/'))) ||
      (target === 'media' && hash === '#/media') ||
      (target === 'notifications' && hash === '#/notifications') ||
      (target === 'menu' && (hash === '#/menu' || ['#/forms', '#/statements', '#/assets', '#/finance', '#/about', '#/report', '#/admin'].includes(hash)))
    ) {{
      tab.classList.add('active');
    }} else {{
      tab.classList.remove('active');
    }}
  }});
}}

// 1. FACEBOOK HOME FEED
function renderFBHome() {{
  const posts = PPBF_DATA.posts || [];
  const stories = PPBF_DATA.stories || [];
  const list = PPBF_DATA.investments.list || [];
  const edit = isEditMode();

  return `
    <div class="fb-container">
      
      <!-- Bismillah & Header Greeting Card -->
      <div style="background: linear-gradient(135deg, #07192f 0%, #0b2545 100%); color:#fff; border-radius: var(--radius-lg); padding: 14px 18px; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-family:'Noto Serif Bengali',serif; color:var(--gold); font-size:12px; margin-bottom:2px;">
          ${{PPBF_DATA.info.bismillah}}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-family:'Noto Serif Bengali',serif; font-size:18px; font-weight:800;">
              ${{PPBF_DATA.info.name_bn}}
            </div>
            <div style="font-size:11px; opacity:0.85;">
              Community Cooperative News Feed • P.M. Khali, Cox's Bazar
            </div>
          </div>
          <div style="display:flex; gap:6px;">
            <a href="#/inv/all" class="fb-action-btn" style="background:rgba(255,255,255,0.15); color:#fff; padding:6px 10px; font-size:11.5px; border-radius:6px;">
              📄 All Forms
            </a>
            <button class="fb-action-btn" style="background:var(--fb-blue); color:#fff; padding:6px 12px; font-size:11.5px; border-radius:6px; font-weight:700;" onclick="toggleEditMode()">
              ${{edit ? '✏️ Edit Mode' : '👁️ View Mode'}}
            </button>
          </div>
        </div>
        <div class="tri-bar" style="margin-top: 10px; border-radius: 2px;">
          <div class="bar-red"></div>
          <div class="bar-orange"></div>
          <div class="bar-green"></div>
        </div>
      </div>

      <!-- Facebook Stories Carousel -->
      <div class="fb-stories-reel">
        <!-- Add Story Card -->
        <div class="fb-story-card" style="background:#ffffff; color:var(--fb-text-primary); border:1px solid var(--fb-border-light);" onclick="openCreatePostModal()">
          <div style="height:105px; background:var(--fb-bg); display:flex; align-items:center; justify-content:center; position:relative;">
            <img src="{LOGO_B64}" style="width:48px;height:48px;opacity:0.8;" />
            <div style="position:absolute; bottom:-16px; width:32px; height:32px; border-radius:50%; background:var(--fb-blue); color:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; border:3px solid #fff;">
              +
            </div>
          </div>
          <div style="padding-top:14px; text-align:center; font-size:11px; font-weight:700; color:var(--fb-text-primary);">
            Create Post
          </div>
        </div>

        <!-- Dynamic Stories -->
        ${{stories.map(s => `
          <div class="fb-story-card" style="background:${{s.color}};" onclick="openStoryModal('${{s.id}}')">
            <div class="fb-story-avatar">${{s.author.charAt(0)}}</div>
            <div>
              <span class="fb-badge" style="position:static; margin-bottom:4px; font-size:9px; background:rgba(0,0,0,0.4);">${{s.badge}}</span>
              <div class="fb-story-name">${{s.title}}</div>
              <div style="font-size:9.5px; opacity:0.85;">${{s.sub}}</div>
            </div>
          </div>
        `).join('')}}
      </div>

      <!-- Post Creator ("What's on your mind?") -->
      <div class="fb-creator-card">
        <div class="fb-creator-top">
          <div class="fb-user-avatar">N</div>
          <div class="fb-fake-input" onclick="openCreatePostModal()">
            What's on your mind? Post forum announcement...
          </div>
        </div>
        <div class="fb-creator-actions">
          <button class="fb-creator-btn" onclick="openCreatePostModal()">
            <span style="color:#e41e3f; font-size:16px;">🔴</span> Live Notice
          </button>
          <button class="fb-creator-btn" onclick="window.location.hash='#/media'">
            <span style="color:#45bd62; font-size:16px;">🖼️</span> Photo/Video
          </button>
          <button class="fb-creator-btn" onclick="window.location.hash='#/loans'">
            <span style="color:#f7b125; font-size:16px;">📄</span> Investment
          </button>
        </div>
      </div>

      <!-- Interactive Feed Posts -->
      <div id="fb-posts-stream">
        ${{posts.map(post => {{
          let attachedInv = null;
          if (post.inv_ref) {{
            attachedInv = list.find(i => String(i.no) === String(post.inv_ref));
          }}

          const userReaction = post.user_reacted;
          let reactionIcon = "👍";
          let reactionLabel = "Like";
          let reactionColor = "var(--fb-text-secondary)";
          if (userReaction === 'love') {{
            reactionIcon = "❤️";
            reactionLabel = "Love";
            reactionColor = "#FA3E3E";
          }} else if (userReaction === 'like') {{
            reactionIcon = "👍";
            reactionLabel = "Liked";
            reactionColor = "var(--fb-blue)";
          }}

          return `
            <div class="fb-post-card" id="post-card-${{post.id}}">
              <!-- Post Header -->
              <div class="fb-post-header">
                <div class="fb-author-row">
                  <div class="fb-user-avatar">${{post.author_avatar || post.author.charAt(0)}}</div>
                  <div class="fb-author-info">
                    <div class="fb-author-name">
                      ${{post.author}}
                      <span style="color:var(--fb-blue); font-size:12px;">✓</span>
                    </div>
                    <div class="fb-author-role">
                      ${{post.author_role}} • ${{post.time}} • 🌐
                    </div>
                  </div>
                </div>
                <button class="fb-icon-btn" style="width:32px;height:32px;" onclick="showToast('Post option menu')">⋯</button>
              </div>

              <!-- Post Text Body -->
              <div class="fb-post-body">
                <div style="font-family:'Noto Serif Bengali',serif; font-size:15px; margin-bottom:6px; line-height:1.5;">
                  ${{post.content_bn}}
                </div>
                <div style="font-size:13px; color:var(--fb-text-secondary); line-height:1.4;">
                  ${{post.content_en}}
                </div>
              </div>

              <!-- Optional Attached Investment Card -->
              ${{attachedInv ? `
                <div class="fb-post-attachment" style="padding: 12px 16px;">
                  <div style="background:#ffffff; border:1px solid var(--fb-border-light); border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                      <span class="fb-badge" style="position:static; background:${{attachedInv.status === 'RUNNING' ? '#fef3c7' : '#dcfce7'}}; color:${{attachedInv.status === 'RUNNING' ? '#92400e' : '#166534'}};">
                        ${{attachedInv.status}}
                      </span>
                      <div style="font-size:15px; font-weight:800; color:var(--navy); margin-top:4px;">
                        #${{attachedInv.no}}: ${{attachedInv.type}}
                      </div>
                      <div style="font-size:12.5px; color:var(--fb-text-secondary);">
                        Receiver: <strong>${{attachedInv.receiver}}</strong> • Total: <strong>${{formatTaka(attachedInv.total)}}</strong>
                      </div>
                    </div>
                    <a href="#/inv/${{encodeURIComponent(attachedInv.no)}}" class="fb-action-btn" style="background:var(--fb-blue); color:#fff; padding:8px 14px; font-weight:700; border-radius:6px; text-decoration:none; max-width:180px;">
                      📄 Open A4 Form
                    </a>
                  </div>
                </div>
              ` : ''}}

              <!-- Metrics (Likes / Comments counts) -->
              <div class="fb-post-metrics">
                <div class="fb-reactions-count">
                  <span>👍</span><span>❤️</span>
                  <span style="margin-left:4px; font-weight:600;">${{post.likes || 12}}</span>
                </div>
                <div>
                  <span>${{post.comments ? post.comments.length : 0}} comments</span> • <span>3 shares</span>
                </div>
              </div>

              <!-- Functional Action Buttons (Like / Comment / Share) -->
              <div class="fb-post-actions-bar">
                <button class="fb-action-btn ${{userReaction ? 'active' : ''}}" style="color:${{reactionColor}};" onclick="togglePostReaction('${{post.id}}')">
                  <span>${{reactionIcon}}</span> <span>${{reactionLabel}}</span>
                </button>
                <button class="fb-action-btn" onclick="document.getElementById('comment-input-${{post.id}}').focus()">
                  <span>💬</span> <span>Comment</span>
                </button>
                <button class="fb-action-btn" onclick="shareApp()">
                  <span>↗️</span> <span>Share</span>
                </button>
              </div>

              <!-- Functional Comments Section -->
              <div class="fb-comments-section">
                ${{(post.comments || []).map(c => `
                  <div class="fb-comment-item">
                    <div class="fb-user-avatar" style="width:28px;height:28px;font-size:11px;">${{c.author.charAt(0)}}</div>
                    <div class="fb-comment-bubble">
                      <div class="fb-comment-author">${{c.author}}</div>
                      <div>${{c.text}}</div>
                    </div>
                  </div>
                `).join('')}}

                <div class="fb-comment-input-row">
                  <div class="fb-user-avatar" style="width:30px;height:30px;font-size:11px;">N</div>
                  <input type="text" id="comment-input-${{post.id}}" placeholder="Write a comment..." 
                    onkeydown="if(event.key==='Enter') addPostComment('${{post.id}}', this)" />
                  <button class="fb-icon-btn" style="width:32px;height:32px;background:var(--fb-blue);color:#fff;" 
                    onclick="addPostComment('${{post.id}}', document.getElementById('comment-input-${{post.id}}'))">
                    ➤
                  </button>
                </div>
              </div>
            </div>
          `;
        }}).join('')}}
      </div>
    </div>
  `;
}}

// 2. FACEBOOK MARKETPLACE (Investments & Vehicles)
function renderFBMarketplace() {{
  const list = PPBF_DATA.investments.list || [];
  let totalInvested = list.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
  let totalReceived = list.reduce((s, i) => s + (parseFloat(i.received) || 0), 0);
  let totalDue = list.reduce((s, i) => s + (parseFloat(i.due) || 0), 0);

  return `
    <div class="fb-wide-container">
      <!-- Marketplace Header -->
      <div style="background:#ffffff; border-radius:var(--radius-lg); padding:16px 20px; border:1px solid var(--fb-border-light); margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:22px; font-weight:800; color:var(--navy);">
            Investments Marketplace
          </div>
          <div style="font-size:13px; color:var(--fb-text-secondary);">
            25 Vehicle & Community Enterprise Allocations in P.M. Khali
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <a href="#/inv/all" class="fb-action-btn" style="background:var(--gold); color:#fff; font-weight:700; padding:8px 14px; border-radius:8px; text-decoration:none;">
            📄 Print All A4 Forms
          </a>
        </div>
      </div>

      <!-- Financial Metrics Pill Strip -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:16px;">
        <div style="background:#ffffff; padding:12px 14px; border-radius:10px; border:1px solid var(--fb-border-light);">
          <div style="font-size:11px; font-weight:700; color:var(--fb-text-secondary); text-transform:uppercase;">Total Financed</div>
          <div style="font-size:18px; font-weight:800; color:var(--navy);">${{formatTaka(totalInvested)}}</div>
        </div>
        <div style="background:#ffffff; padding:12px 14px; border-radius:10px; border:1px solid var(--fb-border-light);">
          <div style="font-size:11px; font-weight:700; color:var(--fb-text-secondary); text-transform:uppercase;">Recovered</div>
          <div style="font-size:18px; font-weight:800; color:var(--tri-green);">${{formatTaka(totalReceived)}}</div>
        </div>
        <div style="background:#ffffff; padding:12px 14px; border-radius:10px; border:1px solid var(--fb-border-light);">
          <div style="font-size:11px; font-weight:700; color:var(--fb-text-secondary); text-transform:uppercase;">Due Balance</div>
          <div style="font-size:18px; font-weight:800; color:var(--tri-red);">${{formatTaka(totalDue)}}</div>
        </div>
      </div>

      <!-- Fast Form Chips -->
      <div style="margin-bottom:12px;">
        <div class="fb-stories-reel" style="padding-bottom:4px;">
          ${{list.map(i => `
            <a href="#/inv/${{encodeURIComponent(i.no)}}" style="padding:6px 12px; background:#fff; border:1px solid var(--fb-border-light); border-radius:9999px; font-size:12px; font-weight:600; color:var(--navy); text-decoration:none; white-space:nowrap;">
              #${{i.no}} (${{i.receiver.split(' ')[0]}})
            </a>
          `).join('')}}
        </div>
      </div>

      <!-- Marketplace Item Cards Grid -->
      <div class="fb-marketplace-grid">
        ${{list.map(item => {{
          const photoKey = `rec_${{String(item.no).replace(/ /g, '').replace(/&/g, '_')}}`;
          const photo = getPhoto(photoKey);
          const pct = item.total > 0 ? Math.min(100, Math.round(((item.received + (item.security || 0)) / item.total) * 100)) : 0;

          return `
            <div class="fb-market-card" onclick="window.location.hash='#/inv/${{encodeURIComponent(item.no)}}'">
              <div class="fb-market-img">
                ${{photo ? `<img src="${{photo}}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-size:32px;">🛺</span>`}}
                <span class="fb-badge" style="position:absolute; top:8px; right:8px; background:${{item.status === 'RUNNING' ? '#f59e0b' : '#0e9f5c'}};">
                  ${{item.status}}
                </span>
              </div>
              <div class="fb-market-info">
                <div>
                  <div class="fb-market-price">${{formatTaka(item.total)}}</div>
                  <div class="fb-market-title">#${{item.no}} - ${{item.type}}</div>
                  <div class="fb-market-sub">Receiver: <strong>${{item.receiver}}</strong></div>
                  <div class="fb-market-sub">P.M. Khali • ${{item.issue_date}}</div>
                </div>
                <div style="margin-top:10px;">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:3px;">
                    <span style="color:var(--tri-green);">${{formatTaka(item.received)}} paid</span>
                    <span>${{pct}}%</span>
                  </div>
                  <div style="width:100%; height:5px; background:#e4e6eb; border-radius:9999px; overflow:hidden;">
                    <div style="width:${{pct}}%; height:100%; background:var(--fb-blue);"></div>
                  </div>
                  <button class="fb-action-btn" style="width:100%; margin-top:8px; background:var(--fb-bg); font-weight:700; font-size:12px; border-radius:6px;">
                    📄 View A4 Statement
                  </button>
                </div>
              </div>
            </div>
          `;
        }}).join('')}}
      </div>
    </div>
  `;
}}

// 3. FACEBOOK MEMBERS (Groups / Friends)
function renderFBMembers() {{
  const members = PPBF_DATA.members || [];
  const edit = isEditMode();

  return `
    <div class="fb-container">
      <div style="background:#ffffff; border-radius:var(--radius-lg); padding:16px 20px; border:1px solid var(--fb-border-light); margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:22px; font-weight:800; color:var(--navy);">
            Members Community (${{members.length}})
          </div>
          <div style="font-size:13px; color:var(--fb-text-secondary);">
            Parania Para Business Forum Registered Cooperative Shareholders
          </div>
        </div>
        ${{edit ? `
          <button class="fb-action-btn" style="background:var(--fb-blue); color:#fff; font-weight:700; padding:8px 14px; border-radius:8px; max-width:140px;" onclick="openAddMemberModal()">
            + Add Member
          </button>
        ` : ''}}
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${{members.map(m => `
          <div style="background:#ffffff; border-radius:var(--radius-lg); border:1px solid var(--fb-border-light); padding:14px 16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="fb-user-avatar" style="width:48px;height:48px;font-size:18px;background:linear-gradient(135deg, #0b2545 0%, #1877F2 100%);">
                ${{m.name.charAt(0)}}
              </div>
              <div>
                <div style="font-size:16px; font-weight:700; color:var(--fb-text-primary); display:flex; align-items:center; gap:6px;">
                  ${{m.name}}
                  <span class="fb-badge" style="position:static; font-size:10px; background:var(--navy);">${{m.designation}}</span>
                </div>
                <div style="font-family:'Noto Serif Bengali',serif; font-size:12.5px; color:var(--fb-text-secondary);">
                  ${{m.name_bn || ''}} • Mobile: ${{m.mobile}}
                </div>
                <div style="font-size:12px; color:var(--tri-green); font-weight:700; margin-top:2px;">
                  Total Savings: ${{formatTaka(m.total_savings)}} • ${{m.shares}} Shares
                </div>
              </div>
            </div>
            <a href="#/member/${{m.id}}" class="fb-action-btn" style="background:var(--fb-bg); font-weight:700; padding:8px 14px; border-radius:8px; text-decoration:none; max-width:160px;">
              📄 A4 Passbook
            </a>
          </div>
        `).join('')}}
      </div>
    </div>
  `;
}}

// 4. FACEBOOK WATCH (Media & Assemblies)
function renderFBWatch() {{
  const media = PPBF_DATA.media || [];

  return `
    <div class="fb-container">
      <div style="background:#ffffff; border-radius:var(--radius-lg); padding:16px 20px; border:1px solid var(--fb-border-light); margin-bottom:16px;">
        <div style="font-size:22px; font-weight:800; color:var(--navy);">
          PPBF Watch & Photo Archives
        </div>
        <div style="font-size:13px; color:var(--fb-text-secondary);">
          Live recordings, vehicle handovers, AGM assemblies, and project milestones.
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${{media.map(m => `
          <div class="fb-post-card">
            <div style="height:200px; background:linear-gradient(135deg, #07192f 0%, #0b2545 100%); display:flex; align-items:center; justify-content:center; color:#fff; position:relative; cursor:pointer;" onclick="showToast('Playing ${{m.title}}')">
              <div style="width:56px;height:56px;border-radius:50%;background:rgba(24,119,242,0.9);display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                ▶
              </div>
              <span class="fb-badge" style="position:absolute; top:12px; right:12px; background:var(--gold); font-size:11px;">
                ${{m.category}}
              </span>
            </div>
            <div style="padding:14px 16px;">
              <div style="font-size:11px; font-weight:700; color:var(--fb-blue); text-transform:uppercase;">${{m.date}}</div>
              <div style="font-size:17px; font-weight:800; color:var(--fb-text-primary); margin:4px 0 6px 0;">${{m.title}}</div>
              <div style="font-size:13.5px; color:var(--fb-text-secondary); line-height:1.4;">${{m.description}}</div>
            </div>
            <div class="fb-post-actions-bar">
              <button class="fb-action-btn" onclick="showToast('Liked! 👍')">👍 Like</button>
              <button class="fb-action-btn" onclick="showToast('Comment')">💬 Comment</button>
              <button class="fb-action-btn" onclick="shareApp()">↗️ Share</button>
            </div>
          </div>
        `).join('')}}
      </div>
    </div>
  `;
}}

// 5. FACEBOOK NOTIFICATIONS
function renderFBNotifications() {{
  const notifs = PPBF_DATA.notifications || [];

  return `
    <div class="fb-container">
      <div style="background:#ffffff; border-radius:var(--radius-lg); padding:16px 20px; border:1px solid var(--fb-border-light); margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:22px; font-weight:800; color:var(--navy);">Notifications</div>
          <div style="font-size:13px; color:var(--fb-text-secondary);">Updates on investments, collections, and forum meetings</div>
        </div>
        <button class="fb-action-btn" style="max-width:140px; font-size:12px;" onclick="PPBF_DATA.notifications.forEach(n=>n.read=true);saveData();renderRoute();">
          Mark all read
        </button>
      </div>

      <div style="background:#ffffff; border-radius:var(--radius-lg); border:1px solid var(--fb-border-light); overflow:hidden;">
        ${{notifs.map(n => `
          <div style="padding:14px 18px; border-bottom:1px solid var(--fb-border-light); display:flex; align-items:center; justify-content:space-between; gap:12px; background:${{n.read ? '#fff' : 'var(--fb-blue-light)'}}; cursor:pointer;" onclick="clickNotification('${{n.id}}', '${{n.link}}')">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="fb-user-avatar" style="width:42px;height:42px;background:var(--navy);font-size:16px;">
                ${{n.icon === 'cash' ? '💵' : n.icon === 'check' ? '✅' : '📢'}}
              </div>
              <div>
                <div style="font-size:14.5px; font-weight:${{n.read ? '600' : '800'}}; color:var(--fb-text-primary);">
                  ${{n.title}}
                </div>
                <div style="font-size:13px; color:var(--fb-text-secondary); margin-top:2px;">
                  ${{n.body}}
                </div>
                <div style="font-size:11.5px; color:var(--fb-blue); font-weight:600; margin-top:4px;">
                  ${{n.time}}
                </div>
              </div>
            </div>
            ${{!n.read ? `<div style="width:10px;height:10px;border-radius:50%;background:var(--fb-blue);"></div>` : ''}}
          </div>
        `).join('')}}
      </div>
    </div>
  `;
}}

// 6. FACEBOOK MENU TAB (Cooperative Shortcuts)
function renderFBMenu() {{
  const edit = isEditMode();

  return `
    <div class="fb-container">
      <!-- Profile Card -->
      <div style="background:#ffffff; border-radius:var(--radius-lg); padding:16px 20px; border:1px solid var(--fb-border-light); margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="fb-user-avatar" style="width:52px;height:52px;font-size:20px;background:var(--navy);">N</div>
          <div>
            <div style="font-size:17px; font-weight:800; color:var(--navy);">Nabi Hossain</div>
            <div style="font-size:13px; color:var(--fb-text-secondary);">Finance Secretary • PPBF Executive Committee</div>
          </div>
        </div>
        <button class="fb-action-btn" style="background:${{edit ? '#fee2e2' : 'var(--fb-blue)'}}; color:${{edit ? '#991b1b' : '#fff'}}; font-weight:700; padding:8px 16px; border-radius:8px; max-width:180px;" onclick="toggleEditMode()">
          ${{edit ? 'Lock View Mode' : 'Unlock Edit Mode'}}
        </button>
      </div>

      <div style="font-size:16px; font-weight:800; color:var(--fb-text-primary); margin-bottom:10px;">
        All Cooperative Shortcuts
      </div>

      <!-- Facebook Rounded Tile Shortcuts -->
      <div class="fb-menu-grid" style="margin-bottom:20px;">
        <a href="#/loans" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#1877F2;">🛺</div>
          <div style="font-weight:700; font-size:13.5px;">Investments</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">25 Vehicles & Units</div>
        </a>
        <a href="#/inv/all" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#b8893a;">🖨️</div>
          <div style="font-weight:700; font-size:13.5px;">All Forms Print</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">24 A4 Statements</div>
        </a>
        <a href="#/members" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#0e9f5c;">👥</div>
          <div style="font-weight:700; font-size:13.5px;">Members Directory</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Passbooks & Equity</div>
        </a>
        <a href="#/forms" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#0284c7;">📄</div>
          <div style="font-weight:700; font-size:13.5px;">Forms Hub</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Official Templates</div>
        </a>
        <a href="#/report" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#7c3aed;">📊</div>
          <div style="font-weight:700; font-size:13.5px;">Audit Report</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Fiscal Metrics</div>
        </a>
        <a href="#/finance" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#f59e0b;">💰</div>
          <div style="font-weight:700; font-size:13.5px;">Finance & Cash</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Ledger Accounts</div>
        </a>
        <a href="#/assets" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#14b8a6;">🏢</div>
          <div style="font-weight:700; font-size:13.5px;">Asset Register</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Valuation & Hubs</div>
        </a>
        <a href="#/about" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#0b2545;">ℹ️</div>
          <div style="font-weight:700; font-size:13.5px;">About PPBF</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">History & Council</div>
        </a>
        <a href="#/admin" class="fb-menu-tile">
          <div class="fb-menu-icon" style="background:#475569;">⚙️</div>
          <div style="font-weight:700; font-size:13.5px;">Administration</div>
          <div style="font-size:11.5px; color:var(--fb-text-secondary);">Master Tables</div>
        </a>
      </div>

      <!-- Backup, Share & Seed Reset Tools -->
      <div style="background:#ffffff; border-radius:var(--radius-lg); border:1px solid var(--fb-border-light); padding:16px;">
        <div style="font-size:14px; font-weight:700; color:var(--navy); margin-bottom:10px;">System & Data Management</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="fb-action-btn" style="background:var(--fb-bg); font-weight:700;" onclick="exportDataJSON()">
            💾 Export Full JSON
          </button>
          <label class="fb-action-btn" style="background:var(--fb-bg); font-weight:700; cursor:pointer;">
            📥 Import JSON
            <input type="file" accept=".json" style="display:none;" onchange="importDataJSON(event)" />
          </label>
          <button class="fb-action-btn" style="background:var(--fb-bg); font-weight:700;" onclick="shareApp()">
            ↗️ Share App Link
          </button>
          <button class="fb-action-btn" style="background:#fee2e2; color:#991b1b; font-weight:700;" onclick="resetToSeed()">
            🔄 Reset Seed
          </button>
        </div>
      </div>
    </div>
  `;
}}

// Initialize
window.addEventListener('DOMContentLoaded', () => {{
  initData();
  renderRoute();
}});

window.addEventListener('hashchange', renderRoute);
"""

with open('fb_logic_part2.js', 'w') as f:
    f.write(fb_renderers)

