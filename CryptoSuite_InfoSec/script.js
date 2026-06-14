// ---------- ALGORITHMS (preserved from original) ----------
  function updateActiveNav(algoId) {
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  if (algoId === 'home') {
    document.getElementById('homeNavBtn').classList.add('active');
  } else {
    // Keep home inactive, remove active from any algorithm-specific nav
    document.getElementById('homeNavBtn').classList.remove('active');
  }
}
  const Caesar = {
  encrypt(text, shift) { return this.transform(text, shift, true); },
  decrypt(text, shift) { return this.transform(text, shift, false); },
  transform(text, shift, encrypt) {
    if (!text) return "";
    let res = "";
    let actualShift = encrypt ? shift % 26 : (26 - (shift % 26)) % 26;
    for (let ch of text) {
      if (ch >= 'A' && ch <= 'Z') {
        let code = ch.charCodeAt(0) - 65;
        res += String.fromCharCode(((code + actualShift) % 26) + 65);
      } else if (ch >= 'a' && ch <= 'z') {
        let code = ch.charCodeAt(0) - 97;
        res += String.fromCharCode(((code + actualShift) % 26) + 97);
      } else if (ch >= '0' && ch <= '9') {
        let code = parseInt(ch);
        let newCode = encrypt ? (code + shift) % 10 : (code - shift + 10) % 10;
        res += newCode.toString();
      } else {
        res += ch;
      }
    }
    return res;
  }
};

  const Playfair = {
  buildGrid(keyword) {
    let filtered = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (!filtered) filtered = "";
    
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    let seen = new Set();
    let gridArr = [];
    
    for (let ch of filtered) {
      if (ch === 'J') ch = 'I';
      if (!seen.has(ch)) {
        seen.add(ch);
        gridArr.push(ch);
      }
    }
    
    for (let ch of alphabet) {
      if (!seen.has(ch)) {
        seen.add(ch);
        gridArr.push(ch);
      }
    }
    
    let matrix = [];
    for (let i = 0; i < 5; i++) {
      matrix.push(gridArr.slice(i * 5, i * 5 + 5));
    }
    return matrix;
  },
  
  findPos(grid, ch) {
    if (ch === 'J') ch = 'I';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] === ch) return [r, c];
      }
    }
    return [0, 0];
  },
  
  prepare(text) {
    let t = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let out = "";
    for (let i = 0; i < t.length; i++) {
      out += t[i];
      if (i + 1 < t.length && t[i] === t[i + 1]) {
        out += 'X';
      }
    }
    if (out.length % 2 !== 0) out += 'X';
    let pairs = [];
    for (let i = 0; i < out.length; i += 2) {
      pairs.push(out[i] + out[i + 1]);
    }
    return pairs;
  },
  
  crypt(text, keyword, encrypt) {
    let grid = this.buildGrid(keyword);
    let pairs = this.prepare(text);
    let result = "";
    
    for (let p of pairs) {
      let [r1, c1] = this.findPos(grid, p[0]);
      let [r2, c2] = this.findPos(grid, p[1]);
      
      if (r1 === r2) {
        let shift = encrypt ? 1 : -1;
        result += grid[r1][(c1 + shift + 5) % 5];
        result += grid[r2][(c2 + shift + 5) % 5];
      } else if (c1 === c2) {
        let shift = encrypt ? 1 : -1;
        result += grid[(r1 + shift + 5) % 5][c1];
        result += grid[(r2 + shift + 5) % 5][c2];
      } else {
        result += grid[r1][c2];
        result += grid[r2][c1];
      }
    }
    return result;
  }
};

  const Vigenere = {
    crypt(text, key, encrypt) {
      if(!text) return "";
      let keyNorm = key.toUpperCase().replace(/[^A-Z]/g, '');
      if(!keyNorm) keyNorm = "A";
      let result = "", idx=0;
      for(let ch of text) {
        let isUp = ch>='A' && ch<='Z';
        let isLow = ch>='a' && ch<='z';
        if(isUp || isLow) {
          let base = isUp ? 65 : 97;
          let code = ch.charCodeAt(0)-base;
          let kShift = keyNorm.charCodeAt(idx % keyNorm.length)-65;
          if(!encrypt) kShift = (26 - kShift) % 26;
          let newCode = (code + kShift) % 26;
          result += String.fromCharCode(newCode+base);
          idx++;
        } else result += ch;
      }
      return result;
    }
  };

  const Vernam = {
  encrypt(text, key) {
    if(text.length !== key.length) {
      return `⚠️ Error: Key length (${key.length}) must equal message length (${text.length})`;
    }
    
    let result = "";
    
    for(let i = 0; i < text.length; i++) {
      let pChar = text[i];
      let kChar = key[i];
      
      if(pChar === ' ') {
        result += ' ';
        continue;
      }
      
      if(/[A-Za-z]/.test(pChar) && /[A-Za-z]/.test(kChar)) {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let pUpper = pChar.toUpperCase();
        let kUpper = kChar.toUpperCase();
        
        let pNum = alphabet.indexOf(pUpper);
        let kNum = alphabet.indexOf(kUpper);
        
        let cipherNum = pNum + kNum;
        
        if(cipherNum >= 26) {
          cipherNum = cipherNum - 26;
        }
        
        let cipherChar = alphabet[cipherNum];
        if(pChar !== pUpper) {
          cipherChar = cipherChar.toLowerCase();
        }
        
        result += cipherChar;
      } else {
        result += pChar;
      }
    }
    
    return result;
  },
  
  decrypt(cipher, key) {
    if(cipher.length !== key.length) {
      return `⚠️ Error: Key length (${key.length}) must equal message length (${cipher.length})`;
    }
    
    let result = "";
    
    for(let i = 0; i < cipher.length; i++) {
      let cChar = cipher[i];
      let kChar = key[i];
      
      if(cChar === ' ') {
        result += ' ';
        continue;
      }
      
      if(/[A-Za-z]/.test(cChar) && /[A-Za-z]/.test(kChar)) {
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let cUpper = cChar.toUpperCase();
        let kUpper = kChar.toUpperCase();
        
        let cNum = alphabet.indexOf(cUpper);
        let kNum = alphabet.indexOf(kUpper);
        
        let plainNum = cNum - kNum;
        
        if(plainNum < 0) {
          plainNum = plainNum + 26;
        }
        
        let plainChar = alphabet[plainNum];
        if(cChar !== cUpper) {
          plainChar = plainChar.toLowerCase();
        }
        
        result += plainChar;
      } else {
        result += cChar;
      }
    }
    
    return result;
  },
  
  process(text, key, encryptMode) {
    if(encryptMode) {
      return this.encrypt(text, key);
    } else {
      return this.decrypt(text, key);
    }
  }
};

  // Helper: generate dynamic tables (same as original)
  function renderPlayfairTable(keyword) {
    const grid = Playfair.buildGrid(keyword);
    let html = '<div class="dynamic-table"><h4>Playfair 5x5 Grid (I/J merged)</h4><table>';
    for(let r=0;r<5;r++) {
      html += '<tr>';
      for(let c=0;c<5;c++) html += `<td><strong>${grid[r][c]}</strong></td>`;
      html += '</tr>';
    }
    html += '</table><p style="margin-top:8px; font-size:12px;">🔹 Rules: same row → shift right/left, same col → shift down/up, rectangle → swap corners.</p></div>';
    return html;
  }

  function renderVigenereTable() {
    let html = '<div class="dynamic-table"><h4>Vigenère Square (Tabula Recta)</h4><div style="overflow-x:auto"><table style="font-size:11px">';
    html += '<tr><th></th>';
    for(let i=0;i<26;i++) html += `<th>${String.fromCharCode(65+i)}</th>`;
    html += '</tr>';
    for(let i=0;i<26;i++) {
      html += `<tr><th><strong>${String.fromCharCode(65+i)}</strong></th>`;
      for(let j=0;j<26;j++) {
        let shifted = (i+j)%26;
        html += `<td>${String.fromCharCode(65+shifted)}</td>`;
      }
      html += '</tr>';
    }
    html += '</table></div><p style="margin-top:8px; font-size:12px;">🔹 C = (P + K) mod 26,  P = (C - K) mod 26</p></div>';
    return html;
  }

  function renderVernamAsciiTable() {
  let html = '<div class="dynamic-table"><h4>Vernam Cipher Logic</h4><div style="overflow-x:auto"><table style="font-size:11px"><thead>';
  html += '<table><th>Char</th><th>Number</th><th>Encryption</th><th>Decryption</th></tr></thead><tbody>';
  
  let examples = [
    { char: 'A', num: 0 },
    { char: 'B', num: 1 },
    { char: 'C', num: 2 },
    { char: '⋮', num: '⋮' },
    { char: 'Z', num: 25 }
  ];
  
  examples.forEach(ex => {
    if(ex.char === '⋮') {
      html += `<tr style="text-align:center">
        <td>⋮</div>
        <td>⋮</div>
        <td>⋮</div>
        <td>⋮</div>
      </tr>`;
    } else {
      html += `<tr style="text-align:center">
        <td>${ex.char}</div>
        <td>${ex.num}</div>
        <td>${ex.char} (${ex.num}) + key (?) = ? if >= 26 then -26</div>
        <td>${ex.char} (${ex.num}) - key (?) = ? if < 0 then +26</div>
      </tr>`;
    }
  });
  
  html += '</tbody></table>';
  html += '<p style="margin-top:8px; font-size:12px;">🔹 Key length must equal message length for perfect secrecy</p></div>';
  
  return html;
}

  function renderCaesarShiftHint(shift=3) {
  let letterShift = shift % 26;
  let numberShift = shift % 10;
  
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numbers = '0123456789';
  
  let letterHtml = `
    <div style="margin-bottom: 20px;">
      <h4 style="color: var(--blue-primary); margin-bottom: 10px;">Letters (A-Z, shift ${shift})</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Plain</th>
          ${letters.split('').map(l => `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>${l}</strong></td>`).join('')}
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cipher</th>
          ${letters.split('').map(l => `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${String.fromCharCode(65 + ((l.charCodeAt(0) - 65 + letterShift) % 26))}</td>`).join('')}
        </tr>
      </table>
    </div>
  `;
  
  let numberHtml = `
    <div>
      <h4 style="color: var(--blue-primary); margin-bottom: 10px;">Numbers (0-9, shift ${shift})</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Plain</th>
          ${numbers.split('').map(n => `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;"><strong>${n}</strong></td>`).join('')}
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cipher</th>
          ${numbers.split('').map(n => `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${(parseInt(n) + numberShift) % 10}</td>`).join('')}
        </tr>
      </table>
    </div>
  `;
  
  return `
    <div class="dynamic-table">
      <h4>Caesar Shift Illustration (shift=${shift})</h4>
      ${letterHtml}
      ${numberHtml}
      <p style="margin-top:8px; font-size:12px;">
        🔹 Letters: C = (P + shift) mod 26, P = (C - shift) mod 26<br>
        🔹 Numbers: C = (P + shift) mod 10, P = (C - shift + 10) mod 10
      </p>
    </div>
  `;
}

  // UI State management
  const homeSection = document.getElementById('homeSection');
  const detailContainer = document.getElementById('detailContainer');

  function showHome() {
  homeSection.classList.remove('hidden');
  detailContainer.classList.add('hidden');
  detailContainer.innerHTML = '';
  updateActiveNav('home');  // Call this instead of manual class removal
}
  
  function buildDetailPage(algoId) {
    const configs = {
      caesar: { 
  name: "Caesar Cipher", 
  desc: "The Caesar cipher shifts each letter by a fixed number of positions. Numbers (0-9) are also shifted.", 
  formula: "Letters: C = (P + k) mod 26, P = (C - k) mod 26 | Numbers: C = (P + k) mod 10, P = (C - k) mod 10", 
  keyType: "shift", 
  placeholder: "Shift (0-25)", 
  defaultKey: "3" 
},
playfair: { name: "Playfair Cipher", desc: "Encrypts digraphs using a 5×5 Polybius square based on a keyword.", formula: "Rules: Same row → shift right; Same column → shift down; Rectangle → swap corners.", keyType: "keyword", placeholder: "Keyword (e.g., MONARCHY)", defaultKey: "MONARCHY" },
      vigenere: { name: "Vigenère Cipher", desc: "Polyalphabetic cipher using a keyword and Tabula Recta.", formula: "C_i = (P_i + K_i) mod 26,  P_i = (C_i - K_i) mod 26", keyType: "keyword", placeholder: "Keyword (letters only)", defaultKey: "LEMON" },
      vernam: { name: "Vernam Cipher", desc: "Addition cipher with key same length as message. Perfect secrecy if key is random & same length.", formula: "C_i = P_i + K_i (if >=26 then -26) mod 26, P_i = C_i - K_i (if <0 then +26) mode 26", keyType: "keytext", placeholder: "Key (exact length as message)", defaultKey: "MYKEYX" }
    };
    const cfg = configs[algoId];
    let keyHtml = "";
    if (algoId === "caesar") {
      keyHtml = `<div class="input-group"><label>Shift:</label><input type="number" id="detailKey" value="${cfg.defaultKey}" min="0" max="25" step="1"></div>`;
    } else {
      keyHtml = `<div class="input-group"><label>${cfg.keyType === "keyword" ? "Keyword" : "Secret Key"}:</label><input type="text" id="detailKey" placeholder="${cfg.placeholder}" value="${cfg.defaultKey}"></div>`;
    }

    const html = `
      <div class="algo-detail-container" id="algoDetail_${algoId}">
        <div class="detail-header">
          <h2>${cfg.name}</h2>
          <button class="back-btn" id="backHomeBtn"><i class="fas fa-arrow-left"></i> Back to Home</button>
        </div>
        <div class="algo-description">
          <strong><i class="fas fa-info-circle"></i> How it works:</strong> ${cfg.desc}
          <div class="formula-block"><i class="fas fa-square-root-variable"></i> <strong>Formula:</strong> ${cfg.formula}</div>
        </div>
        <div class="cipher-workspace">
          <div class="input-group">
            <label>Message:</label>
            <textarea id="detailMessage" rows="2" placeholder="Enter your secret message...">HELLO WORLD</textarea>
          </div>
          ${keyHtml}
          
          <div class="action-tabs">
            <button class="tab-btn active" id="encryptTabBtn">Encrypt</button>
            <button class="tab-btn" id="decryptTabBtn">Decrypt</button>
          </div>
          
          <div class="result-table">
            <table>
              <thead>
                <tr><th>Action</th><th>Result</th><th>Copy</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Output</td>
                  <td id="resultField">---</td>
                  <td><button class="copy-btn" data-copy="resultField">Copy</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="dynamicTableContainer"></div>
        </div>
      </div>
    `;
    
    detailContainer.innerHTML = html;
  homeSection.classList.add('hidden');
  detailContainer.classList.remove('hidden');
  
  updateActiveNav(algoId);  // Add this line to update active state

    const msgField = document.getElementById('detailMessage');
    const keyField = document.getElementById('detailKey');
    const resultSpan = document.getElementById('resultField');
    const encryptTab = document.getElementById('encryptTabBtn');
    const decryptTab = document.getElementById('decryptTabBtn');
    const backBtn = document.getElementById('backHomeBtn');
    const dynamicContainer = document.getElementById('dynamicTableContainer');

    let currentMode = true; // true = encrypt, false = decrypt

    // Helper to refresh dynamic tables
    function refreshDynamicTables() {
      if (algoId === 'playfair') {
        let keyword = keyField.value.trim();
        if (!keyword) keyword = "DEFAULT";
        dynamicContainer.innerHTML = renderPlayfairTable(keyword);
      } else if (algoId === 'vigenere') {
        dynamicContainer.innerHTML = renderVigenereTable();
      } else if (algoId === 'vernam') {
        dynamicContainer.innerHTML = renderVernamAsciiTable();
      } else if (algoId === 'caesar') {
        let shift = parseInt(keyField.value, 10);
        if (isNaN(shift)) shift = 3;
        dynamicContainer.innerHTML = renderCaesarShiftHint(shift);
      }
    }

    // Core compute function using currentMode
    function computeResult() {
      let msg = msgField.value;
      let keyVal = keyField.value;
      if (!msg) { resultSpan.innerText = "(empty message)"; return; }
      let output = "";
      try {
        if (algoId === 'caesar') {
          let shift = parseInt(keyVal, 10);
          if (isNaN(shift)) shift = 3;
          output = currentMode ? Caesar.encrypt(msg, shift) : Caesar.decrypt(msg, shift);
        } else if (algoId === 'playfair') {
          if (!keyVal.trim()) keyVal = "DEFAULT";
          output = Playfair.crypt(msg, keyVal, currentMode);
        } else if (algoId === 'vigenere') {
          if (!keyVal.trim()) keyVal = "A";
          output = Vigenere.crypt(msg, keyVal, currentMode);
        } else if (algoId === 'vernam') {
  if (msg.length !== keyVal.length) {
    output = `⚠️ Length mismatch! Message: ${msg.length}, Key: ${keyVal.length}. Please adjust.`;
  } else {
    output = Vernam.process(msg, keyVal, currentMode);
  }
}
        resultSpan.innerText = output;
      } catch(e) { resultSpan.innerText = "Error: " + e.message; }
    }

    // Tab switching logic (merged from extracted tab code)
    function setActiveTab(encryptActive) {
      if (encryptActive) {
        encryptTab.classList.add('active');
        decryptTab.classList.remove('active');
        currentMode = true;
      } else {
        decryptTab.classList.add('active');
        encryptTab.classList.remove('active');
        currentMode = false;
      }
      computeResult(); // recompute when tab changes
    }

    encryptTab.onclick = () => setActiveTab(true);
    decryptTab.onclick = () => setActiveTab(false);
    
    // Real-time update when message or key changes (optional, improves UX)
    msgField.addEventListener('input', () => computeResult());
    keyField.addEventListener('input', () => {
      refreshDynamicTables();
      computeResult();
    });
    
    backBtn.onclick = () => showHome();
    
    // initial dynamic tables & result
    refreshDynamicTables();
    computeResult();

    // Copy functionality (enhanced)
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        let targetId = btn.getAttribute('data-copy');
        let textElem = document.getElementById(targetId);
        if (textElem) {
          navigator.clipboard.writeText(textElem.innerText);
          let originalText = btn.innerText;
          btn.innerText = "✓ Copied!";
          setTimeout(() => btn.innerText = originalText, 1200);
        }
      });
    });
  }

  function init() {
    document.getElementById('homeNavBtn').addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    document.querySelectorAll('.card-btn, .feature-card').forEach(el => {
  const navAttr = el.getAttribute('data-nav');
  if (navAttr) {
    el.addEventListener('click', (e) => { 
      if(e.target.classList.contains('card-btn') || el.classList.contains('feature-card')) { 
        e.stopPropagation(); 
        updateActiveNav(navAttr);  // Add this line
        buildDetailPage(navAttr); 
      } 
    });
  }
});
    document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', (e) => { 
    e.preventDefault(); 
    const algo = link.getAttribute('data-algo'); 
    if(algo) {
      updateActiveNav(algo);  // Add this before or inside buildDetailPage
      buildDetailPage(algo);
    }
  });
});
    showHome();
  }
  init();
